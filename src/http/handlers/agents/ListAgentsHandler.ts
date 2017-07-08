import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from '../../framework';
import { Agent } from '../../../db';

class ListAgentsHandler extends Handler {

  handle(request: Request, reply: ReplyNoContinue) {
    const { groupid } = request.params;

    this.database.getMany(Agent, { groupid }).then(agents => {
      reply({ agents });
    });

  }

}

export default ListAgentsHandler;
