import * as Boom from 'boom';
import { Request } from 'src/http/framework';
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

  authorizeAdmin(request: Request, tokenData: any, callback: AuthorizeCallback) {
    // If the token isn't the special admin token, pretend what they're asking for doesn't exist.
    if (!tokenData.admin) {
      return callback(Boom.notFound(), false, null);
    }
    callback(null, true, tokenData);
  }

}

export default Gatekeeper;
