import * as Joi from 'joi';
import { Database, MeasureStore } from 'src/db';
import { Handler, Request, Reply } from 'src/http/framework';
import dateFromPeriod from 'src/utils/dateFromPeriod';

type ListSamplesByUserRequest = Request<{}, { period: string }>;

class ListSamplesByUserHandler extends Handler {

  static route = 'get /samples';

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

  handle(request: ListSamplesByUserRequest, reply: Reply) {
    const { credentials } = request.auth;
    const since = dateFromPeriod(request.query.period);
    this.measureStore.getSamples({ groupid: credentials.groups }, since).then(samples => {
      reply({ samples });
    });
  }

}

export default ListSamplesByUserHandler;
