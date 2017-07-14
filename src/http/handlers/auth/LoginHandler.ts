import * as Joi from 'joi';
import { Handler, Request, Reply } from 'src/http/framework';
import { User, Membership } from 'src/db';

type LoginHandlerPayload = {
  username: string;
  password: string;
};

class LoginHandler extends Handler {

  static route = 'post /auth';

  static auth = false;

  static validate = {
    payload: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  };

  handle(request: Request<LoginHandlerPayload>, reply: Reply) {
    const { username, password } = request.payload;

    this.database.get(User, { username }).then(user => {
      if (!user) {
        reply(401);
      } else {
        return this.keymaster.verifyPassword(user.password, password).then(matches => {
          if (!matches) {
            reply(401);
          } else {
            this.database.getMany(Membership, { userid: user.id }).then(memberships => {
              reply({
                user,
                token: this.keymaster.createToken(user, memberships)
              });
            });
          }
        });
      }
    });
  }

}

export default LoginHandler;
