import { Request, ReplyNoContinue } from 'hapi';
import * as Boom from 'Boom';
import Handler from '../framework/Handler';
import { GetQuery, CreateUserCommand, User } from '../../db';

class CreateUserHandler extends Handler {

  static auth = false;

  handle(request: Request, reply: ReplyNoContinue) {
    const { username, password } = request.payload;

    const query = new GetQuery(User, { username });
    this.database.execute(query).then(existingUser => {
      if (existingUser) {
        return reply(Boom.badRequest('A user with that username already exists'));
      }
      this.keymaster.hashPassword(password).then(passwordHash => {
        const command = new CreateUserCommand(username, passwordHash);
        this.database.execute(command).then(user => {
          reply({
            user,
            token: this.keymaster.createToken(user)
          }).code(201);
        });
      });
    });

  }

}

export default CreateUserHandler;
