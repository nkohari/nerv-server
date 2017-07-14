import { Handler, Request, Reply } from 'src/http/framework';
import { Group } from 'src/db';

class GetGroupHandler extends Handler {

  static route = 'get /groups/{groupid}';

  handle(request: Request, reply: Reply) {
    const { groupid } = request.params;
    this.database.get(Group, groupid).then(group => {
      reply({ group });
    }).catch(reply);
  }

}

export default GetGroupHandler;
