import User from '../models/User';
import InsertStatement from '../framework/InsertStatement';

class CreateUserCommand extends InsertStatement<User> {

  constructor(username: string, password: string) {
    super(User, { username, password });
  }

}

export default CreateUserCommand;
