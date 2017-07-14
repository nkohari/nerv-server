import { Handler, Request, Reply } from 'src/http/framework';

class ListMeasuresByDeviceHandler extends Handler {

  static route = 'get /groups/{groupid}/agents/{agentid}/devices/{deviceid}/measures';

  handle(request: Request, reply: Reply) {
    const { deviceid } = request.params;
    this.measureStore.getMeasures({ deviceid }).then(measures => {
      reply({ measures });
    });
  }

}

export default ListMeasuresByDeviceHandler;
