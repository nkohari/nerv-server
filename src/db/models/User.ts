import { MutableModel } from 'src/db/framework';

class User extends MutableModel {

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

  getSecurityContext() {
    return { userid: this.id };
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
