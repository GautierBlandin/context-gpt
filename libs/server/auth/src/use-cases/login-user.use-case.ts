import { UsersRepository } from '../ports/users.repository';
import { TokenService } from '../domain/token.service';
import { InvalidCredentialError } from '../domain/errors';
import { Inject } from '@nestjs/common';

interface LoginUserInput {
  email: string;
  password: string;
}

interface LoginUserOutput {
  token: string;
}

export abstract class LoginUserUseCase {
  abstract execute(input: LoginUserInput): Promise<LoginUserOutput>;
}

export class LoginUserUseCaseImpl extends LoginUserUseCase {
  constructor(
    @Inject(UsersRepository) private readonly usersRepository: UsersRepository,
    @Inject(TokenService) private readonly tokenService: TokenService,
  ) {
    super();
  }

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const user = await this.usersRepository.getByEmail(input.email);

    if (!user || !user.validateCredentials(input.password)) {
      throw new InvalidCredentialError('Email or password is incorrect');
    }

    const token = this.tokenService.generateToken(user.state.id);
    return { token };
  }
}
