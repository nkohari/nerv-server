import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from 'src/http/framework';
import { Membership } from 'src/db';

class GetMembershipHandler extends Handler {

  static route = 'get /groups/{groupid}/memberships';

  handle(request: Request, reply: ReplyNoContinue) {
    const { membershipid } = request.params;
    this.database.get(Membership, membershipid).then(membership => {
      reply({ membership });
    }).catch(reply);
  }

}

export default GetMembershipHandler;
