import { getSdk } from '@context-gpt/context-gpt-sdk';
import { AuthTokenHandler, AuthTokenHandlerOutput, LoginOutput } from '../ports';

export class AuthTokenHandlerImpl implements AuthTokenHandler {
  private readonly sdk = getSdk();

  setToken({ token }: { token: string }): void {
    this.sdk.setAccessToken(token);
  }

  async checkToken(): Promise<AuthTokenHandlerOutput> {
    const { data, error } = await this.sdk.auth.validate();

    if (error) {
      return { type: 'error', error: 'An error occurred' };
    }

    return { type: 'success', isValid: data.is_valid };
  }

  async login({ token }: { token: string }): Promise<LoginOutput> {
    const { data, error } = await this.sdk.auth.login({ token });

    if (error) {
      return { type: 'error', error };
    }

    return { type: 'success', accessToken: data.access_token };
  }
}
