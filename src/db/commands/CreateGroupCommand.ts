import { Command } from '../framework';
import { Group, Membership, Transaction } from '..';

interface CreateGroupCommandResult {
  group: Group;
  memberships: Membership[];
}

class CreateGroupCommand implements Command<CreateGroupCommandResult> {

  groupDef: Partial<Group>;
  memberids: string[];

  constructor(groupDef: Partial<Group>, memberids: string[]) {
    this.groupDef = groupDef;
    this.memberids = memberids;
  }

  run(transaction: Transaction): Promise<CreateGroupCommandResult> {
    return transaction.insert(Group, this.groupDef).then(group => {
      if (!group) {
        throw new Error('Error creating group');
      } else {
        const membershipProps = this.memberids.map(userid => ({
          groupid: group.id,
          userid
        }));
        return transaction.insertMany(Membership, membershipProps).then(memberships => {
          if (!memberships || memberships.length === 0) {
            throw new Error('Error creating group memberships');
          }
          return { group, memberships };
        });
      }
    });
  }

}

export default CreateGroupCommand;
