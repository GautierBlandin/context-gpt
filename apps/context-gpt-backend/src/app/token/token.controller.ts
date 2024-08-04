import { Controller, Post, Body } from '@nestjs/common';
import { TokenService } from './token.service';
import { CheckTokenInputDto, CheckTokenOutputDto } from './token.dto';

@Controller()
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('check-token')
  async checkToken(@Body() checkTokenInputDto: CheckTokenInputDto): Promise<CheckTokenOutputDto> {
    const { token } = checkTokenInputDto;
    const isValid = await this.tokenService.validateToken(token);
    return { isValid };
  }
}
