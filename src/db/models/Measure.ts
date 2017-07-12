import { Model } from 'src/db/framework';

class Measure extends Model {

  static table = 'measures';

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

  constructor(data: Partial<Measure> = {}) {
    super(data);
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

  getSecurityContext() {
    return { groupid: this.groupid };
  }

  toJSON() {
    return {
      ...super.toJSON(),
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

export default Measure;
