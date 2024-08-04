import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  async validateToken(token: string): Promise<boolean> {
    const validToken = process.env.API_ACCESS_TOKEN;
    return token === validToken;
  }
}
