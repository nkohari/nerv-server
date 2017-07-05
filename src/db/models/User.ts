import { Model } from '../framework';

class User extends Model {

  static table = 'users';

  username: string;
  password: string;

  constructor(data: Partial<User> = {}) {
    super(data);
    this.username = data.username;
    this.password = data.password;
  }

  serialize() {
    return {
      username: this.username
    };
  }

}

export default User;
