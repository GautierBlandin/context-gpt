import { Body, Controller, Get, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetAuthValidateOutputDto, PostAuthLoginDto, PostAuthLoginInputDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('validate')
  async validateToken(@Headers('Authorization') authHeader: string): Promise<GetAuthValidateOutputDto> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];
    const isValid = await this.authService.validateToken(token);
    return { is_valid: isValid };
  }

  @Post('login')
  async login(@Body() loginInput: PostAuthLoginInputDto): Promise<PostAuthLoginDto> {
    const isValid = await this.authService.validateToken(loginInput.token);
    if (!isValid) {
      throw new UnauthorizedException('Invalid token provided');
    }

    return { access_token: loginInput.token };
  }
}
