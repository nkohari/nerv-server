import User from '../models/User';
import GetQuery from '../framework/GetQuery';

class GetUserQuery extends GetQuery<User> {

  constructor(id: string) {
    super(User, 'users', { id });
  }

}

export default GetUserQuery;
