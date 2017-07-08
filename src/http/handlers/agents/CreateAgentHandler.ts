import { Request, ReplyNoContinue } from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import { Handler } from '../../framework';
import { Agent, Group } from '../../../db';

class CreateAgentHandler extends Handler {

  static validate = {
    payload: {
      name: Joi.string().required()
    }
  };

  handle(request: Request, reply: ReplyNoContinue) {
    const { groupid } = request.params;
    const { name } = request.payload;
    this.database.get(Group, groupid).then(group => {
      if (!group) {
        reply(Boom.notFound(`No group with the id ${groupid} exists`));
      }
      this.database.insert(Agent, { name, groupid }).then(agent => {
        if (!agent) {
          reply(Boom.internal('Error creating agent'));
        } else {
          reply({ agent }).code(201);
        }
      });
    });
  }

}

export default CreateAgentHandler;
