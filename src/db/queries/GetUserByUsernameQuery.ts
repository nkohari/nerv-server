import User from '../models/User';
import GetQuery from '../framework/GetQuery';

class GetUserByUsernameQuery extends GetQuery<User> {

  constructor(username: string) {
    super(User, { username });
  }

}

export default GetUserByUsernameQuery;
