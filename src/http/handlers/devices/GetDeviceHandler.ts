import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from '../../framework';
import { Device } from '../../../db';

class GetDeviceHandler extends Handler {

  handle(request: Request, reply: ReplyNoContinue) {
    const { deviceid } = request.params;
    this.database.get(Device, deviceid).then(device => {
      reply({ device });
    }).catch(reply);
  }

}

export default GetDeviceHandler;
