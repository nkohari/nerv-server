import { Request, ReplyNoContinue } from 'hapi';
import * as Joi from 'joi';
import { Handler } from '../../framework';
import { User, Membership } from '../../../db';

class LoginHandler extends Handler {

  static auth = false;

  static validate = {
    payload: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  };

  handle(request: Request, reply: ReplyNoContinue) {
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
