import { getSdkSingleton } from './SdkSingleton';
import { TokenChecker, TokenCheckerOutput } from '../ports';

export class TokenCheckerImpl implements TokenChecker {
  private readonly sdk = getSdkSingleton();

  async checkToken({ token }: { token: string }): Promise<TokenCheckerOutput> {
    const result = await this.sdk.checkToken({ token });
    if (result.response.ok) {
      return { type: 'success', isValid: true, error: null };
    }
    return { type: 'error', isValid: null, error: result.response.statusText };
  }
}
