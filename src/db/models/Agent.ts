import { Audience } from 'src/common';
import { Model } from 'src/db/framework';

class Agent extends Model {

  static table = 'agents';

  groupid: string;
  name: string;

  constructor(data: Partial<Agent> = {}) {
    super(data);
    this.groupid = data.groupid;
    this.name = data.name;
  }

  getAudience() {
    return new Audience({ groupid: this.groupid });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      groupid: this.groupid,
      name: this.name
    };
  }

}

export default Agent;
