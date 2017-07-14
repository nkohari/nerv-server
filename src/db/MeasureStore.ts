import { MessageBus } from 'src/common';
import { Database, Aggregate, Measure } from 'src/db';

interface GetMeasuresOptions {
  groupid?: string;
  agentid?: string;
  deviceid?: string;
}

class MeasureStore {

  database: Database;
  messageBus: MessageBus;

  constructor(database: Database, messageBus: MessageBus) {
    this.database = database;
    this.messageBus = messageBus;
  }

  getAggregates(where: GetMeasuresOptions, from: Date, to: Date): Promise<Aggregate[]> {
    return Promise.resolve([]); // TODO
  }

  getMeasures(where: GetMeasuresOptions): Promise<Measure[]> {
    const connection = this.database.getRawConnection();
    return connection('measures').where(where as any).then(rows => {
      return rows.map(row => new Measure(row));
    });
  }

  add(data: Partial<Measure>[]): Promise<Measure[]> {
    const connection = this.database.getRawConnection();
    return connection.transaction(transaction => {
      return Promise.all(
        data.map(item => (
          transaction('measures').insert(item)
          .returning('*')
          .then(rows => (rows.length === 0) ? null : new Measure(rows[0]))
        ))
      ).then(measures => {
        this.messageBus.announceData(measures);
        return measures;
      });
    });
  }

}

export default MeasureStore;
