import * as Boom from 'boom';
import * as Joi from 'joi';
import { Handler, Request, Reply } from 'src/http/framework';
import { Agent } from 'src/db';

class UpdateAgentHandler extends Handler {

  static route = 'put /groups/{groupid}/agents/{agentid}';

  static validate = {
    payload: {
      name: Joi.string().required()
    }
  };

  handle(request: Request<Partial<Agent>>, reply: Reply) {
    const match = { id: request.params.agentid };
    const patch = request.payload;
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
