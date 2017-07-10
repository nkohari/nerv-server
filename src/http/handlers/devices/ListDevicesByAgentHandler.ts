import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from 'src/http/framework';
import { Device } from 'src/db';

class ListDevicesByAgentHandler extends Handler {

  static route = 'get /groups/{groupid}/agents/{agentid}/devices';

  handle(request: Request, reply: ReplyNoContinue) {
    const { agentid } = request.params;
    this.database.getMany(Device, { agentid }).then(devices => {
      reply({ devices });
    });
  }

}

export default ListDevicesByAgentHandler;
