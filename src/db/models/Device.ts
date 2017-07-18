import { Audience } from 'src/common';
import { Model } from 'src/db/framework';

class Device extends Model {

  static table = 'devices';

  groupid: string;
  agentid: string;
  type: string;
  name: string;
  vendor: string;
  model: string;

  constructor(data: Partial<Device> = {}) {
    super(data);
    this.groupid = data.groupid;
    this.agentid = data.agentid;
    this.type = data.type;
    this.name = data.name;
    this.vendor = data.vendor;
    this.model = data.model;
  }

  getAudience() {
    return new Audience({ groupid: this.groupid });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      groupid: this.groupid,
      agentid: this.agentid,
      type: this.type,
      name: this.name,
      vendor: this.vendor,
      model: this.model
    };
  }

}

export default Device;
