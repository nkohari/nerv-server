import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as nconf from 'nconf';
import { User } from '../db';
import { AuthToken } from '../framework';

const SALT_ROUNDS = 10;

export function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}

export function verifyPassword(hash: string, attempt: string): Promise<boolean> {
  return bcrypt.compare(attempt, hash);
}

export function createToken(user: User): string {
  const payload = {
    id: user.id,
    username: user.username,
    scopes: [ user.id ]
  };
  return jwt.sign(payload, nconf.get('SECRET'), { algorithm: 'HS256', expiresIn: '24h' });
}

export function verifyToken(token: string): AuthToken {
  return <AuthToken> jwt.verify(token, nconf.get('SECRET'), { algorithms: ['HS256'] });
}
