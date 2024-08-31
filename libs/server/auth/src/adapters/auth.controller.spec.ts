import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { RegisterUserUseCase } from '../use-cases/register-user.use-case';
import { DomainError } from '@context-gpt/server-shared-errors';
import { LoginUserUseCase } from '../use-cases/login-user.use-case';
import { ValidateTokenUseCase } from '../use-cases/validate-token.use-case';
import { BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InvalidTokenError } from '../domain/errors';

interface MockUseCase {
  execute: jest.Mock;
}

describe('AuthController', () => {
  let authController: AuthController;
  let registerUserUseCase: MockUseCase;
  let loginUserUseCase: MockUseCase;
  let validateTokenUseCase: MockUseCase;

  beforeEach(async () => {
    const mockRegisterUserUseCase: MockUseCase = {
      execute: jest.fn(),
    };

    const mockLoginUserUseCase: MockUseCase = {
      execute: jest.fn(),
    };

    const mockValidateTokenUseCase: MockUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: RegisterUserUseCase,
          useValue: mockRegisterUserUseCase,
        },
        {
          provide: LoginUserUseCase,
          useValue: mockLoginUserUseCase,
        },
        {
          provide: ValidateTokenUseCase,
          useValue: mockValidateTokenUseCase,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    registerUserUseCase = mockRegisterUserUseCase;
    loginUserUseCase = mockLoginUserUseCase;
    validateTokenUseCase = mockValidateTokenUseCase;
  });

  describe('register', () => {
    it('returns 201 Created when registration is successful', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await authController.register(registerDto);

      expect(response).toBeUndefined();
    });

    it('throws BadRequestException when registration fails due to invalid input', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(registerUserUseCase, 'execute').mockRejectedValue(new DomainError('Email already exists'));

      await expect(authController.register(registerDto)).rejects.toThrow(BadRequestException);
    });

    it('throws InternalServerErrorException when registration fails due to internal error', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(registerUserUseCase, 'execute').mockRejectedValue(new Error('Internal error'));

      await expect(authController.register(registerDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('login', () => {
    it('returns 200 OK with a token when login is successful', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedToken = 'valid_token';

      loginUserUseCase.execute.mockResolvedValue({ token: expectedToken });

      const response = await authController.login(loginDto);

      expect(response).toEqual({ token: expectedToken });
    });

    it('throws UnauthorizedException when login fails due to invalid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrong_password',
      };

      loginUserUseCase.execute.mockRejectedValue(new DomainError('Invalid credentials'));

      await expect(authController.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('throws InternalServerErrorException when login fails due to internal error', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      loginUserUseCase.execute.mockRejectedValue(new Error('Internal error'));

      await expect(authController.login(loginDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('validate', () => {
    it('returns 200 OK when token is valid', async () => {
      const authHeader = 'Bearer valid_token';
      const userId = 'user_id';

      validateTokenUseCase.execute.mockResolvedValue({ userId });

      const response = await authController.validate(authHeader);

      expect(response).toEqual(undefined);
    });

    it('throws UnauthorizedException when token is malformed', async () => {
      const token = 'invalid_token';

      await expect(authController.validate(token)).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when token is invalid', async () => {
      const invalidToken = 'Bearer invalid_token';

      validateTokenUseCase.execute.mockRejectedValue(new InvalidTokenError('Invalid token'));

      await expect(authController.validate(invalidToken)).rejects.toThrow(UnauthorizedException);
    });

    it('throws InternalServerErrorException when validation fails due to internal error', async () => {
      const authHeader = 'Bearer valid_token';

      validateTokenUseCase.execute.mockRejectedValue(new Error('Internal error'));

      await expect(authController.validate(authHeader)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
