import * as Boom from 'boom';
import * as Joi from 'joi';
import { Handler, Request, Reply } from 'src/http/framework';
import { Database, MetadataStore } from 'src/db';

type GetNetworkDataRequest = Request<{}, { symbol: string }>;

class GetNetworkDataHandler extends Handler {

  static route = 'get /metadata/networkdata';

  static validate = {
    query: {
      symbol: Joi.string().required()
    }
  };

  metadataStore: MetadataStore;

  constructor(database: Database, metadataStore: MetadataStore) {
    super(database);
    this.metadataStore = metadataStore;
  }

  handle(request: GetNetworkDataRequest, reply: Reply) {
    const symbol = request.query.symbol.toUpperCase();
    this.metadataStore.getCurrentNetworkData(symbol).then(networkData => {
      reply({ networkData });
    })
    .catch(error => {
      reply(Boom.internal(error));
    });
  }

}

export default GetNetworkDataHandler;
