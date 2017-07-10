import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from 'src/http/framework';
import { Membership } from 'src/db';

class ListMembershipsByGroupHandler extends Handler {

  static route = 'get /groups/{groupid}/memberships/{membershipid}';

  handle(request: Request, reply: ReplyNoContinue) {
    const { groupid } = request.params;
    this.database.getMany(Membership, { groupid }).then(memberships => {
      reply({ memberships });
    });
  }

}

export default ListMembershipsByGroupHandler;
