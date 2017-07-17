import * as Joi from 'joi';
import { Database, MeasureStore } from 'src/db';
import { Handler, Request, Reply } from 'src/http/framework';

type ListAggregatesByAgentRequest = Request<{}, { from: Date, to: Date }>;

class ListAggregatesByAgentHandler extends Handler {

  static route = 'get /groups/{groupid}/agents/{agentid}/history';

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

  handle(request: ListAggregatesByAgentRequest, reply: Reply) {
    const { groupid, agentid } = request.params;
    const { from, to } = request.query;
    this.measureStore.getAggregates({ groupid, agentid }, { from, to }).then(aggregates => {
      reply({ aggregates });
    });
  }

}

export default ListAggregatesByAgentHandler;
