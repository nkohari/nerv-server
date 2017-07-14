import { Handler, Request, Reply } from 'src/http/framework';
import { Membership } from 'src/db';

class GetMembershipHandler extends Handler {

  static route = 'get /groups/{groupid}/memberships/{membershipid}';

  handle(request: Request, reply: Reply) {
    const { membershipid } = request.params;
    this.database.get(Membership, membershipid).then(membership => {
      reply({ membership });
    }).catch(reply);
  }

}

export default GetMembershipHandler;
