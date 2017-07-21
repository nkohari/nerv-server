import * as Joi from 'joi';
import { Database, MeasureStore } from 'src/db';
import { Handler, Request, Reply } from 'src/http/framework';
import dateFromPeriod from 'src/utils/dateFromPeriod';

type ListSamplesByGroupRequest = Request<{}, { period: string }>;

class ListSamplesByGroupHandler extends Handler {

  static route = 'get /groups/{groupid}/samples';

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

  handle(request: ListSamplesByGroupRequest, reply: Reply) {
    const { groupid } = request.params;
    const since = dateFromPeriod(request.query.period);
    this.measureStore.getSamples({ groupid }, since).then(samples => {
      reply({ samples });
    });
  }

}

export default ListSamplesByGroupHandler;
