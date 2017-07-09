import { Request, ReplyNoContinue } from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import { Handler } from '../../framework';
import { CreateAgentCommand, Group } from '../../../db';

class CreateAgentHandler extends Handler {

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
    this.database.get(Group, groupid).then(group => {
      if (!group) {
        reply(Boom.notFound(`No group with the id ${groupid} exists`));
      }
      const command = new CreateAgentCommand({ name, groupid }, request.payload.devices);
      this.database.run(command).then(result => {
        const { agent, devices } = result;
        reply({ agent, devices }).code(201);
      });
    });
  }

}

export default CreateAgentHandler;
