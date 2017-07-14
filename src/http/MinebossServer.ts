import { Server, ServerConnectionOptions, HTTP_METHODS_PARTIAL } from 'hapi';
import * as Nes from 'nes';
import * as HapiAuthJwt from 'hapi-auth-jwt';
import * as Forge from 'forge-di';
import * as nconf from 'nconf';
import * as Logger from 'bunyan';
import { Gatekeeper, MessageBus } from 'src/common';
import { Handler, HandlerClass, Precondition, PreconditionClass } from 'src/http/framework';
import * as handlers from 'src/http/handlers';

class MinebossServer {

  forge: Forge;
  log: Logger;
  server: Server;
  gatekeeper: Gatekeeper;
  messageBus: MessageBus;

  constructor(forge: Forge, log: Logger, gatekeeper: Gatekeeper, messageBus: MessageBus) {
    this.forge = forge;
    this.log = log;
    this.gatekeeper = gatekeeper;
    this.messageBus = messageBus;
  }

  start(): Promise<Error> {
    this.server = new Server({
      debug: process.env.NODE_ENV === 'development' ? { request: ['error'] } : null
    });

    const options: ServerConnectionOptions = {
      address: '0.0.0.0',
      port: nconf.get('PORT'),
      tls: {
        key: nconf.get('TLS_KEY'),
        cert: nconf.get('TLS_CERT')
      }
    };

    if (nconf.get('ALLOWED_ORIGINS')) {
      options.routes = {
        cors: {
          origin: nconf.get('ALLOWED_ORIGINS').split(','),
          additionalHeaders: ['Accept-Language']
        }
      };
    }

    console.log(options);

    this.server.connection(options);

    this.server.on('request-error', (request, err) => {
      this.log.error(err);
    });

    return this.server.register([HapiAuthJwt, Nes])
    .then(() => this.configureAuth())
    .then(() => {
      for (let name in handlers) {
        const handlerClass = handlers[name] as HandlerClass;
        const tokens = handlerClass.route.split(' ', 2);
        const handler = this.forge.get<Handler>('handler', handlerClass.name);
        this.addHandler(tokens[0], tokens[1], handlerClass, handler);
      }
      this.messageBus.start(this.server);
      return this.server.start();
    });
  }

  stop(): Promise<Error> {
    this.messageBus.stop();
    return this.server.stop({ timeout: 5000 });
  }

  configureAuth() {
    this.server.auth.strategy('token', 'jwt', 'required', {
      key: nconf.get('AUTH_SECRET'),
      verifyOptions: { algorithms: ['HS256'] },
      validateFunc: (request, tokenData, callback) => (
        this.gatekeeper.authorize(request, tokenData, callback)
      )
    });
    this.server.auth.strategy('admin', 'jwt', {
      key: nconf.get('AUTH_SECRET'),
      verifyOptions: { algorithms: ['HS256'] },
      validateFunc: (request, tokenData, callback) => (
        this.gatekeeper.authorizeAdmin(request, tokenData, callback)
      )
    });
  }

  addHandler(verb: string, path: string, handlerClass: HandlerClass, handler: Handler) {
    const resolvePreconditions = (preconditions: PreconditionClass[]) => (
      preconditions.map(type => {
        const precond = this.forge.get<Precondition>('precondition', type.name);
        return {
          assign: type.assign,
          method: (request, reply) => precond.execute(request, reply)
        };
      })
    );

    const config = {
      json: { space: 2 },
      auth: (handlerClass.auth != null) ? handlerClass.auth : { mode: 'required' },
      pre: (handlerClass.pre != null) ? resolvePreconditions(handlerClass.pre) : null,
      validate: (handlerClass.validate != null) ? handlerClass.validate : null
    };

    this.server.route({
      method: <HTTP_METHODS_PARTIAL> verb,
      path,
      handler: (request, reply) => handler.handle(request as any, reply),
      config
    });

    this.log.info(`Mounted ${handlerClass.name} at ${verb} ${path}`);
  }

  getServer(): Server {
    return this.server;
  }

  getListeningUrls(): string[] {
    return this.server.connections.map(conn => `${conn.info.protocol}://${conn.info.host}:${conn.info.port}`);
  }

}

export default MinebossServer;
