import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as nconf from 'nconf';
import { User, Membership } from 'src/db';
import Credentials from './Credentials';

const SALT_ROUNDS = 10;

class Keymaster {

  hashPassword(plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, SALT_ROUNDS);
  }

  verifyPassword(hash: string, attempt: string): Promise<boolean> {
    return bcrypt.compare(attempt, hash);
  }

  createToken(user: User, memberships: Membership[]): string {
    const credentials = new Credentials({
      userid: user.id,
      username: user.username,
      groups: memberships.map(m => m.groupid)
    });
    return jwt.sign(credentials, nconf.get('AUTH_SECRET'), { algorithm: 'HS256', expiresIn: '24h' });
  }

  verifyToken(token: string): Credentials {
    const decoded = jwt.verify(token, nconf.get('AUTH_SECRET'), { algorithms: ['HS256'] });
    return new Credentials(decoded);
  }

}

export default Keymaster;
