import { LoginUserUseCase } from './login-user.use-case';
import { User } from '../domain/user.aggregate';
import { TokenService } from '../domain/token.service';
import { EnvFake } from '@context-gpt/server-shared-env';
import { InMemoryUsersRepository } from '../infrastructure/users.repository.in-memory';
import { InvalidCredentialError } from '../domain/errors';

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase;
  let usersRepository: InMemoryUsersRepository;
  let tokenService: TokenService;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    const env = new EnvFake();
    env.set('JWT_SECRET_KEY', 'test-secret-key');
    tokenService = new TokenService(env);
    useCase = new LoginUserUseCase(usersRepository, tokenService);
  });

  it('successfully logs in a user with correct credentials', async () => {
    const user = User.create({ email: 'test@example.com', password: 'password123' });
    await usersRepository.save(user);

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty('token');
    expect(typeof result.token).toBe('string');
  });

  it('throws InvalidCredentialError when logging in with incorrect password', async () => {
    const user = User.create({ email: 'test@example.com', password: 'password123' });
    await usersRepository.save(user);

    await expect(
      useCase.execute({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow(InvalidCredentialError);
  });

  it('throws InvalidCredentialError when logging in a non-existent user', async () => {
    await expect(
      useCase.execute({
        email: 'nonexistent@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow(InvalidCredentialError);
  });
});
