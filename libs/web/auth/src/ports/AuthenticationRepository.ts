import { Result } from '@context-gpt/errors';

export interface AuthenticationRepository {
  setToken({ token }: { token: string }): void;
  validateToken(): Promise<ValidateTokenOutput>;
  login({ email, password }: { email: string; password: string }): Promise<LoginOutput>;
  register({ email, password }: { email: string; password: string }): Promise<RegisterOutput>;
}

export type ValidateTokenOutput = Result<{ isValid: boolean }, { message: string }>;

export type LoginOutput = Result<{ token: string }, { message: string }>;

export type RegisterOutput = Result<void, { message: string }>;
