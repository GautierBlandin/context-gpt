import { TokenChecker, TokenCheckerOutput } from './TokenChecker';

export class TokenCheckerFake implements TokenChecker {
  private validToken: string | null = null;
  private shouldReturnError = false;
  private errorMessage = 'An error occurred';
  private delay = 0;

  async checkToken({ token }: { token: string }): Promise<TokenCheckerOutput> {
    await this.simulateDelay();

    if (this.shouldReturnError) {
      return {
        type: 'error',
        isValid: null,
        error: this.errorMessage,
      };
    }

    return {
      type: 'success',
      isValid: token === this.validToken,
      error: null,
    };
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
