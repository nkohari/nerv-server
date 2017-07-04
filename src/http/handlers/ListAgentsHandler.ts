import { Request, ReplyNoContinue } from 'hapi';
import Handler from '../framework/Handler';
import { Agent, GetManyQuery } from '../../db';

class ListAgentsHandler extends Handler {

  handle(request: Request, reply: ReplyNoContinue) {
    const { user } = request.auth.credentials;

    const query = new GetManyQuery(Agent, { userid: user.id });
    this.database.execute(query).then(agents => {
      reply({ agents });
    });
  }

}

export default ListAgentsHandler;
