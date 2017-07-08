import { Model } from '../framework';

class Event extends Model {

  static table = 'events';

  id: string;
  groupid: string;
  agentid: string;
  deviceid: string;
  properties: object;

  constructor(data: Partial<Event> = {}) {
    super(data);
    this.groupid = data.groupid;
    this.agentid = data.agentid;
    this.deviceid = data.deviceid;
    this.properties = { ...data.properties };
  }

  getSecurityContext() {
    return { groupid: this.groupid };
  }

  serialize() {
    return {
      groupid: this.groupid,
      agentid: this.agentid,
      deviceid: this.deviceid,
      ...this.properties
    };
  }

}

export default Event;
