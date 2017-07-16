import { Database, MeasureStore } from 'src/db';
import { Handler, Request, Reply } from 'src/http/framework';

class ListMeasuresByDeviceHandler extends Handler {

  static route = 'get /groups/{groupid}/agents/{agentid}/devices/{deviceid}/measures';

  measureStore: MeasureStore;

  constructor(database: Database, measureStore: MeasureStore) {
    super(database);
    this.measureStore = measureStore;
  }

  handle(request: Request, reply: Reply) {
    const { groupid, agentid, deviceid } = request.params;
    this.measureStore.getMeasures({ groupid, agentid, deviceid }).then(measures => {
      reply({ measures });
    });
  }

}

export default ListMeasuresByDeviceHandler;
