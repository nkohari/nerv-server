import * as uuid from 'uuid/v4';
import { MessageBus } from 'src/common';
import { Database, Measure } from 'src/db';

type AggregateType = 'avg' | 'min' | 'max';

interface MeasureKeys {
  groupid?: string;
  agentid?: string;
  deviceid?: string;
}

interface TimePeriod {
  year?: number;
  month?: number;
  week?: number;
  day?: number;
  hour?: number;
}

class MeasureStore {

  database: Database;
  messageBus: MessageBus;

  constructor(database: Database, messageBus: MessageBus) {
    this.database = database;
    this.messageBus = messageBus;
  }

  aggregate(type: AggregateType, where: MeasureKeys, period: TimePeriod): Promise<any> {
    return Promise.resolve(null); // TODO
  }

  find(where: MeasureKeys): Promise<Measure[]> {
    const connection = this.database.getRawConnection();
    return connection('measures').where(where as any).then(rows => {
      return rows.map(row => new Measure(row));
    });
  }

  add(data: Partial<Measure>[]): Promise<Measure[]> {
    const connection = this.database.getRawConnection();
    return connection.transaction(transaction => {
      return Promise.all(
        data.map(item => transaction('measures').insert({
          id: uuid(),
          ...(item as object)
        })
        .returning('*')
        .then(rows => (rows.length === 0) ? null : new Measure(rows[0]))
      )).then(measures => {
        this.messageBus.announceData(measures);
        return measures;
      });
    });
  }

}

export default MeasureStore;
