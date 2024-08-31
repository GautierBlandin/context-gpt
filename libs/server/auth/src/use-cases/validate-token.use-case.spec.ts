import { ValidateTokenUseCaseImpl } from './validate-token.use-case';
import { TokenService } from '../domain/token.service';
import { InvalidTokenError } from '../domain/errors';
import { EnvFake } from '@context-gpt/server-shared-env';

describe('ValidateTokenUseCase', () => {
  let validateTokenUseCase: ValidateTokenUseCaseImpl;
  let tokenService: TokenService;
  let env: EnvFake;

  beforeEach(() => {
    env = new EnvFake();
    env.set('JWT_SECRET_KEY', 'test-secret-key');
    tokenService = new TokenService(env);
    validateTokenUseCase = new ValidateTokenUseCaseImpl(tokenService);
  });

  it('returns userId when token is valid', async () => {
    const userId = 'user-123';
    const validToken = tokenService.generateToken(userId);

    const result = await validateTokenUseCase.execute({ token: validToken });

    expect(result).toEqual({ userId });
  });

  it('throws InvalidTokenError when token is invalid', async () => {
    const invalidToken = 'invalid-token';

    await expect(validateTokenUseCase.execute({ token: invalidToken })).rejects.toThrow(InvalidTokenError);
  });
});
