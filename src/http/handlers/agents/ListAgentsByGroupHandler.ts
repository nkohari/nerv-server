import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from 'src/http/framework';
import { Agent } from 'src/db';

class ListAgentsByGroupHandler extends Handler {

  handle(request: Request, reply: ReplyNoContinue) {
    const { groupid } = request.params;
    this.database.getMany(Agent, { groupid }).then(agents => {
      reply({ agents });
    });
  }

}

export default ListAgentsByGroupHandler;
