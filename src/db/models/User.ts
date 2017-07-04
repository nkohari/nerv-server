import Model from '../framework/Model';

class User extends Model {

  static table = 'users';

  username: string;
  password: string;

  serialize() {
    return {
      username: this.username
    };
  }

}

export default User;
