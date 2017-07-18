import * as Joi from 'joi';
import { Keymaster } from 'src/common';
import { Database, CreateUserCommand, Agent, Group } from 'src/db';
import { CheckUsernameCollision } from 'src/http/preconditions';
import { Handler, Request, Reply } from 'src/http/framework';

type CreateUserHandlerPayload = {
  username: string;
  password: string;
  email: string;
  agentid: string;
};

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

  static pre = [
    CheckUsernameCollision
  ];

  keymaster: Keymaster;

  constructor(database: Database, keymaster: Keymaster) {
    super(database);
    this.keymaster = keymaster;
  }

  handle(request: Request<CreateUserHandlerPayload>, reply: Reply) {
    const { username, email, agentid } = request.payload;
    const plaintext = request.payload.password;

    return this.keymaster.hashPassword(plaintext).then(password => {
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
