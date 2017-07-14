class Aggregate {

  id: string;
  year: number;
  month: number;
  week: number;
  day: number;
  hour: number;
  groupid: string;
  agentid: string;
  deviceid: string;
  coin: string;
  hashrate: number;
  load: number;
  power: number;
  coreclock: number;
  ramclock: number;
  temp: number;
  fanpercent: number;
  fanrpm: number;

  constructor(data: Partial<Aggregate> = {}) {
    this.id = data.id;
    this.year = data.year;
    this.month = data.month;
    this.week = data.week;
    this.day = data.day;
    this.hour = data.hour;
    this.groupid = data.groupid;
    this.agentid = data.agentid;
    this.deviceid = data.deviceid;
    this.coin = data.coin;
    this.hashrate = data.hashrate;
    this.load = data.load;
    this.power = data.power;
    this.coreclock = data.coreclock;
    this.ramclock = data.ramclock;
    this.temp = data.temp;
    this.fanrpm = data.fanrpm;
    this.fanpercent = data.fanpercent;
  }

  toJSON() {
    return {
      id: this.id,
      year: this.year,
      month: this.month,
      week: this.week,
      day: this.day,
      hour: this.hour,
      groupid: this.groupid,
      agentid: this.agentid,
      deviceid: this.deviceid,
      coin: this.coin,
      hashrate: this.hashrate,
      load: this.load,
      power: this.power,
      coreclock: this.coreclock,
      ramclock: this.ramclock,
      temp: this.temp,
      fanrpm: this.fanrpm,
      fanpercent: this.fanpercent
    };
  }

}

export default Aggregate;
