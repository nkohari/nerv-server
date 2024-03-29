import { Handler, Request, Reply } from 'src/http/framework';
import { Agent, Device } from 'src/db';

class ListDevicesByGroupHandler extends Handler {

  static route = 'get /groups/{groupid}/devices';

  handle(request: Request, reply: Reply) {
    const { groupid } = request.params;
    this.database.getMany(Agent, { groupid }).then(agents => {
      const agentids = agents.map(a => a.id);
      this.database.getMany(Device, { agentid: agentids }).then(devices => {
        reply({ devices });
      });
    });
  }

}

export default ListDevicesByGroupHandler;
