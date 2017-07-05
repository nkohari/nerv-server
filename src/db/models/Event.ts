import { Model } from '../framework';

class Event extends Model {

  static table = 'events';

  id: string;
  userid: string;
  agentid: string;
  deviceid: string;
  properties: object;

  constructor(data: Partial<Event> = {}) {
    super(data);
    this.userid = data.userid;
    this.agentid = data.agentid;
    this.deviceid = data.deviceid;
    this.properties = { ...data.properties };
  }

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
