import * as Logger from 'bunyan';
import Forge from 'forge-di';
import { Database } from './db';
import { Application, Environment } from './framework';
import { MinebossServer, Gatekeeper, Keymaster, Publisher, routes } from './http';

class ServerEnvironment implements Environment {

  setup(app: Application): Forge {
    const forge = new Forge();

    forge.bind('app').to.instance(app);
    forge.bind('log').to.function(() => Logger.createLogger({
      name: app.name,
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
    }));

    forge.bind('server').to.type(MinebossServer);
    forge.bind('database').to.type(Database);
    forge.bind('publisher').to.type(Publisher);
    forge.bind('gatekeeper').to.type(Gatekeeper);
    forge.bind('keymaster').to.type(Keymaster);

    Object.keys(routes).forEach(route => {
      forge.bind('handler').to.type(routes[route]).when(route);
    });

    return forge;
  }

}

export default ServerEnvironment;
