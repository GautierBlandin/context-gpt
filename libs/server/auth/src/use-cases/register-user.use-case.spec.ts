import { UsersRepository } from '../ports/users.repository';
import { InMemoryUsersRepository } from '../infrastructure/users.repository.in-memory';
import { RegisterUserUseCaseImpl } from './register-user.use-case';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCaseImpl;
  let usersRepository: UsersRepository;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    useCase = new RegisterUserUseCaseImpl(usersRepository);
  });

  it('registers a new user successfully', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    await useCase.execute({ email, password });

    const savedUser = await usersRepository.getByEmail(email);
    expect(savedUser).not.toBeNull();
    expect(savedUser?.state.email).toBe(email);
  });

  it('fails to register a user with an existing email', async () => {
    const email = 'existing@example.com';
    const password = 'password123';

    await useCase.execute({ email, password });

    await expect(useCase.execute({ email, password })).rejects.toThrow('Email already exists');
  });
});
