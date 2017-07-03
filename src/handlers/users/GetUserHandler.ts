import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from '../../framework';
import { GetUserQuery } from '../../db';

class GetUserHandler extends Handler {

  handle(request: Request, reply: ReplyNoContinue) {
    const { userid } = request.params;

    const query = new GetUserQuery(userid);
    this.database.execute(query).then(user => {
      if (!user) {
        return reply().code(404);
      }

      const model = {
        id: user.id,
        username: user.username
      };

      reply(model);
    });
  }

}

export default GetUserHandler;
