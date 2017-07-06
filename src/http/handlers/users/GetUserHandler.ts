import { Request, ReplyNoContinue } from 'hapi';
import Handler from '../../framework/Handler';
import { User } from '../../../db';

class GetUserHandler extends Handler {

  handle(request: Request, reply: ReplyNoContinue) {
    const { userid } = request.params;
    this.database.get(User, userid).then(user => {
      reply({ user });
    }).catch(reply);
  }

}

export default GetUserHandler;
