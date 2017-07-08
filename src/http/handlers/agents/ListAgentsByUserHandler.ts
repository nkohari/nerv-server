import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from '../../framework';
import { Agent, Membership } from '../../../db';

class ListAgentsByUserHandler extends Handler {

  handle(request: Request, reply: ReplyNoContinue) {
    const { userid } = request.auth.credentials;
    this.database.getMany(Membership, { userid }).then(memberships => {
      const groupids = memberships.map(m => m.groupid);
      this.database.getMany(Agent, groupids).then(agents => {
        reply({ agents });
      });
    });
  }

}

export default ListAgentsByUserHandler;
