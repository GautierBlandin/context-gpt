import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { DomainError } from '@context-gpt/server-shared-errors';
import { RegisterUserUseCase } from '../use-cases/register-user.use-case';
import { LoginUserUseCase } from '../use-cases/login-user.use-case';
import { ValidateTokenUseCase } from '../use-cases/validate-token.use-case';

class RegisterDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly validateTokenUseCase: ValidateTokenUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<void> {
    try {
      await this.registerUserUseCase.execute(registerDto);
    } catch (error) {
      if (error instanceof DomainError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  // Login and validate methods will be implemented later
}
