export interface TokenChecker {
  checkToken({ token }: { token: string }): Promise<TokenCheckerOutput>;
}

export type TokenCheckerOutput =
  | {
      type: 'success';
      isValid: boolean;
      error: null;
    }
  | {
      type: 'error';
      isValid: null;
      error: string;
    };
