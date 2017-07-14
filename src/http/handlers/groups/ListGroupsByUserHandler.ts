import { Handler, Request, Reply } from 'src/http/framework';
import { Group, Membership } from 'src/db';

class ListGroupsByUserHandler extends Handler {

  static route = 'get /groups';

  handle(request: Request, reply: Reply) {
    const { userid } = request.auth.credentials;
    this.database.getMany(Membership, { userid }).then(memberships => {
      const groupids = memberships.map(m => m.groupid);
      return this.database.getMany(Group, { id: groupids }).then(groups => {
        reply({ groups });
      });
    });
  }

}

export default ListGroupsByUserHandler;
