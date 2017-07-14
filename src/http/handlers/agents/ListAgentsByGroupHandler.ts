import { Handler, Request, Reply } from 'src/http/framework';
import { Agent } from 'src/db';

class ListAgentsByGroupHandler extends Handler {

  static route = 'get /groups/{groupid}/agents';

  handle(request: Request, reply: Reply) {
    const { groupid } = request.params;
    this.database.getMany(Agent, { groupid }).then(agents => {
      reply({ agents });
    });
  }

}

export default ListAgentsByGroupHandler;
