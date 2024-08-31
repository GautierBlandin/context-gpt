import { TokenService } from '../domain/token.service';

interface ValidateTokenInput {
  token: string;
}

interface ValidateTokenOutput {
  userId: string;
}

export abstract class ValidateTokenUseCase {
  abstract execute(input: ValidateTokenInput): Promise<ValidateTokenOutput>;
}

export class ValidateTokenUseCaseImpl extends ValidateTokenUseCase {
  constructor(private readonly tokenService: TokenService) {
    super();
  }

  async execute(input: ValidateTokenInput): Promise<ValidateTokenOutput> {
    const { token } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    return { userId };
  }
}