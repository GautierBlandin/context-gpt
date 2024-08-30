import { UsersRepository } from '../ports/users.repository';
import { User } from '../domain/user.aggregate';

export class InMemoryUserRepository extends UsersRepository {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<void> {
    this.users.set(user.state.email, user);
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.users.get(email) || null;
  }
}
