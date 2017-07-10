import { Request, ReplyNoContinue } from 'hapi';
import * as Joi from 'joi';
import { Handler } from 'src/http/framework';
import { PreloadGroup } from 'src/http/preconditions';
import { CreateAgentCommand } from 'src/db';

class CreateAgentHandler extends Handler {

  static route = 'post /groups/{groupid}/agents';

  static pre = [
    PreloadGroup
  ];

  static validate = {
    payload: {
      name: Joi.string().required(),
      devices: Joi.array().required().items(Joi.object({
        type: Joi.string().allow('cpu', 'gpu').required(),
        vendor: Joi.string().required(),
        model: Joi.string().required()
      }))
    }
  };

  handle(request: Request, reply: ReplyNoContinue) {
    const { groupid } = request.params;
    const { name } = request.payload;
    const command = new CreateAgentCommand({ name, groupid }, request.payload.devices);
    this.database.run(command).then(result => {
      const { agent, devices } = result;
      reply({ agent, devices }).code(201);
    });
  }

}

export default CreateAgentHandler;
