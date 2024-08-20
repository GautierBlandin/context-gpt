import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetAuthValidateOutputDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly tokenService: AuthService) {}

  @Get('validate')
  async validateToken(@Headers('Authorization') authHeader: string): Promise<GetAuthValidateOutputDto> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];
    const isValid = await this.tokenService.validateToken(token);
    return { is_valid: isValid };
  }
}
