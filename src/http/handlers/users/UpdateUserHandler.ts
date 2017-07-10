import { Request, ReplyNoContinue } from 'hapi';
import * as Joi from 'joi';
import { Handler } from 'src/http/framework';
import { User } from 'src/db';

class UpdateUserHandler extends Handler {

  static validate = {
    payload: {
      email: Joi.string().email().required()
    }
  };

  handle(request: Request, reply: ReplyNoContinue) {
    const match = { id: request.auth.credentials.userid };
    const patch = request.payload as Partial<User>;
    this.database.update(User, match, patch).then(user => {
      reply({ user });
    });
  }

}

export default UpdateUserHandler;
