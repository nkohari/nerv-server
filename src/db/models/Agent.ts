import { Model } from '../framework';

class Agent extends Model {

  static table = 'agents';

  groupid: string;
  name: string;

  constructor(data: Partial<Agent> = {}) {
    super(data);
    this.groupid = data.groupid;
    this.name = data.name;
  }

  getSecurityContext() {
    return { groupid: this.groupid };
  }

  serialize() {
    return {
      groupid: this.groupid,
      name: this.name
    };
  }

}

export default Agent;
