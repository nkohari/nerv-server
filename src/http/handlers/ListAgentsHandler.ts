import { Request, ReplyNoContinue } from 'hapi';
import Handler from '../framework/Handler';
import { Agent } from '../../db';

class ListAgentsHandler extends Handler {

  handle(request: Request, reply: ReplyNoContinue) {
    const { user } = request.auth.credentials;

    this.database.getMany(Agent, { userid: user.id }).then(agents => {
      reply({ agents });
    });

  }

}

export default ListAgentsHandler;
