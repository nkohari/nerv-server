import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from 'src/http/framework';

class ListMeasuresByDeviceHandler extends Handler {

  static route = 'get /groups/{groupid}/agents/{agentid}/devices/{deviceid}/measures';

  handle(request: Request, reply: ReplyNoContinue) {
    const { deviceid } = request.params;
    this.measureStore.find({ deviceid }).then(measures => {
      reply({ measures });
    });
  }

}

export default ListMeasuresByDeviceHandler;
