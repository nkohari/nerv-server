import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from 'src/http/framework';
import { User } from 'src/db';

class GetUserHandler extends Handler {

  static route = 'get /users/{userid}';

  handle(request: Request, reply: ReplyNoContinue) {
    const { userid } = request.params;
    this.database.get(User, userid).then(user => {
      reply({ user });
    }).catch(reply);
  }

}

export default GetUserHandler;
