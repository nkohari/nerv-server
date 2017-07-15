class NetworkData {

  id: string;
  time: Date;
  symbol: string;
  algorithm: string;
  blockreward: number;
  blocktime: number;
  networkhashrate: number;

  constructor(data: Partial<NetworkData> = {}) {
    this.id = data.id;
    this.time = data.time;
    this.symbol = data.symbol;
    this.algorithm = data.algorithm;
    this.blockreward = data.blockreward;
    this.blocktime = data.blocktime;
    this.networkhashrate = data.networkhashrate;
  }

  toJSON() {
    return {
      id: this.id,
      time: this.time,
      symbol: this.symbol,
      algorithm: this.algorithm,
      blockreward: this.blockreward,
      blocktime: this.blocktime,
      networkhashrate: this.networkhashrate
    };
  }

}

export default NetworkData;
