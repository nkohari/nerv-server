import { Handler, Request, Reply } from 'src/http/framework';
import { Agent } from 'src/db';

class GetAgentHandler extends Handler {

  static route = 'get /groups/{groupid}/agents/{agentid}';

  handle(request: Request, reply: Reply) {
    const { agentid } = request.params;
    this.database.get(Agent, agentid).then(agent => {
      reply({ agent });
    }).catch(reply);
  }

}

export default GetAgentHandler;
