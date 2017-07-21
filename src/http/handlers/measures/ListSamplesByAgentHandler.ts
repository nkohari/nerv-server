import * as Joi from 'joi';
import { Database, MeasureStore } from 'src/db';
import { Handler, Request, Reply } from 'src/http/framework';
import dateFromPeriod from 'src/utils/dateFromPeriod';

type ListSamplesByAgentRequest = Request<{}, { period: string }>;

class ListSamplesByAgentHandler extends Handler {

  static route = 'get /groups/{groupid}/agents/{agentid}/samples';

  static validate = {
    query: {
      period: Joi.string().regex(/\d+\s+[(months?)|(weeks?)|(days?)|(hours?)|(minutes?)]/).required()
    }
  };

  measureStore: MeasureStore;

  constructor(database: Database, measureStore: MeasureStore) {
    super(database);
    this.measureStore = measureStore;
  }

  handle(request: ListSamplesByAgentRequest, reply: Reply) {
    const { groupid, agentid } = request.params;
    const since = dateFromPeriod(request.query.period);
    this.measureStore.getSamples({ groupid, agentid }, since).then(samples => {
      reply({ samples });
    });
  }

}

export default ListSamplesByAgentHandler;
