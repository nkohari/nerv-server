type AggregateGroup = {
  coins?: number;
  hashrate?: number;
  load?: number;
  power?: number;
  coreclock?: number;
  ramclock?: number;
  temp?: number;
  fanpercent?: number;
  fanrpm?: number;
};

class Aggregate {

  id: string;
  time: Date;
  groupid: string;
  agentid: string;
  deviceid: string;
  symbol: string;
  tot: AggregateGroup;
  avg: AggregateGroup;
  min: AggregateGroup;
  max: AggregateGroup;

  constructor(data: any = {}) {
    this.id = data.id;
    this.time = data.time;
    this.groupid = data.groupid;
    this.agentid = data.agentid;
    this.deviceid = data.deviceid;
    this.symbol = data.symbol;
    this.tot = {
      hashrate: Number(data.tot_hashrate),
      coins: Number(data.tot_coins)
    };
    this.avg = {
      hashrate: data.avg_hashrate,
      coins: Number(data.avg_coins),
      load: Number(data.avg_load),
      power: Number(data.avg_power),
      coreclock: data.avg_coreclock,
      ramclock: data.avg_ramclock,
      temp: data.avg_temp,
      fanpercent: Number(data.avg_fanpercent),
      fanrpm: data.avg_fanrpm
    };
    this.min = {
      hashrate: data.min_hashrate,
      load: Number(data.min_load),
      power: Number(data.min_power),
      coreclock: data.min_coreclock,
      ramclock: data.min_ramclock,
      temp: data.min_temp,
      fanpercent: Number(data.min_fanpercent),
      fanrpm: data.min_fanrpm
    };
    this.max = {
      hashrate: data.max_hashrate,
      load: Number(data.max_load),
      power: Number(data.max_power),
      coreclock: data.max_coreclock,
      ramclock: data.max_ramclock,
      temp: data.max_temp,
      fanpercent: Number(data.max_fanpercent),
      fanrpm: data.max_fanrpm
    };
  }

  toJSON() {
    return {
      id: this.id,
      time: this.time,
      groupid: this.groupid,
      agentid: this.agentid || undefined,
      deviceid: this.deviceid || undefined,
      symbol: this.symbol,
      tot: this.tot,
      avg: this.avg,
      min: this.min,
      max: this.max
    };
  }

}

export default Aggregate;
