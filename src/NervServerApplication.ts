import { Application, Environment } from 'src/common/framework';
import { NervServer } from 'src/http';
import NervServerEnvironment from './NervServerEnvironment';

class NervServerApplication extends Application {

  server: NervServer;

  constructor(environment: Environment = new NervServerEnvironment()) {
    super('nerv-server', environment);
  }

  start() {
    super.start();
    this.server = this.forge.get<NervServer>('server');
    this.server.start();
  }

}

export default NervServerApplication;
