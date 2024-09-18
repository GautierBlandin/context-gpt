import { Result } from '@context-gpt/errors';

export interface AuthenticationRepository {
  setToken({ token }: { token: string }): void;
  validateToken(): Promise<ValidateTokenOutput>;
  login({ email, password }: { email: string; password: string }): Promise<LoginOutput>;
}

export type ValidateTokenOutput = Result<{ isValid: boolean }, { message: string }>;

export type LoginOutput = Result<{ token: string }, { message: string }>;
