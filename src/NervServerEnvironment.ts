import * as Logger from 'bunyan';
import Forge from 'forge-di';
import { Gatekeeper, Keymaster, MessageBus } from 'src/common';
import { Application, Environment } from 'src/common/framework';
import { Database, MeasureStore, MetadataStore } from 'src/db';
import { NervServer } from 'src/http';
import * as handlers from 'src/http/handlers';
import * as preconditions from 'src/http/preconditions';

class ServerEnvironment implements Environment {

  setup(app: Application): Forge {
    const forge = new Forge();

    forge.bind('app').to.instance(app);
    forge.bind('log').to.function(() => Logger.createLogger({
      name: app.name,
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
    }));

    forge.bind('database').to.type(Database);
    forge.bind('gatekeeper').to.type(Gatekeeper);
    forge.bind('keymaster').to.type(Keymaster);
    forge.bind('measureStore').to.type(MeasureStore);
    forge.bind('metadataStore').to.type(MetadataStore);
    forge.bind('messageBus').to.type(MessageBus);
    forge.bind('server').to.type(NervServer);

    for (let name in handlers) {
      const type = handlers[name];
      forge.bind('handler').to.type(type).when(type.name);
    }

    for (let name in preconditions) {
      const type = preconditions[name];
      forge.bind('precondition').to.type(type).when(type.name);
    }

    return forge;
  }

}

export default ServerEnvironment;
