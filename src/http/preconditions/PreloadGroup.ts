import { Request, ReplyNoContinue } from 'hapi';
import * as Boom from 'boom';
import { Group } from 'src/db';
import { Precondition } from 'src/http/framework';

class PreloadGroup extends Precondition {

  static assign = 'group';

  execute(request: Request, reply: ReplyNoContinue) {
    const { groupid } = request.params;

    if (!groupid) {
      reply(Boom.badRequest('No groupid specified on route'));
    }

    this.database.get(Group, groupid).then(group => {
      reply(group);
    });
  }

}

export default PreloadGroup;
