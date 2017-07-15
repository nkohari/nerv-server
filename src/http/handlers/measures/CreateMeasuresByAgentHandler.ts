import * as Joi from 'joi';
import { Handler, Request, Reply } from 'src/http/framework';
import { Database, MeasureStore, Measure } from 'src/db';

type CreateMeasuresByAgentPayload = {
  measures: Partial<Measure>[];
};

class CreateMeasuresByAgentHandler extends Handler {

  static route = 'post /groups/{groupid}/agents/{agentid}/measures';

  static validate = {
    payload: {
      measures: Joi.array().items(Joi.object({
        deviceid: Joi.string().required(),
        coin: Joi.string().required(),
        hashrate: Joi.number().integer().required(),
        load: Joi.number().min(0).max(1).required(),
        power: Joi.number().required(),
        temp: Joi.number().integer().min(0).max(200).required(),
        coreclock: Joi.number().integer().required(),
        ramclock: Joi.number().integer(),
        fanrpm: Joi.number().integer(),
        fanpercent: Joi.number().min(0).max(1)
      }))
    }
  };

  measureStore: MeasureStore;

  constructor(database: Database, measureStore: MeasureStore) {
    super(database);
    this.measureStore = measureStore;
  }

  handle(request: Request<CreateMeasuresByAgentPayload>, reply: Reply) {
    const { groupid, agentid } = request.params;

    const data = request.payload.measures.map(datum => ({
      groupid,
      agentid,
      ...datum
    }));

    this.measureStore.add(data).then(measures => {
      reply({ measures }).code(201);
    });
  }

}

export default CreateMeasuresByAgentHandler;
