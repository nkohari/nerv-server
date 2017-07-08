import * as Logger from 'bunyan';
import Forge from 'forge-di';
import { Database } from './db';
import { MinebossServer, routes } from './http';
import { Application, Environment, Gatekeeper, Keymaster, MessageBus } from './common';

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
    forge.bind('gatekeeper').to.type(Gatekeeper);
    forge.bind('keymaster').to.type(Keymaster);
    forge.bind('messageBus').to.type(MessageBus);

    Object.keys(routes).forEach(route => {
      forge.bind('handler').to.type(routes[route]).when(route);
    });

    return forge;
  }

}

export default ServerEnvironment;
