import { Handler, Request, Reply } from 'src/http/framework';
import { Membership } from 'src/db';

class ListMembershipsByGroupHandler extends Handler {

  static route = 'get /groups/{groupid}/memberships';

  handle(request: Request, reply: Reply) {
    const { groupid } = request.params;
    this.database.getMany(Membership, { groupid }).then(memberships => {
      reply({ memberships });
    });
  }

}

export default ListMembershipsByGroupHandler;
