import { Request, ReplyNoContinue } from 'hapi';
import * as Boom from 'boom';
import { Agent } from 'src/db';
import { Precondition } from 'src/http/framework';

class PreloadAgent extends Precondition {

  static assign = 'agent';

  execute(request: Request, reply: ReplyNoContinue) {
    const { agentid } = request.params;

    if (!agentid) {
      reply(Boom.badRequest('No agentid specified on route'));
    }

    this.database.get(Agent, agentid).then(agent => {
      reply(agent);
    });
  }

}

export default PreloadAgent;
