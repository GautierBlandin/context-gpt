import { proxy, subscribe } from 'valtio';
import { AuthToken, AuthenticationState, AuthenticationStateType } from '../core';
import { LocalTokenStorageSingleton } from '../composition-root/LocalTokenStorage.di';
import { TokenCheckerSingleton } from '../composition-root/TokenChecker.di';

export class AuthenticationStore {
  public authState: AuthenticationState;

  private localTokenStorage = LocalTokenStorageSingleton.getInstance();
  private tokenChecker = TokenCheckerSingleton.getInstance();

  constructor() {
    this.authState = this.determineInitialAuthState();
    if (this.authState.type === AuthenticationStateType.PendingInitialTokenValidation) {
      this.handlePendingInitialTokenValidation({ token: this.authState.token });
    }
  }

  public async submitToken({ token }: { token: string }) {
    this.localTokenStorage.setToken({ token });
    this.authState = { type: AuthenticationStateType.PendingTokenValidation, token: null };
    const result = await this.tokenChecker.checkToken({ token });
    if (!(result.type === 'success') || !result.isValid) {
      this.authState = { type: AuthenticationStateType.Anonymous, token: null };
    } else {
      this.authState = { type: AuthenticationStateType.Authenticated, token: { token } };
    }
  }

  private determineInitialAuthState(): AuthenticationState {
    const initialToken = this.localTokenStorage.getToken();
    if (initialToken !== null) {
      return {
        type: AuthenticationStateType.PendingInitialTokenValidation,
        token: initialToken,
      };
    } else {
      return {
        type: AuthenticationStateType.Anonymous,
        token: null,
      };
    }
  }

  private handlePendingInitialTokenValidation({ token }: { token: AuthToken }) {
    this.tokenChecker.checkToken({ token: token.token }).then((result) => {
      if (!(result.type === 'success') || !result.isValid) {
        this.authState = { type: AuthenticationStateType.Anonymous, token: null };
      } else {
        this.authState = { type: AuthenticationStateType.Authenticated, token };
      }
    });
  }
}

export const authenticationStore = proxy(new AuthenticationStore());

export function subscribeToAuthState(callback: (state: AuthenticationState) => void) {
  return subscribe(authenticationStore, () => callback(authenticationStore.authState));
}
