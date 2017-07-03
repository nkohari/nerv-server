import User from '../models/User';
import GetQuery from '../framework/GetQuery';

class GetUserByUsernameQuery extends GetQuery<User> {

  constructor(username: string) {
    super(User, 'users', { username });
  }

}

export default GetUserByUsernameQuery;
