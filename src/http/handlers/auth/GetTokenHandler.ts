import { Handler, Request, Reply } from 'src/http/framework';
import { Membership, User } from 'src/db';

class GetTokenHandler extends Handler {

  static route = 'get /auth';

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
