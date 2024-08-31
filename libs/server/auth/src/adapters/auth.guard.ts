import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ValidateTokenUseCase } from '../use-cases/validate-token.use-case';
import { InvalidTokenError } from '../domain/errors';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly validateTokenUseCase: ValidateTokenUseCase) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.split(' ')[1];

    try {
      const { userId } = await this.validateTokenUseCase.execute({ token });
      request.user = { userId };
      return true;
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        return false;
      }
      throw error;
    }
  }
}
