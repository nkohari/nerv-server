import { Request, ReplyNoContinue } from 'hapi';
import * as Joi from 'joi';
import { Handler } from '../../framework';
import { PreloadAgent, PreloadGroup } from '../../preconditions';
import { CreateDeviceCommand } from '../../../db';

class CreateDeviceHandler extends Handler {

  static pre = [
    PreloadGroup,
    PreloadAgent
  ];

  static validate = {
    payload: {
      type: Joi.string().allow('cpu', 'gpu').required(),
      vendor: Joi.string().required(),
      model: Joi.string().required()
    }
  };

  handle(request: Request, reply: ReplyNoContinue) {
    const { agent, group } = request.pre as any;
    const { type, vendor, model } = request.payload;

    const command = new CreateDeviceCommand({
      groupid: group.id,
      agentid: agent.id,
      type,
      vendor,
      model
    });

    this.database.run(command).then(result => {
      const { device } = result;
      reply({ device }).code(201);
    });
  }

}

export default CreateDeviceHandler;
