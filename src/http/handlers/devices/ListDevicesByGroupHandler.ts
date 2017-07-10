import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from '../../framework';
import { Agent, Device } from '../../../db';

class ListDevicesByGroupHandler extends Handler {

  handle(request: Request, reply: ReplyNoContinue) {
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
