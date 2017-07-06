import { Request, ReplyNoContinue } from 'hapi';
import Handler from '../../framework/Handler';
import { User, Group, Membership } from '../../../db';

class ListGroupsHandler extends Handler {

  handle(request: Request, reply: ReplyNoContinue) {
    const user: User = request.auth.credentials;

    this.database.getMany(Membership, { userid: user.id }).then(memberships => {
      const groupids = memberships.map(m => m.groupid);
      return this.database.getMany(Group, groupids).then(groups => {
        reply({ groups });
      });
    });

  }

}

export default ListGroupsHandler;
