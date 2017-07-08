import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from '../../framework';
import { Membership } from '../../../db';

class ListMembershipsHandler extends Handler {

  handle(request: Request, reply: ReplyNoContinue) {
    const { groupid } = request.params;
    this.database.getMany(Membership, { groupid }).then(memberships => {
      reply({ memberships });
    });
  }

}

export default ListMembershipsHandler;
