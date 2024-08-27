import { Injectable } from '@nestjs/common';
import { Env } from '@context-gpt/server-shared';

@Injectable()
export class AuthService {
  constructor(private readonly env: Env) {}

  async validateToken(token: string): Promise<boolean> {
    const validToken = this.env.get('API_ACCESS_TOKEN');
    return token === validToken;
  }
}
