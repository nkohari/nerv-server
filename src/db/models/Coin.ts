import { Model } from 'src/db/framework';

class Coin extends Model {

  static table = 'coins';

  ccid: string;
  name: string;
  algorithm: string;
  blockreward: number;
  blocktime: number;
  networkhashrate: number;

  constructor(data: Partial<Coin> = {}) {
    super(data);
    this.ccid = data.ccid;
    this.name = data.name;
    this.algorithm = data.algorithm;
    this.blockreward = data.blockreward;
    this.blocktime = data.blocktime;
    this.networkhashrate = data.networkhashrate;
  }

  getSecurityContext() {
    return {};
  }

  toJSON() {
    return {
      ...super.toJSON(),
      name: this.name,
      algorithm: this.algorithm,
      blockreward: this.blockreward,
      blocktime: this.blocktime,
      networkhashrate: this.networkhashrate
    };
  }

}

export default Coin;
