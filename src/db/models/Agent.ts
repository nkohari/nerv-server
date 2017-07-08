import { Model } from '../framework';

class Agent extends Model {

  static table = 'agents';

  userid: string;
  groupid: string;
  name: string;

  constructor(data: Partial<Agent> = {}) {
    super(data);
    this.userid = data.userid;
    this.groupid = data.groupid;
    this.name = data.name;
  }

  getSecurityContext() {
    return { groupid: this.groupid };
  }

  serialize() {
    return {
      userid: this.userid,
      groupid: this.groupid,
      name: this.name
    };
  }

}

export default Agent;
