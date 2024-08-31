import { TokenService } from '../domain/token.service';

interface ValidateTokenInput {
  token: string;
}

interface ValidateTokenOutput {
  userId: string;
}

export class ValidateTokenUseCase {
  constructor(private readonly tokenService: TokenService) {}

  async execute(input: ValidateTokenInput): Promise<ValidateTokenOutput> {
    const { token } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    return { userId };
  }
}
