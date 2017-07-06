import { Model } from '../framework';

class User extends Model {

  static table = 'users';

  username: string;
  email: string;
  password: string;

  constructor(data: Partial<User> = {}) {
    super(data);
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
  }

  serialize() {
    return {
      username: this.username,
      email: this.email
    };
  }

}

export default User;
