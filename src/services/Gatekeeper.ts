import { Request } from 'hapi';
import * as Boom from 'boom';
import { Database, User, GetUserQuery } from '../db';
import { AuthToken } from '../framework';

type AuthorizeCallback = (err: Error, isValid: boolean, credentials: User) => any;

class Gatekeeper {

  database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  authorize(request: Request, token: AuthToken, callback: AuthorizeCallback) {
    const { userid } = request.params;

    if (userid && token.id !== userid) {
      return callback(Boom.forbidden("You don't have access to that resource"), false, null);
    }

    const query = new GetUserQuery(token.id);
    this.database.execute(query).then(user => {
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
