import { UsersRepository } from '../ports/users.repository';
import { User } from '../domain/user.aggregate';
import { DomainError } from '@context-gpt/server-shared-errors';

interface RegisterUserInput {
  email: string;
  password: string;
}

export abstract class RegisterUserUseCase {
  abstract execute(input: RegisterUserInput): Promise<void>;
}

export class RegisterUserUseCaseImpl extends RegisterUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {
    super();
  }

  async execute(input: RegisterUserInput): Promise<void> {
    const existingUser = await this.usersRepository.getByEmail(input.email);
    if (existingUser) {
      throw new DomainError('Email already exists');
    }

    const newUser = User.create(input);
    await this.usersRepository.save(newUser);
  }
}
