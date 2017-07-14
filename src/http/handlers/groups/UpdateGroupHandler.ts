import * as Boom from 'boom';
import * as Joi from 'joi';
import { Handler, Request, Reply } from 'src/http/framework';
import { Group } from 'src/db';

class UpdateGroupHandler extends Handler {

  static route = 'put /groups/{groupid}';

  static validate = {
    payload: {
      name: Joi.string().required()
    }
  };

  handle(request: Request<Partial<Group>>, reply: Reply) {
    const match = { id: request.params.groupid };
    const patch = request.payload as Partial<Group>;
    this.database.update(Group, match, patch).then(group => {
      if (!group) {
        reply(Boom.notFound(`No group with the id ${match.id} exists`));
      } else {
        reply({ group });
      }
    });
  }

}

export default UpdateGroupHandler;
