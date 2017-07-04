import Model from '../framework/Model';

class Event extends Model {

  static table = 'events';

  id: string;
  userid: string;
  agentid: string;
  deviceid: string;
  properties: object;

  serialize() {
    return {
      userid: this.userid,
      agentid: this.agentid,
      deviceid: this.deviceid,
      ...this.properties
    };
  }

}

export default Event;
