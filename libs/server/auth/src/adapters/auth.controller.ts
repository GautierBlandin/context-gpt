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
import { ErrorResponseDto, LoginUserInputDto, LoginUserOutputDto, RegisterUserInputDto } from './auth.controller.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
@ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error', type: ErrorResponseDto })
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly validateTokenUseCase: ValidateTokenUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request', type: ErrorResponseDto })
  async register(@Body() registerDto: RegisterUserInputDto): Promise<void> {
    try {
      await this.registerUserUseCase.execute(registerDto);
    } catch (error) {
      if (error instanceof DomainError) {
        throw new BadRequestException(error.message);
      } else {
        console.log('error', error);
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized', type: ErrorResponseDto })
  async login(@Body() loginDto: LoginUserInputDto): Promise<LoginUserOutputDto> {
    try {
      const result = await this.loginUserUseCase.execute(loginDto);
      return { token: result.token };
    } catch (error) {
      if (error instanceof DomainError) {
        throw new UnauthorizedException(error.message);
      } else {
        console.log('error', error);
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('validate')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized', type: ErrorResponseDto })
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
        console.log('error', error);
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
