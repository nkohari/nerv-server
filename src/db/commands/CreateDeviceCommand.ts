import { Command } from '../framework';
import { Device, Transaction } from '..';

interface DeviceDefinition extends Partial<Device> {
  groupid: string;
  agentid: string;
}

interface CreateDeviceCommandResult {
  device: Device;
}

class CreateDeviceCommand implements Command<CreateDeviceCommandResult> {

  deviceDef: DeviceDefinition;

  constructor(deviceDef: DeviceDefinition) {
    this.deviceDef = deviceDef;
  }

  run(transaction: Transaction): Promise<CreateDeviceCommandResult> {
    // TODO: Create or retrieve device type definition
    return transaction.insert(Device, this.deviceDef).then(device => {
      if (!device) {
        throw new Error('Error creating device');
      } else {
        return { device };
      }
    });
  }

}

export default CreateDeviceCommand;
