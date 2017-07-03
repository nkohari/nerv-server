import { Request, ReplyNoContinue } from 'hapi';
import * as Boom from 'Boom';
import { Handler } from '../../framework';
import { GetUserByUsernameQuery, CreateUserCommand } from '../../db';
import { hashPassword, createToken } from '../../utils/auth';

class CreateUserHandler extends Handler {

  static config = { auth: false };

  handle(request: Request, reply: ReplyNoContinue) {
    const { username, password } = request.payload;

    const query = new GetUserByUsernameQuery(username);
    this.database.execute(query).then(existingUser => {
      if (existingUser) {
        return reply(Boom.badRequest('A user with that username already exists'));
      }
      hashPassword(password).then(passwordHash => {
        const command = new CreateUserCommand(username, passwordHash);
        this.database.execute(command).then(user => {
          console.log({ user });
          reply({
            user,
            token: createToken(user)
          }).code(201);
        });
      });
    });

  }

}

export default CreateUserHandler;
