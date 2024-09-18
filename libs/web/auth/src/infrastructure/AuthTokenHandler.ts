import { getSdk } from '@context-gpt/context-gpt-sdk';
import { AuthTokenHandler, AuthTokenHandlerOutput, LoginOutput } from '../ports';
import { err, success } from '@context-gpt/errors';

export class AuthTokenHandlerImpl implements AuthTokenHandler {
  private readonly sdk = getSdk();

  setToken({ token }: { token: string }): void {
    this.sdk.setAccessToken(token);
  }

  async checkToken(): Promise<AuthTokenHandlerOutput> {
    const { error } = await this.sdk.auth.validate();

    if (error) {
      return err({ message: error.message });
    }

    return success({ isValid: true });
  }

  async login({ email, password }: { email: string; password: string }): Promise<LoginOutput> {
    const { data, error } = await this.sdk.auth.login({ email, password });

    if (error) {
      return err({ message: error.message });
    }

    return success({ token: data.token });
  }
}
