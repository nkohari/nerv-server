import { Model } from '../framework';

export type DeviceKind = 'gpu' | 'cpu' | 'usb';

class Device extends Model {

  static table = 'devices';

  userid: string;
  agentid: string;
  kind: DeviceKind;
  vendor: string;
  model: string;

  constructor(data: Partial<Device> = {}) {
    super(data);
    this.userid = data.userid;
    this.agentid = data.agentid;
    this.kind = data.kind;
    this.vendor = data.vendor;
    this.model = data.model;
  }

  serialize() {
    return {
      userid: this.userid,
      agentid: this.agentid,
      kind: this.kind,
      vendor: this.vendor,
      model: this.model
    };
  }

}

export default Device;
