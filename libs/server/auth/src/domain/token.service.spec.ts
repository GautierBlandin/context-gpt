import { TokenService } from './token.service';
import { EnvFake } from '@context-gpt/server-shared-env';

describe('TokenService', () => {
  it('generates a valid token', () => {
    const { tokenService } = setup();
    const userId = 'user123';

    const token = tokenService.generateToken(userId);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('validates a valid token', () => {
    const { tokenService } = setup();
    const userId = 'user123';

    const token = tokenService.generateToken(userId);
    const isValid = tokenService.validateToken(token);

    expect(isValid).toBe(true);
  });

  it('invalidates an incorrect token', () => {
    const { tokenService } = setup();
    const incorrectToken = 'invalid_token';

    const isValid = tokenService.validateToken(incorrectToken);

    expect(isValid).toBe(false);
  });

  it('extracts user ID from a valid token', () => {
    const { tokenService } = setup();
    const userId = 'user123';

    const token = tokenService.generateToken(userId);
    const extractedUserId = tokenService.getUserIdFromToken(token);

    expect(extractedUserId).toBe(userId);
  });

  it('throws an error when extracting user ID from an invalid token', () => {
    const { tokenService } = setup();
    const invalidToken = 'invalid_token';

    expect(() => tokenService.getUserIdFromToken(invalidToken)).toThrow('Invalid token');
  });

  it('throws an error when JWT_SECRET_KEY is not set', () => {
    const { tokenService, envFake } = setup();

    envFake.clear('JWT_SECRET_KEY');

    expect(() => tokenService.generateToken('user123')).toThrow('JWT_SECRET_KEY is not set in the environment');
  });
});

const setup = () => {
  const envFake = new EnvFake();
  envFake.set('JWT_SECRET_KEY', 'test_secret_key');
  const tokenService = new TokenService(envFake);
  return { tokenService, envFake };
};
