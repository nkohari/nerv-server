import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from 'src/http/framework';
import { Group } from 'src/db';

class GetGroupHandler extends Handler {

  static route = 'get /groups/{groupid}';

  handle(request: Request, reply: ReplyNoContinue) {
    const { groupid } = request.params;
    this.database.get(Group, groupid).then(group => {
      reply({ group });
    }).catch(reply);
  }

}

export default GetGroupHandler;
