import { Server, ServerConnectionOptions, HTTP_METHODS_PARTIAL } from 'hapi';
import * as Nes from 'nes';
import * as HapiAuthJwt from 'hapi-auth-jwt';
import * as Forge from 'forge-di';
import * as nconf from 'nconf';
import * as Logger from 'bunyan';
import Gatekeeper from './services/Gatekeeper';
import Publisher from './services/Publisher';
import Handler from './framework/Handler';
import { HandlerClass } from './framework/HandlerClass';
import routes from './routes';

class MinebossServer {

  private forge: Forge;
  private log: Logger;
  private server: Server;
  private gatekeeper: Gatekeeper;
  private publisher: Publisher;

  constructor(forge: Forge, log: Logger, gatekeeper: Gatekeeper, publisher: Publisher) {
    this.forge = forge;
    this.log = log;
    this.gatekeeper = gatekeeper;
    this.publisher = publisher;
  }

  start(): Promise<Error> {
    this.server = new Server({
      debug: process.env.NODE_ENV === 'development' ? { request: ['error'] } : null
    });

    const options: ServerConnectionOptions = {
      address: '0.0.0.0',
      port: nconf.get('PORT')
    };

    if (nconf.get('ALLOWED_ORIGINS')) {
      options.routes = {
        cors: {
          origin: nconf.get('ALLOWED_ORIGINS').split(','),
          additionalHeaders: ['Accept-Language']
        }
      };
    }

    this.server.connection(options);

    this.server.on('request-error', (request, err) => {
      this.log.error(err);
    });

    return this.server.register([HapiAuthJwt, Nes])
    .then(() => this.configureAuth())
    .then(() => {
      for (let route in routes) {
        const tokens = route.split(' ', 2);
        const handler = this.forge.get<Handler>('handler', route);
        this.addHandler(tokens[0], tokens[1], routes[route], handler);
      }
      this.publisher.start(this.server);
      return this.server.start();
    });
  }

  stop(): Promise<Error> {
    this.publisher.stop();
    return this.server.stop({ timeout: 5000 });
  }

  configureAuth() {
    this.server.auth.strategy('jwt', 'jwt', 'required', {
      key: nconf.get('AUTH_SECRET'),
      validateFunc: (request, token, callback) => this.gatekeeper.authorize(request, token, callback),
      verifyOptions: {
        algorithms: ['HS256']
      }
    });
  }

  addHandler(verb: string, path: string, handlerClass: HandlerClass, handler: Handler) {
    const name = (<any> handlerClass).name;

    const config = {
      json: { space: 2 },
      auth: (handlerClass.auth != null) ? handlerClass.auth : { mode: 'required' },
      pre: (handlerClass.pre != null) ? handlerClass.pre : null
    };

    this.server.route({
      method: <HTTP_METHODS_PARTIAL> verb,
      path,
      handler: (request, reply) => handler.handle(request, reply),
      config
    });
    this.log.info(`Mounted ${name} at ${verb} ${path}`);
  }

  getServer(): Server {
    return this.server;
  }

  getListeningUrls(): string[] {
    return this.server.connections.map(conn => `${conn.info.protocol}://${conn.info.host}:${conn.info.port}`);
  }

}

export default MinebossServer;
