import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { ValidateTokenUseCase } from '../use-cases/validate-token.use-case';
import { ExecutionContext } from '@nestjs/common';
import { InvalidTokenError } from '../domain/errors';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let validateTokenUseCase: jest.Mocked<ValidateTokenUseCase>;

  beforeEach(async () => {
    const mockValidateTokenUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: ValidateTokenUseCase,
          useValue: mockValidateTokenUseCase,
        },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    validateTokenUseCase = module.get(ValidateTokenUseCase);
  });

  it('extracts the session token from the authorization header', async () => {
    const mockContext = createMockExecutionContext('Bearer valid_token');
    validateTokenUseCase.execute.mockResolvedValue({ userId: 'user_123' });
    await authGuard.canActivate(mockContext);

    expect(validateTokenUseCase.execute).toHaveBeenCalledWith({ token: 'valid_token' });
  });

  it('checks that the token is well-formed', async () => {
    const mockContext = createMockExecutionContext('invalid_token');
    const result = await authGuard.canActivate(mockContext);

    expect(result).toBe(false);
    expect(validateTokenUseCase.execute).not.toHaveBeenCalled();
  });

  it('checks that the token is valid using the Validate Token Use-Case', async () => {
    const mockContext = createMockExecutionContext('Bearer valid_token');
    validateTokenUseCase.execute.mockResolvedValue({ userId: 'user_123' });

    const result = await authGuard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(validateTokenUseCase.execute).toHaveBeenCalledWith({ token: 'valid_token' });
  });

  it('sets the user ID in the request context', async () => {
    const mockContext = createMockExecutionContext('Bearer valid_token');
    validateTokenUseCase.execute.mockResolvedValue({ userId: 'user_123' });

    await authGuard.canActivate(mockContext);

    expect(mockContext.switchToHttp().getRequest().user).toEqual({ userId: 'user_123' });
  });

  it('returns false when the token is invalid', async () => {
    const mockContext = createMockExecutionContext('Bearer invalid_token');
    validateTokenUseCase.execute.mockRejectedValue(new InvalidTokenError('Invalid token'));

    const result = await authGuard.canActivate(mockContext);

    expect(result).toBe(false);
  });

  it('rethrows the error if an internal error happens', async () => {
    const mockContext = createMockExecutionContext('Bearer invalid_token');

    validateTokenUseCase.execute.mockRejectedValue(new Error('Internal error'));

    await expect(authGuard.canActivate(mockContext)).rejects.toThrow('Internal error');
  });
});

function createMockExecutionContext(authHeader: string): ExecutionContext {
  const mockContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: authHeader,
        },
      }),
    }),
  };

  return mockContext as unknown as ExecutionContext;
}
