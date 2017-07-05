import { Request, ReplyNoContinue } from 'hapi';
import * as Boom from 'Boom';
import Handler from '../framework/Handler';
import { User, CreateUserCommand } from '../../db';

class CreateUserHandler extends Handler {

  static auth = false;

  handle(request: Request, reply: ReplyNoContinue) {
    const { username, password } = request.payload;

    this.database.get(User, { username }).then(existingUser => {
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
