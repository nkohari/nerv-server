import { Request, ReplyNoContinue } from 'hapi';
import * as Boom from 'boom';
import { Group } from '../../db';
import { Precondition } from '../framework';

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
