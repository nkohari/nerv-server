import { Command } from '../framework';
import { User, Group, Membership, Transaction } from '..';

interface CreateUserCommandResult {
  user: User;
  group: Group;
  membership: Membership;
}

class CreateUserCommand implements Command<CreateUserCommandResult> {

  userDef: Partial<User>;

  constructor(userDef: Partial<User>) {
    this.userDef = userDef;
  }

  run(transaction: Transaction): Promise<CreateUserCommandResult> {
    return transaction.insert(User, this.userDef).then(user => {
      if (!user) {
        throw new Error('Error creating user');
      }
      return transaction.insert(Group, { name: user.username }).then(group => {
        if (!group) {
          throw new Error('Error creating default group for user');
        }
        return transaction.insert(Membership, { groupid: group.id, userid: user.id }).then(membership => {
          return { user, group, membership };
        });
      });
    });
  }

}

export default CreateUserCommand;
