import { AuthTokenHandler, AuthTokenHandlerOutput, LoginOutput } from './AuthTokenHandler';
import { err, success } from '@context-gpt/errors';

export class AuthTokenHandlerFake implements AuthTokenHandler {
  public currentToken: string | null = null;
  private validToken: string | null = null;
  private shouldReturnError = false;
  private errorMessage = 'An error occurred';
  private delay = 0;

  setToken({ token }: { token: string }): void {
    this.currentToken = token;
  }

  async checkToken(): Promise<AuthTokenHandlerOutput> {
    await this.simulateDelay();

    if (this.shouldReturnError) {
      return err({ message: this.errorMessage });
    }

    return success({ isValid: this.currentToken === this.validToken });
  }

  async login({ email, password }: { email: string; password: string }): Promise<LoginOutput> {
    await this.simulateDelay();

    if (this.shouldReturnError) {
      return err({ message: this.errorMessage });
    }

    if (email && password) {
      return success({ token: 'fake_token_' + Date.now() });
    } else {
      return err({ message: 'Invalid email or password' });
    }
  }

  // Additional functions for testing purposes

  setValidToken(token: string): void {
    this.validToken = token;
  }

  clearValidToken(): void {
    this.validToken = null;
  }

  setReturnError(shouldReturnError: boolean, errorMessage?: string): void {
    this.shouldReturnError = shouldReturnError;
    if (errorMessage) {
      this.errorMessage = errorMessage;
    }
  }

  setDelay(milliseconds: number): void {
    this.delay = milliseconds;
  }

  private async simulateDelay(): Promise<void> {
    if (this.delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.delay));
    }
  }
}
