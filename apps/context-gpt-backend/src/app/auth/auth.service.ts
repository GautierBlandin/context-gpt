import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async validateToken(token: string): Promise<boolean> {
    const validToken = process.env.API_ACCESS_TOKEN;
    return token === validToken;
  }
}
