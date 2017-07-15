import { Audience } from 'src/common';
import { Model } from 'src/db/framework';

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

  getAudience() {
    return new Audience({ userid: this.id });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      username: this.username,
      email: this.email
    };
  }

}

export default User;
