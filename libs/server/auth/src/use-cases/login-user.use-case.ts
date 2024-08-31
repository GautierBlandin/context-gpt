import { UsersRepository } from '../ports/users.repository';
import { TokenService } from '../domain/token.service';
import { InvalidCredentialError } from '../domain/errors';

interface LoginUserInput {
  email: string;
  password: string;
}

interface LoginUserOutput {
  token: string;
}

export class LoginUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const user = await this.usersRepository.getByEmail(input.email);

    if (!user || !user.validateCredentials(input.password)) {
      throw new InvalidCredentialError('Email or password is incorrect');
    }

    const token = this.tokenService.generateToken(user.state.id);
    return { token };
  }
}
