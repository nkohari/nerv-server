import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from '../../framework';
import { Membership } from '../../../db';

class GetMembershipHandler extends Handler {

  handle(request: Request, reply: ReplyNoContinue) {
    const { membershipid } = request.params;
    this.database.get(Membership, membershipid).then(membership => {
      reply({ membership });
    }).catch(reply);
  }

}

export default GetMembershipHandler;
