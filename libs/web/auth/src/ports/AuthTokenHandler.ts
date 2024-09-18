import { Result } from '@context-gpt/errors';

export interface AuthTokenHandler {
  setToken({ token }: { token: string }): void;
  checkToken(): Promise<AuthTokenHandlerOutput>;
  login({ email, password }: { email: string; password: string }): Promise<LoginOutput>;
}

export type AuthTokenHandlerOutput = Result<{ isValid: boolean }, { message: string }>;

export type LoginOutput = Result<{ token: string }, { message: string }>;
