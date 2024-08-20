export interface AuthTokenHandler {
  setToken({ token }: { token: string }): void;
  checkToken(): Promise<AuthTokenHandlerOutput>;
  login({ token }: { token: string }): Promise<LoginOutput>;
}

export type AuthTokenHandlerOutput =
  | {
      type: 'success';
      isValid: boolean;
      error?: never;
    }
  | {
      type: 'error';
      isValid?: never;
      error: string;
    };

export type LoginOutput =
  | {
      type: 'success';
      accessToken: string;
      error?: never;
    }
  | {
      type: 'error';
      accessToken?: never;
      error: string;
    };
