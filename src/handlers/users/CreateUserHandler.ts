import { Request, ReplyNoContinue } from 'hapi';
import { Handler } from '../../framework';
import { CreateUserCommand } from '../../db';
import { hashPassword, createToken } from '../../utils/auth';

class CreateUserHandler extends Handler {

  static config = { auth: false };

  handle(request: Request, reply: ReplyNoContinue) {
    const { username, password } = request.payload;

    hashPassword(password).then(passwordHash => {
      const command = new CreateUserCommand(username, passwordHash);
      this.database.execute(command).then(user => {
        reply({ id_token: createToken(user) }).code(201);
      });
    });
  }

}

export default CreateUserHandler;
