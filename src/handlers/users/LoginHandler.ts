import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from '../../framework';
import { GetUserByUsernameQuery } from '../../db';
import { createToken, verifyPassword } from '../../utils/auth';

class LoginHandler extends Handler {

  static config = { auth: false };

  handle(request: Request, reply: ReplyNoContinue) {
    const { username, password } = request.payload;

    const query = new GetUserByUsernameQuery(username);
    this.database.execute(query).then(user => {
      if (!user) {
        reply(401);
      } else {
        return verifyPassword(user.password, password).then(matches => {
          if (!matches) {
            reply(401);
          } else {
            reply({
              user,
              token: createToken(user)
            });
          }
        });
      }
    });
  }

}

export default LoginHandler;
