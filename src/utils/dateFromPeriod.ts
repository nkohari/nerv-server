import * as moment from 'moment';

export default function dateFromPeriod(period: string): Date {
  const [ num, unit ] = period.split(/\s+/, 2);
  return moment.utc().subtract(num as any, unit).toDate();
}
