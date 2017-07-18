import { MessageBus } from 'src/common';
import { Database, Measure, Sample } from 'src/db';

interface MeasureGrouping {
  groupid: string | string[];
  agentid?: string | string[];
  deviceid?: string | string[];
}

class MeasureStore {

  database: Database;
  messageBus: MessageBus;

  constructor(database: Database, messageBus: MessageBus) {
    this.database = database;
    this.messageBus = messageBus;
  }

  getSamples(where: MeasureGrouping, since: Date): Promise<Sample[]> {
    const connection = this.database.getRawConnection();
    const query = connection('samples');

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

    return query
    .where('time', '>=', since)
    .orderBy('time', 'asc')
    .then(rows => rows.map(row => new Sample(row)));
  }

  recordMeasures(groupid: string, agentid: string, data: Partial<Measure>[]): Promise<Measure[]> {
    const connection = this.database.getRawConnection();
    return connection.transaction(transaction => {
      return Promise.all(
        data.map(item => (
          transaction('measures').insert(item)
          .returning('*')
          .then(rows => {
            if (rows.length === 0) return null;
            return new Measure({
              groupid,
              agentid,
              ...rows[0]
            });
          })
        ))
      ).then(measures => {
        this.messageBus.announceMeasures(measures);
        return measures;
      });
    });
  }

}

export default MeasureStore;
