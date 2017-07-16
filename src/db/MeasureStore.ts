import { MessageBus } from 'src/common';
import { Database, Aggregate, Measure } from 'src/db';

interface MeasureGrouping {
  groupid: string | string[];
  agentid?: string | string[];
  deviceid?: string | string[];
}

interface DateRange {
  from?: Date;
  to?: Date;
}

class MeasureStore {

  database: Database;
  messageBus: MessageBus;

  constructor(database: Database, messageBus: MessageBus) {
    this.database = database;
    this.messageBus = messageBus;
  }

  getMeasures(where: MeasureGrouping): Promise<Measure[]> {
    const connection = this.database.getRawConnection();
    return connection('measures').where(where as any).then(rows => {
      return rows.map(row => new Measure(row));
    });
  }

  getAggregates(where: MeasureGrouping, between: DateRange): Promise<Aggregate[]> {
    const connection = this.database.getRawConnection();
    const query = connection('aggregates');

    if (Array.isArray(where.groupid)) {
      query.whereIn('groupid', where.groupid);
    } else {
      query.where({ groupid: where.groupid });
    }

    if (!where.agentid) {
      query.whereNull('agentid');
    } else if (Array.isArray(where.agentid)) {
      query.whereIn('agentid', where.agentid);
    } else {
      query.where({ agentid: where.agentid });
    }

    if (!where.deviceid) {
      query.whereNull('deviceid');
    } else if (Array.isArray(where.deviceid)) {
      query.whereIn('deviceid', where.deviceid);
    } else {
      query.where({ deviceid: where.deviceid });
    }

    if (between.from) {
      query.where('time', '>=', between.from);
    }
    if (between.to) {
      query.where('time', '<=', between.to);
    }

    return query.then(rows => rows.map(row => new Aggregate(row)));
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
        this.messageBus.announceMeasures(measures);
        return measures;
      });
    });
  }

}

export default MeasureStore;
