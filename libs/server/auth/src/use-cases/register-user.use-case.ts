import { UsersRepository } from '../ports/users.repository';
import { User } from '../domain/user.aggregate';
import { DomainError } from '@context-gpt/server-shared-errors';

interface RegisterUserInput {
  email: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(input: RegisterUserInput): Promise<string> {
    const existingUser = await this.usersRepository.getByEmail(input.email);
    if (existingUser) {
      throw new DomainError('Email already exists');
    }

    const newUser = User.create(input);
    await this.usersRepository.save(newUser);

    return newUser.state.id;
  }
}
