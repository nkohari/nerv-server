import { Handler, Request, Reply } from 'src/http/framework';
import { Device } from 'src/db';

class GetDeviceHandler extends Handler {

  static route = 'get /groups/{groupid}/agents/{agentid}/devices/{deviceid}';

  handle(request: Request, reply: Reply) {
    const { deviceid } = request.params;
    this.database.get(Device, deviceid).then(device => {
      reply({ device });
    }).catch(reply);
  }

}

export default GetDeviceHandler;
