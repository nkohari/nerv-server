import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from 'src/http/framework';
import { Measure } from 'src/db';

class ListMeasuresByAgentHandler extends Handler {

  static route = 'get /groups/{groupid}/agents/{agentid}/measures';

  handle(request: Request, reply: ReplyNoContinue) {
    const { agentid } = request.params;
    this.database.getMany(Measure, { agentid }).then(measures => {
      reply({ measures });
    });
  }

}

export default ListMeasuresByAgentHandler;
