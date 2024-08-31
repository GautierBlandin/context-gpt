import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { RegisterUserUseCase } from '../use-cases/register-user.use-case';
import { DomainError } from '@context-gpt/server-shared-errors';
import { LoginUserUseCase } from '../use-cases/login-user.use-case';
import { ValidateTokenUseCase } from '../use-cases/validate-token.use-case';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

interface MockUseCase {
  execute: jest.Mock;
}

describe('AuthController', () => {
  let authController: AuthController;
  let registerUserUseCase: MockUseCase;

  beforeEach(async () => {
    const mockRegisterUserUseCase: MockUseCase = {
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
          useValue: {},
        },
        {
          provide: ValidateTokenUseCase,
          useValue: {},
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    registerUserUseCase = mockRegisterUserUseCase;
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
});
