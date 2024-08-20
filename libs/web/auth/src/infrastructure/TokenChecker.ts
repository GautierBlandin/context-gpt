import { getSdk } from '@context-gpt/context-gpt-sdk';
import { AuthTokenHandler, AuthTokenHandlerOutput } from '../ports';

export class TokenCheckerImpl implements AuthTokenHandler {
  private readonly sdk = getSdk();

  setToken({ token }: { token: string }): void {
    this.sdk.setAccessToken(token);
  }

  async checkToken(): Promise<AuthTokenHandlerOutput> {
    const { data, error } = await this.sdk.checkToken();

    if (error) {
      return { type: 'error', isValid: null, error: 'An error occurred' };
    }

    return { type: 'success', isValid: data.isValid, error: null };
  }
}
