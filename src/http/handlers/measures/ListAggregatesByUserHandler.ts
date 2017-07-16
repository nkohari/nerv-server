import * as Joi from 'joi';
import { Database, MeasureStore } from 'src/db';
import { Handler, Request, Reply } from 'src/http/framework';

type ListAggregatesByUserRequest = Request<{}, { from: Date, to: Date }>;

class ListAggregatesByUserHandler extends Handler {

  static route = 'get /history';

  static validate = {
    query: {
      from: Joi.string().isoDate().allow(null).default(null),
      to: Joi.string().isoDate().allow(null).default(null)
    }
  };

  measureStore: MeasureStore;

  constructor(database: Database, measureStore: MeasureStore) {
    super(database);
    this.measureStore = measureStore;
  }

  handle(request: ListAggregatesByUserRequest, reply: Reply) {
    const { credentials } = request.auth;
    const { from, to } = request.query;
    this.measureStore.getAggregates({ groupid: credentials.groups }, { from, to }).then(aggregates => {
      reply({ aggregates });
    });
  }

}

export default ListAggregatesByUserHandler;
