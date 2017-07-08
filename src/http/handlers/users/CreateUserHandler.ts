import { Request, ReplyNoContinue } from 'hapi';
import * as Boom from 'Boom';
import { Handler } from '../../framework';
import { Agent, User, Group, Membership, Transaction } from '../../../db';

class CreateUserHandler extends Handler {

  static auth = false;

  handle(request: Request, reply: ReplyNoContinue) {
    const { username, email, agentid } = request.payload;
    const plaintext = request.payload.password;

    this.keymaster.hashPassword(plaintext).then(password => {
      this.database.transaction(tx => {
        return this.createUser(tx, { username, email, password }).then(user => {
          return this.createDefaultGroup(tx, user).then(group => {
            return this.createMembership(tx, user, group).then(membership => {
              return this.associateAgent(tx, group, agentid).then(agent => {
                reply({
                  user,
                  token: this.keymaster.createToken(user, [membership])
                });
              });
            });
          });
        });
      });
    });

  }

  createUser(tx: Transaction, data: Partial<User>): Promise<User> {
    return tx.get(User, { username: data.username }).then(existingUser => {
      if (existingUser) {
        throw Boom.badRequest('A user with that username already exists');
      }
      return tx.insert(User, data);
    });
  }

  createDefaultGroup(tx: Transaction, user: User): Promise<Group> {
    return tx.insert(Group, { name: user.username });
  }

  createMembership(tx: Transaction, user: User, group: Group): Promise<Membership> {
    return tx.insert(Membership, { groupid: group.id, userid: user.id });
  }

  associateAgent(tx: Transaction, group: Group, agentid: string): Promise<Agent> {
    if (!agentid) {
      return Promise.resolve(undefined);
    } else {
      return tx.update(Agent, { id: agentid }, { groupid: group.id });
    }
  }

}

export default CreateUserHandler;
