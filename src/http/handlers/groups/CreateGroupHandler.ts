import * as Joi from 'joi';
import { Handler, Request, Reply } from 'src/http/framework';
import { CreateGroupCommand } from 'src/db';

type CreateGroupHandlerPayload = {
  name: string;
  members: string[];
};

class CreateGroupHandler extends Handler {

  static route = 'post /groups';

  static validate = {
    payload: {
      name: Joi.string().required(),
      members: Joi.array().items(Joi.string()).default([])
    }
  };

  handle(request: Request<CreateGroupHandlerPayload>, reply: Reply) {
    const { credentials } = request.auth;
    const { name, members } = request.payload;

    // Ensure that the creator of the group is a member.
    if (members.indexOf(credentials.userid) === -1) {
      members.push(credentials.userid);
    }

    const command = new CreateGroupCommand({ name }, members);
    this.database.run(command).then(result => {
      const { group, memberships } = result;
      reply({ group, memberships }).code(201);
    });
  }

}

export default CreateGroupHandler;
