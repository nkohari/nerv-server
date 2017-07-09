import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from '../../framework';
import { Device } from '../../../db';

class ListDevicesByAgentHandler extends Handler {

  handle(request: Request, reply: ReplyNoContinue) {
    const { agentid } = request.params;
    this.database.getMany(Device, { agentid }).then(devices => {
      reply({ devices });
    });
  }

}

export default ListDevicesByAgentHandler;
