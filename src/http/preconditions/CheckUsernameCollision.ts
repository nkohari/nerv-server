import * as Boom from 'boom';
import { User } from 'src/db';
import { Precondition, Request, Reply } from 'src/http/framework';

type CheckUsernameCollisionRequest = Request<{ username: string }>;

class CheckUsernameCollision extends Precondition {

  execute(request: CheckUsernameCollisionRequest, reply: Reply) {
    const { username } = request.payload;

    this.database.get(User, { username }).then(existingUser => {
      if (existingUser) {
        reply(Boom.badRequest(`Another user exists with the username ${username}`));
      } else {
        reply();
      }
    });
  }

}

export default CheckUsernameCollision;
