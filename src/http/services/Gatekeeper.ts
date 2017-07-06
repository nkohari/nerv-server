import { Request } from 'hapi';
import * as Boom from 'boom';
import { Database, User } from '../../db';
import { AuthToken } from '../framework/AuthToken';

type AuthorizeCallback = (err: Error, isValid: boolean, credentials: User) => any;

class Gatekeeper {

  database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  authorize(request: Request, token: AuthToken, callback: AuthorizeCallback) {
    const { groupid, userid } = request.params;

    if (groupid && token.groups.indexOf(groupid) === -1) {
      return callback(Boom.forbidden("You don't have access to that resource"), false, null);
    }

    if (userid && token.id !== userid) {
      return callback(Boom.forbidden("You don't have access to that resource"), false, null);
    }

    this.database.get(User, token.id).then(user => {
      if (!user) {
        callback(Boom.badRequest('Invalid token'), false, null);
      } else {
        callback(null, true, user);
      }
    })
    .catch(err => callback(err, false, null));
  }

}

export default Gatekeeper;
