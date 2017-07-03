import * as Logger from 'bunyan';
import Forge from 'forge-di';
import { Database } from './db';
import { Application, Environment } from './framework';
import { Gatekeeper } from './services';
import MinebossServer from './MinebossServer';
import routes from './routes';

class ServerEnvironment implements Environment {

  setup(app: Application): Forge {
    const forge = new Forge();

    forge.bind('app').to.instance(app);
    forge.bind('log').to.function(() => Logger.createLogger({ name: app.name }));

    forge.bind('server').to.type(MinebossServer);
    forge.bind('database').to.type(Database);
    forge.bind('gatekeeper').to.type(Gatekeeper);

    Object.keys(routes).forEach(route => {
      forge.bind('handler').to.type(routes[route]).when(route);
    });

    return forge;
  }

}

export default ServerEnvironment;
