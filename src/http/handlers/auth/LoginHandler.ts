import * as Joi from 'joi';
import { Keymaster } from 'src/common';
import { Handler, Request, Reply } from 'src/http/framework';
import { Database, User, Membership } from 'src/db';

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

  keymaster: Keymaster;

  constructor(database: Database, keymaster: Keymaster) {
    super(database);
    this.keymaster = keymaster;
  }

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
