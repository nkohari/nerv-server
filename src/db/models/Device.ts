import { Model } from 'src/db/framework';

class Device extends Model {

  static table = 'devices';

  groupid: string;
  agentid: string;
  type: string;
  vendor: string;
  model: string;

  constructor(data: Partial<Device> = {}) {
    super(data);
    this.groupid = data.groupid;
    this.agentid = data.agentid;
    this.type = data.type;
    this.vendor = data.vendor;
    this.model = data.model;
  }

  getSecurityContext() {
    return { groupid: this.groupid };
  }

  toJSON() {
    return {
      ...super.toJSON(),
      groupid: this.groupid,
      agentid: this.agentid,
      type: this.type,
      vendor: this.vendor,
      model: this.model
    };
  }

}

export default Device;
