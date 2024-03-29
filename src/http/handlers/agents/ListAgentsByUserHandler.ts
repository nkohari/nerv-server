import { Handler, Request, Reply } from 'src/http/framework';
import { Agent, Membership } from 'src/db';

class ListAgentsByUserHandler extends Handler {

  static route = 'get /agents';

  handle(request: Request, reply: Reply) {
    const { userid } = request.auth.credentials;
    this.database.getMany(Membership, { userid }).then(memberships => {
      const groupids = memberships.map(m => m.groupid);
      this.database.getMany(Agent, { groupid: groupids }).then(agents => {
        reply({ agents });
      });
    });
  }

}

export default ListAgentsByUserHandler;
