import { Request, ReplyNoContinue } from 'hapi';
import * as Joi from 'joi';
import { Handler } from 'src/http/framework';
import { Credentials } from 'src/common';
import { CreateGroupCommand } from 'src/db';

class CreateGroupHandler extends Handler {

  static route = 'post /groups';

  static validate = {
    payload: {
      name: Joi.string().required(),
      members: Joi.array().items(Joi.string()).default([])
    }
  };

  handle(request: Request, reply: ReplyNoContinue) {
    const credentials: Credentials = request.auth.credentials;
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
