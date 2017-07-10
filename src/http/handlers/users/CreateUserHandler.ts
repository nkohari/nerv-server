import { Request, ReplyNoContinue } from 'hapi';
import * as Joi from 'joi';
import { Handler } from 'src/http/framework';
import { CreateUserCommand, Agent, Group } from 'src/db';

class CreateUserHandler extends Handler {

  static route = 'post /users';

  static auth = false;

  static validate = {
    payload: {
      username: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().allow(null),
      agentid: Joi.string().allow(null)
    }
  };

  handle(request: Request, reply: ReplyNoContinue) {
    const { username, email, agentid } = request.payload;
    const plaintext = request.payload.password;

    this.keymaster.hashPassword(plaintext).then(password => {
      const command = new CreateUserCommand({ username, email, password });
      this.database.run(command).then(result => {
        const { user, group, membership } = result;
        this.associateAgent(group, agentid).then(agent => {
          reply({
            user,
            token: this.keymaster.createToken(user, [membership])
          }).code(201);
        });
      });
    });
  }

  associateAgent(group: Group, agentid: string): Promise<Agent> {
    if (!agentid) {
      return Promise.resolve(undefined);
    } else {
      return this.database.update(Agent, { id: agentid }, { groupid: group.id });
    }
  }

}

export default CreateUserHandler;
