import { Request, ReplyNoContinue } from 'hapi';
import Handler from '../framework/Handler';
import { User, GetQuery } from '../../db';

class LoginHandler extends Handler {

  static auth = false;

  handle(request: Request, reply: ReplyNoContinue) {
    const { username, password } = request.payload;

    const query = new GetQuery(User, { username });
    this.database.execute(query).then(user => {
      if (!user) {
        reply(401);
      } else {
        return this.keymaster.verifyPassword(user.password, password).then(matches => {
          if (!matches) {
            reply(401);
          } else {
            reply({
              user,
              token: this.keymaster.createToken(user)
            });
          }
        });
      }
    });
  }

}

export default LoginHandler;
