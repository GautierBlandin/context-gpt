import { User } from '../domain/user.aggregate';
import { InMemoryUserRepository } from './users.repository.in-memory';

describe('InMemoryUserRepository', () => {
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
  });

  it('saves a user', async () => {
    const user = User.create({ email: 'test@example.com', password: 'password123' });
    await repository.save(user);
    const savedUser = await repository.getByEmail(user.state.email);
    expect(savedUser).toEqual(user);
  });

  it('returns null for non-existent email', async () => {
    const user = await repository.getByEmail('nonexistent@example.com');
    expect(user).toBeNull();
  });

  it('updates an existing user', async () => {
    const user = User.create({ email: 'test@example.com', password: 'password123' });
    await repository.save(user);

    const updatedUser = User.from({
      ...user.state,
      hashedPassword: 'newhash',
    });
    await repository.save(updatedUser);

    const retrievedUser = await repository.getByEmail(user.state.email);
    expect(retrievedUser?.state.hashedPassword).toBe('newhash');
  });
});
