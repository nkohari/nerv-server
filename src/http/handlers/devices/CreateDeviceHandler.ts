import { Request, ReplyNoContinue } from 'hapi';
import * as Joi from 'joi';
import { Handler } from 'src/http/framework';
import { PreloadAgent, PreloadGroup } from 'src/http/preconditions';
import { CreateDeviceCommand } from 'src/db';

class CreateDeviceHandler extends Handler {

  static route = 'post /groups/{groupid}/agents/{agentid}/devices';

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
