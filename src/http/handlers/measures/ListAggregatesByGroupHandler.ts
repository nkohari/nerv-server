import * as Joi from 'joi';
import { Database, MeasureStore } from 'src/db';
import { Handler, Request, Reply } from 'src/http/framework';

type ListAggregatesByGroupRequest = Request<{}, { from: Date, to: Date }>;

class ListAggregatesByGroupHandler extends Handler {

  static route = 'get /groups/{groupid}/history';

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

  handle(request: ListAggregatesByGroupRequest, reply: Reply) {
    const { groupid } = request.params;
    const { from, to } = request.query;
    this.measureStore.getAggregates({ groupid }, { from, to }).then(aggregates => {
      reply({ aggregates });
    });
  }

}

export default ListAggregatesByGroupHandler;
