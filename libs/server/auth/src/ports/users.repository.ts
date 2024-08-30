import { User } from '../domain/user.aggregate';

export abstract class UsersRepository {
  abstract save(user: User): Promise<void>;
  abstract getByEmail(email: string): Promise<User | null>;
}
