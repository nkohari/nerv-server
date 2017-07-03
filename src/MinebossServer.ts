import * as nconf from 'nconf';
import * as hapiAuthJwt from 'hapi-auth-jwt';
import * as Forge from 'forge-di';
import * as Logger from 'bunyan';
import { Server, HTTP_METHODS_PARTIAL } from 'hapi';
import { Handler, HandlerClass } from './framework';
import { Gatekeeper } from './services';
import routes from './routes';

class MinebossServer {

  private forge: Forge;
  private log: Logger;
  private server: Server;
  private gatekeeper: Gatekeeper;

  constructor(forge: Forge, log: Logger, gatekeeper: Gatekeeper) {
    this.forge = forge;
    this.log = log;
    this.gatekeeper = gatekeeper;
  }

  start(): Promise<Error> {
    this.server = new Server({
      debug: process.env.NODE_ENV === 'development' ? { request: ['error'] } : null
    });

    this.server.connection({
      address: '0.0.0.0',
      port: nconf.get('PORT')
    });

    this.server.on('request-error', (request, err) => {
      this.log.error(err);
    });

    Object.keys(routes).forEach(route => {
      const tokens = route.split(' ', 2);
      const handler = this.forge.get<Handler>('handler', route);
      this.addHandler(tokens[0], tokens[1], routes[route], handler);
    });

    return this.server.register([
      hapiAuthJwt
    ])
    .then(() => this.configureAuth())
    .then(() => this.server.start());
  }

  configureAuth() {
    this.server.auth.strategy('jwt', 'jwt', 'required', {
      key: nconf.get('SECRET'),
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
      ...handlerClass.config
    };
    this.server.route({
      method: <HTTP_METHODS_PARTIAL> verb,
      path,
      handler: (request, reply) => handler.handle(request, reply),
      config
    });
    this.log.info(`Mounted ${name} at ${verb} ${path}`);
  }

  getListeningUrls() {
    return this.server.connections.map(conn => `${conn.info.protocol}://${conn.info.host}:${conn.info.port}`);
  }

}

export default MinebossServer;
