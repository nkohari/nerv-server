import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from '../../framework';
import { Group, Membership } from '../../../db';

class ListGroupsHandler extends Handler {

  handle(request: Request, reply: ReplyNoContinue) {
    const { userid } = request.auth.credentials;
    this.database.getMany(Membership, { userid }).then(memberships => {
      const groupids = memberships.map(m => m.groupid);
      return this.database.getMany(Group, groupids).then(groups => {
        reply({ groups });
      });
    });

  }

}

export default ListGroupsHandler;
