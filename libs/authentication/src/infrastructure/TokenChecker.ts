import { getSdk } from '@context-gpt/context-gpt-sdk';
import { TokenChecker, TokenCheckerOutput } from '../ports';

export class TokenCheckerImpl implements TokenChecker {
  private readonly sdk = getSdk();

  async checkToken({ token }: { token: string }): Promise<TokenCheckerOutput> {
    const { data, error } = await this.sdk.checkToken({ token });

    if (error) {
      return { type: 'error', isValid: null, error: 'An error occurred' };
    }

    return { type: 'success', isValid: data.isValid, error: null };
  }
}
