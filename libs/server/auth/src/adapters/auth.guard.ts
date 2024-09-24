import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ValidateTokenUseCase } from '../use-cases/validate-token.use-case';
import { InvalidTokenError } from '../domain/errors';

export interface AuthUser {
  userId: string;
}

export type WithAuthUser<T extends Request> = T & { user: AuthUser };

export function withMockAuthUser<T extends Request>(request: T, userId?: string): WithAuthUser<T> {
  return { ...request, user: { userId: userId ?? 'user123' } };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly validateTokenUseCase: ValidateTokenUseCase) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const { userId } = await this.validateTokenUseCase.execute({ token });
      request.user = { userId };
      return true;
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        throw new UnauthorizedException('Invalid token');
      }
      console.log('error', error);
      throw error;
    }
  }
}
