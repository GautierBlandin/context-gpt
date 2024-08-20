export interface AuthTokenHandler {
  setToken({ token }: { token: string }): void;
  checkToken(): Promise<AuthTokenHandlerOutput>;
}

export type AuthTokenHandlerOutput =
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
