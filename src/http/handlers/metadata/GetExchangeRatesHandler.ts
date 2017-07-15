import * as Boom from 'boom';
import * as Joi from 'joi';
import { Handler, Request, Reply } from 'src/http/framework';
import { Database, MetadataStore } from 'src/db';

type GetExchangeRatesRequest = Request<{}, { currency: string }>;

class GetExchangeRatesHandler extends Handler {

  static route = 'get /metadata/exchangerates';

  static validate = {
    query: {
      currency: Joi.string().required()
    }
  };

  metadataStore: MetadataStore;

  constructor(database: Database, metadataStore: MetadataStore) {
    super(database);
    this.metadataStore = metadataStore;
  }

  handle(request: GetExchangeRatesRequest, reply: Reply) {
    const currency = request.query.currency.toUpperCase();
    this.metadataStore.getCurrentExchangeRates(currency).then(exchangeRates => {
      reply({ exchangeRates });
    })
    .catch(error => {
      reply(Boom.internal(error));
    });
  }

}

export default GetExchangeRatesHandler;
