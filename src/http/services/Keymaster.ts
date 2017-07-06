import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as nconf from 'nconf';
import { Database, User, Membership } from '../../db';
import { AuthToken } from '../framework/AuthToken';

const SALT_ROUNDS = 10;

class Keymaster {

  database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  hashPassword(plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, SALT_ROUNDS);
  }

  verifyPassword(hash: string, attempt: string): Promise<boolean> {
    return bcrypt.compare(attempt, hash);
  }

  createToken(user: User): Promise<string> {
    return this.database.getMany(Membership, { userid: user.id }).then(memberships => {
      const payload = {
        id: user.id,
        username: user.username,
        groups: memberships.map(m => m.groupid)
      };
      return jwt.sign(payload, nconf.get('AUTH_SECRET'), { algorithm: 'HS256', expiresIn: '24h' });
    });
  }

  verifyToken(token: string): AuthToken {
    return <AuthToken> jwt.verify(token, nconf.get('AUTH_SECRET'), { algorithms: ['HS256'] });
  }

}

export default Keymaster;
