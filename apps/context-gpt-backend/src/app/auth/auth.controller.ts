import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckTokenInputDto, CheckTokenOutputDto } from './auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly tokenService: AuthService) {}

  @Post('check-token')
  async checkToken(@Body() checkTokenInputDto: CheckTokenInputDto): Promise<CheckTokenOutputDto> {
    const { token } = checkTokenInputDto;
    const isValid = await this.tokenService.validateToken(token);
    return { isValid };
  }
}
