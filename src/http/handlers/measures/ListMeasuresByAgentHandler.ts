import { Handler, Request, Reply } from 'src/http/framework';

class ListMeasuresByAgentHandler extends Handler {

  static route = 'get /groups/{groupid}/agents/{agentid}/measures';

  handle(request: Request, reply: Reply) {
    const { agentid } = request.params;
    this.measureStore.getMeasures({ agentid }).then(measures => {
      reply({ measures });
    });
  }

}

export default ListMeasuresByAgentHandler;
