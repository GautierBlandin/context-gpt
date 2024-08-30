import * as jwt from 'jsonwebtoken';
import { Env } from '@context-gpt/server-shared';

export class TokenService {
  constructor(private readonly env: Env) {}

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
      throw new Error('Invalid token');
    }
  }
}
