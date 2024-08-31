import * as jwt from 'jsonwebtoken';
import { Env } from '@context-gpt/server-shared-env';
import { InvalidTokenError } from './errors';

export abstract class TokenService {
  abstract generateToken(userId: string): string;
  abstract validateToken(token: string): boolean;
  abstract getUserIdFromToken(token: string): string;
}

export class TokenServiceImpl extends TokenService {
  constructor(private readonly env: Env) {
    super();
  }

  private get secretKey(): string {
    const key = this.env.get('JWT_SECRET_KEY');
    if (!key) {
      throw new Error('JWT_SECRET_KEY is not set in the environment');
    }
    return key;
  }

  generateToken(userId: string): string {
    return jwt.sign({ userId }, this.secretKey, { expiresIn: '1h' });
  }

  validateToken(token: string): boolean {
    try {
      jwt.verify(token, this.secretKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  getUserIdFromToken(token: string): string {
    try {
      const decoded = jwt.verify(token, this.secretKey) as { userId: string };
      return decoded.userId;
    } catch (error) {
      throw new InvalidTokenError('Invalid token');
    }
  }
}
