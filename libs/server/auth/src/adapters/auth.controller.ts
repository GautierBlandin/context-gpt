import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { DomainError } from '@context-gpt/server-shared-errors';
import { RegisterUserUseCase } from '../use-cases/register-user.use-case';
import { LoginUserUseCase } from '../use-cases/login-user.use-case';
import { ValidateTokenUseCase } from '../use-cases/validate-token.use-case';

class RegisterDto {
  email: string;
  password: string;
}

class LoginDto {
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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    try {
      const result = await this.loginUserUseCase.execute(loginDto);
      return { token: result.token };
    } catch (error) {
      if (error instanceof DomainError) {
        throw new UnauthorizedException(error.message);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('validate')
  @HttpCode(HttpStatus.OK)
  async validate(@Headers('authorization') authHeader: string): Promise<void> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      await this.validateTokenUseCase.execute({ token });
      return;
    } catch (error) {
      if (error instanceof DomainError) {
        throw new UnauthorizedException(error.message);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
