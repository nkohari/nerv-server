import * as Boom from 'boom';
import { Database, MetadataStore } from 'src/db';
import { Precondition, Request, Reply } from 'src/http/framework';

type CheckCurrencyRequest = Request<{ currency: string }>;

class CheckCurrency extends Precondition {

  metadataStore: MetadataStore;

  constructor(database: Database, metadataStore: MetadataStore) {
    super(database);
    this.metadataStore = metadataStore;
  }

  execute(request: CheckCurrencyRequest, reply: Reply) {
    const { currency } = request.payload;

    this.metadataStore.hasCurrency(currency).then(exists => {
      if (!exists) {
        reply(Boom.badRequest(`Unknown currency ${currency}`));
      } else {
        reply();
      }
    });
  }

}

export default CheckCurrency;
