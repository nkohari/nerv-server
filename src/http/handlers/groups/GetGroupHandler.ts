import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from '../../framework';
import { Group } from '../../../db';

class GetGroupHandler extends Handler {

  handle(request: Request, reply: ReplyNoContinue) {
    const { groupid } = request.params;
    this.database.get(Group, groupid).then(group => {
      reply({ group });
    }).catch(reply);
  }

}

export default GetGroupHandler;
