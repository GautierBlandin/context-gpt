import { getSdk } from '@context-gpt/context-gpt-sdk';
import { AuthenticationRepository, LoginOutput, ValidateTokenOutput } from '../ports';
import { err, success } from '@context-gpt/errors';

export class AuthenticationRepositoryImpl implements AuthenticationRepository {
  private readonly sdk = getSdk();

  setToken({ token }: { token: string }): void {
    this.sdk.setAccessToken(token);
  }

  async validateToken(): Promise<ValidateTokenOutput> {
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
