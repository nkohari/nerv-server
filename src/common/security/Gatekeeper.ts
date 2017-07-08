import { Request } from 'hapi';
import * as Boom from 'boom';
import Credentials from './Credentials';

type AuthorizeCallback = (err: Error, isValid: boolean, credentials: Credentials) => any;

class Gatekeeper {

  authorize(request: Request, tokenData: any, callback: AuthorizeCallback) {
    const { groupid, userid } = request.params;
    const credentials = new Credentials(tokenData);

    if (groupid && !credentials.canAccess(groupid)) {
      return callback(Boom.forbidden("You don't have access to that resource"), false, null);
    }

    if (userid && credentials.userid !== userid) {
      return callback(Boom.forbidden("You don't have access to that resource"), false, null);
    }

    callback(null, true, credentials);
  }

}

export default Gatekeeper;
