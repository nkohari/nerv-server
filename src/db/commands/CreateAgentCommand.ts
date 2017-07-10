import { Agent, Device, Transaction } from 'src/db';
import { Command } from 'src/db/framework';

interface CreateAgentCommandResult {
  agent: Agent;
  devices: Device[];
}

class CreateAgentCommand implements Command<CreateAgentCommandResult> {

  agentDef: Partial<Agent>;
  deviceDefs: Partial<Device>[];

  constructor(agentDef: Partial<Agent>, deviceDefs: Partial<Device>[]) {
    this.agentDef = agentDef;
    this.deviceDefs = deviceDefs;
  }

  run(transaction: Transaction): Promise<CreateAgentCommandResult> {
    return transaction.insert(Agent, this.agentDef).then(agent => {
      if (!agent) {
        throw new Error('Error creating agent');
      } else {
        if (this.deviceDefs.length === 0) {
          return { agent, devices: [] };
        } else {
          const deviceProps = this.deviceDefs.map(device => ({
            ...device,
            agentid: agent.id,
            groupid: agent.groupid
          }));
          return transaction.insertMany(Device, deviceProps).then(devices => {
            if (!devices || devices.length !== this.deviceDefs.length) {
              throw new Error('Error creating devices');
            }
            return { agent, devices };
          });
        }
      }
    });
  }

}

export default CreateAgentCommand;
