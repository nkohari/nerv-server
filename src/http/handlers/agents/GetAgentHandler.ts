import { Request, ReplyNoContinue } from 'hapi';
import Handler from '../../framework/Handler';
import { Agent } from '../../../db';

class GetAgentHandler extends Handler {

  handle(request: Request, reply: ReplyNoContinue) {
    const { agentid } = request.params;
    this.database.get(Agent, agentid).then(agent => {
      reply({ agent });
    }).catch(reply);
  }

}

export default GetAgentHandler;
