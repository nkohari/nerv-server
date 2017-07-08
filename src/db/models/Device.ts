import { Model } from '../framework';

export type DeviceKind = 'gpu' | 'cpu' | 'usb';

class Device extends Model {

  static table = 'devices';

  groupid: string;
  agentid: string;
  kind: DeviceKind;
  vendor: string;
  model: string;

  constructor(data: Partial<Device> = {}) {
    super(data);
    this.groupid = data.groupid;
    this.agentid = data.agentid;
    this.kind = data.kind;
    this.vendor = data.vendor;
    this.model = data.model;
  }

  getSecurityContext() {
    return { groupid: this.groupid };
  }

  serialize() {
    return {
      groupid: this.groupid,
      agentid: this.agentid,
      kind: this.kind,
      vendor: this.vendor,
      model: this.model
    };
  }

}

export default Device;
