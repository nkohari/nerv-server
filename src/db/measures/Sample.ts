class Sample {

  id: string;
  time: Date;
  groupid: string;
  agentid: string;
  deviceid: string;
  symbol: string;
  coins: number;
  hashrate: number;
  load: number;
  power: number;
  coreclock: number;
  ramclock: number;
  temp: number;
  fanpercent: number;
  fanrpm: number;

  constructor(data: any = {}) {
    this.id = data.id;
    this.time = data.time;
    this.groupid = data.groupid;
    this.agentid = data.agentid;
    this.deviceid = data.deviceid;
    this.symbol = data.symbol;
    this.hashrate = data.hashrate;
    this.coins = Number(data.coins);
    this.load = Number(data.load);
    this.power = Number(data.power);
    this.coreclock = data.coreclock;
    this.ramclock = data.ramclock;
    this.temp = Number(data.temp);
    this.fanrpm = data.fanrpm;
    this.fanpercent = Number(data.fanpercent);
  }

  toJSON() {
    return {
      id: this.id,
      time: this.time,
      groupid: this.groupid,
      agentid: this.agentid || undefined,
      deviceid: this.deviceid || undefined,
      symbol: this.symbol,
      hashrate: this.hashrate,
      coins: this.coins,
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

export default Sample;
