import * as uuid from 'uuid/v4';
import * as knex from 'knex';
import User from '../models/User';
import { Statement } from '../framework/Statement';

class CreateUserCommand implements Statement<User> {

  username: string;
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  execute(connection: knex): Promise<User> {
    return connection('users').insert({
      id: uuid(),
      username: this.username,
      password: this.password
    }).then(result => new User(result));
  }

}

export default CreateUserCommand;
