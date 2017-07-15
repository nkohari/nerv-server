import { Keymaster } from 'src/common';
import { Database, Membership, User } from 'src/db';
import { Handler, Request, Reply } from 'src/http/framework';

class GetTokenHandler extends Handler {

  static route = 'get /auth';

  keymaster: Keymaster;

  constructor(database: Database, keymaster: Keymaster) {
    super(database);
    this.keymaster = keymaster;
  }

  handle(request: Request, reply: Reply) {
    const { userid } = request.auth.credentials;
    this.database.get(User, userid).then(user => {
      this.database.getMany(Membership, { userid }).then(memberships => {
        reply({
          user,
          token: this.keymaster.createToken(user, memberships)
        });
      });
    });
  }

}

export default GetTokenHandler;
