import Model from '../framework/Model';

export type DeviceKind = 'gpu' | 'cpu' | 'usb';

class Device extends Model {

  static table = 'devices';

  userid: string;
  agentid: string;
  kind: DeviceKind;
  vendor: string;
  model: string;

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
