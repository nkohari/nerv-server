import { Database, MeasureStore } from 'src/db';
import { Handler, Request, Reply } from 'src/http/framework';

class ListMeasuresByGroupHandler extends Handler {

  static route = 'get /groups/{groupid}/measures';

  measureStore: MeasureStore;

  constructor(database: Database, measureStore: MeasureStore) {
    super(database);
    this.measureStore = measureStore;
  }

  handle(request: Request, reply: Reply) {
    const { groupid } = request.params;
    this.measureStore.getMeasures({ groupid }).then(measures => {
      reply({ measures });
    });
  }

}

export default ListMeasuresByGroupHandler;
