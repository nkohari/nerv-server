import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from 'src/http/framework';

class ListMeasuresByAgentHandler extends Handler {

  static route = 'get /groups/{groupid}/agents/{agentid}/measures';

  handle(request: Request, reply: ReplyNoContinue) {
    const { agentid } = request.params;
    this.measureStore.find({ agentid }).then(measures => {
      reply({ measures });
    });
  }

}

export default ListMeasuresByAgentHandler;
