import * as Joi from 'joi';
import { Database, MeasureStore } from 'src/db';
import { Handler, Request, Reply } from 'src/http/framework';
import dateFromPeriod from 'src/utils/dateFromPeriod';

type ListSamplesByDeviceRequest = Request<{}, { period: string }>;

class ListSamplesByDeviceHandler extends Handler {

  static route = 'get /groups/{groupid}/agents/{agentid}/devices/{deviceid}/samples';

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

  handle(request: ListSamplesByDeviceRequest, reply: Reply) {
    const { groupid, agentid, deviceid } = request.params;
    const since = dateFromPeriod(request.query.period);
    this.measureStore.getSamples({ groupid, agentid, deviceid }, since).then(samples => {
      reply({ samples });
    });
  }

}

export default ListSamplesByDeviceHandler;
