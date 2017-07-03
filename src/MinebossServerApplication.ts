import { Application, Environment } from './framework';
import MinebossServer from './MinebossServer';
import MinebossServerEnvironment from './MinebossServerEnvironment';

class MinebossServerApplication extends Application {

  server: MinebossServer;

  constructor(environment: Environment = new MinebossServerEnvironment()) {
    super('mineboss-server', environment);
  }

  start() {
    super.start();
    this.server = this.forge.get<MinebossServer>('server');
    this.server.start();
  }

}

export default MinebossServerApplication;
