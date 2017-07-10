import { Request, ReplyNoContinue } from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import { Handler } from 'src/http/framework';
import { Agent } from 'src/db';

class UpdateAgentHandler extends Handler {

  static validate = {
    payload: {
      name: Joi.string().required()
    }
  };

  handle(request: Request, reply: ReplyNoContinue) {
    const match = { id: request.params.agentid };
    const patch = request.payload as Partial<Agent>;
    this.database.update(Agent, match, patch).then(agent => {
      if (!agent) {
        reply(Boom.notFound(`No agent with the id ${match.id} exists`));
      } else {
        reply({ agent });
      }
    });
  }

}

export default UpdateAgentHandler;
