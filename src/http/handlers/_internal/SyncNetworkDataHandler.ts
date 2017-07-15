import * as Boom from 'boom';
import { Handler, Request, Reply } from 'src/http/framework';
import { Database, MetadataStore } from 'src/db';
import { getNetworkData } from 'src/utils/cryptoCompare';

class SyncNetworkDataHandler extends Handler {

  static route = 'post /_internal/sync/networkdata';
  static auth = 'admin';

  metadataStore: MetadataStore;

  constructor(database: Database, metadataStore: MetadataStore) {
    super(database);
    this.metadataStore = metadataStore;
  }

  handle(request: Request, reply: Reply) {
    this.metadataStore.getCoins().then(coins => {
      const promises = coins.map(coin => getNetworkData(coin.ccid));
      return Promise.all(promises).then(data => {
        this.metadataStore.addNetworkData(data).then(networkData => {
          reply({ networkData });
        });
      });
    })
    .catch(error => {
      reply(Boom.internal(error));
    });
  }

}

export default SyncNetworkDataHandler;
