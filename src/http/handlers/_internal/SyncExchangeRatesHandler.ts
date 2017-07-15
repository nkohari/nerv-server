import * as Boom from 'boom';
import { Handler, Request, Reply } from 'src/http/framework';
import { Database, MetadataStore } from 'src/db';
import { getExchangeRates } from 'src/utils/cryptoCompare';

class SyncExchangeRatesHandler extends Handler {

  static route = 'post /_internal/sync/exchangerates';
  static auth = 'admin';

  metadataStore: MetadataStore;

  constructor(database: Database, metadataStore: MetadataStore) {
    super(database);
    this.metadataStore = metadataStore;
  }

  handle(request: Request, reply: Reply) {
    this.metadataStore.getCoins().then(coins => {
      this.metadataStore.getCurrencies().then(currencies => {
        getExchangeRates(coins, currencies).then(data => {
          this.metadataStore.addExchangeRates(data).then(exchangeRates => {
            reply({ exchangeRates });
          });
        });
      });
    })
    .catch(error => {
      reply(Boom.internal(error));
    });
  }

}

export default SyncExchangeRatesHandler;
