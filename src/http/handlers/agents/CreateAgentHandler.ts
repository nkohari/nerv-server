import * as Joi from 'joi';
import { Handler, Request, Reply } from 'src/http/framework';
import { CreateAgentCommand, Device } from 'src/db';

type CreateAgentHandlerPayload = {
  name: string;
  devices: Partial<Device>[];
};

class CreateAgentHandler extends Handler {

  static route = 'post /groups/{groupid}/agents';

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

  handle(request: Request<CreateAgentHandlerPayload>, reply: Reply) {
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
