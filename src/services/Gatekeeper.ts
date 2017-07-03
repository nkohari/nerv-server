import { Request } from 'hapi';
import { Database, GetUserQuery } from '../db';
import { AuthToken } from '../framework';
import * as Boom from 'boom';

type AuthorizeCallback = (err: Error, isValid: boolean, credentials: any) => any;

class Gatekeeper {

  database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  authorize(request: Request, token: AuthToken, callback: AuthorizeCallback) {
    const { userid } = request.params;

    if (userid && token.scopes.indexOf(userid) === -1) {
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
