import { Request, ReplyNoContinue } from 'hapi';
import * as Joi from 'joi';
import { Handler } from 'src/http/framework';
import { CreateManyMeasuresCommand } from 'src/db';

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

  handle(request: Request, reply: ReplyNoContinue) {
    const { groupid, agentid } = request.params;

    const measureDefs = request.payload.measures.map(measureDef => ({
      groupid,
      agentid,
      ...measureDef
    }));

    const command = new CreateManyMeasuresCommand(measureDefs);
    this.database.run(command).then(result => {
      const { measures } = result;
      reply({ measures }).code(201);
    });
  }

}

export default CreateMeasuresByAgentHandler;
