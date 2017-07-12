import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from 'src/http/framework';
import { Measure } from 'src/db';

class ListMeasuresByDeviceHandler extends Handler {

  static route = 'get /groups/{groupid}/agents/{agentid}/devices/{deviceid}/measures';

  handle(request: Request, reply: ReplyNoContinue) {
    const { deviceid } = request.params;
    this.database.getMany(Measure, { deviceid }).then(measures => {
      reply({ measures });
    });
  }

}

export default ListMeasuresByDeviceHandler;
