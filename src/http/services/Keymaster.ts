import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as nconf from 'nconf';
import { User } from '../../db';
import { AuthToken } from '../framework/AuthToken';

const SALT_ROUNDS = 10;

class Keymaster {

  hashPassword(plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, SALT_ROUNDS);
  }

  verifyPassword(hash: string, attempt: string): Promise<boolean> {
    return bcrypt.compare(attempt, hash);
  }

  createToken(user: User): string {
    const payload = {
      id: user.id,
      username: user.username,
      scopes: [ user.id ]
    };
    return jwt.sign(payload, nconf.get('AUTH_SECRET'), { algorithm: 'HS256', expiresIn: '24h' });
  }

  verifyToken(token: string): AuthToken {
    return <AuthToken> jwt.verify(token, nconf.get('AUTH_SECRET'), { algorithms: ['HS256'] });
  }

}

export default Keymaster;
