import Model from '../framework/Model';

class Agent extends Model {

  static table = 'agents';

  userid: string;
  name: string;

  serialize() {
    return {
      userid: this.userid,
      name: this.name
    };
  }

}

export default Agent;
