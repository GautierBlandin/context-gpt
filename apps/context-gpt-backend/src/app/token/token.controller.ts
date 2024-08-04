import { Controller, Post, Body } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller()
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('check-token')
  async checkToken(@Body('token') token: string): Promise<{ isValid: boolean }> {
    const isValid = await this.tokenService.validateToken(token);
    return { isValid };
  }
}
