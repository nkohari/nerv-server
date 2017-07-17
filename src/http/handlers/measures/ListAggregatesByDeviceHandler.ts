import * as Joi from 'joi';
import { Database, MeasureStore } from 'src/db';
import { Handler, Request, Reply } from 'src/http/framework';

type ListAggregatesByDeviceRequest = Request<{}, { from: Date, to: Date }>;

class ListAggregatesByDeviceHandler extends Handler {

  static route = 'get /groups/{groupid}/agents/{agentid}/devices/{deviceid}/history';

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

  handle(request: ListAggregatesByDeviceRequest, reply: Reply) {
    const { groupid, agentid, deviceid } = request.params;
    const { from, to } = request.query;
    this.measureStore.getAggregates({ groupid, agentid, deviceid }, { from, to }).then(aggregates => {
      reply({ aggregates });
    });
  }

}

export default ListAggregatesByDeviceHandler;
