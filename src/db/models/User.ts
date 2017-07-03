import Model from '../framework/Model';

class User extends Model {

  static table = 'users';

  id: string;
  username: string;
  password: string;

  toJSON() {
    return {
      id: this.id,
      username: this.username
    };
  }

}

export default User;
