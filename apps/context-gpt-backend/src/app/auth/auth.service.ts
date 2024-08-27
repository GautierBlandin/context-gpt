import { Injectable } from '@nestjs/common';
import { Env } from '../shared/env';

@Injectable()
export class AuthService {
  constructor(private readonly env: Env) {}

  async validateToken(token: string): Promise<boolean> {
    const validToken = this.env.get('API_ACCESS_TOKEN');
    return token === validToken;
  }
}
