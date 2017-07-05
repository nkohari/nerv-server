import { Model } from '../framework';

class Agent extends Model {

  static table = 'agents';

  userid: string;
  name: string;

  constructor(data: Partial<Agent> = {}) {
    super(data);
    this.userid = data.userid;
    this.name = data.name;
  }

  serialize() {
    return {
      userid: this.userid,
      name: this.name
    };
  }

}

export default Agent;
