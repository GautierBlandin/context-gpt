import { proxy, subscribe } from 'valtio';
import { AuthToken } from '../core';
import { LocalTokenStorageSingleton } from '../composition-root/LocalTokenStorage.di';
import { TokenCheckerSingleton } from '../composition-root/TokenChecker.di';
import { AuthenticationState, AuthenticationStateType } from '../core';

export class AuthenticationStore {
  private localTokenStorage = LocalTokenStorageSingleton.getInstance();
  private tokenChecker = TokenCheckerSingleton.getInstance();

  authState: AuthenticationState;

  constructor() {
    this.authState = this.determineInitialAuthState();
    if (this.authState.type === AuthenticationStateType.PendingInitialTokenValidation) {
      this.handlePendingInitialTokenValidation(this.authState.token);
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

  private handlePendingInitialTokenValidation(initialToken: AuthToken) {
    this.tokenChecker.checkToken({ token: initialToken.token }).then((result) => {
      if (!(result.type === 'success') || !result.isValid) {
        this.authState = { type: AuthenticationStateType.Anonymous, token: null };
      } else {
        this.authState = { type: AuthenticationStateType.Authenticated, token: initialToken };
      }
    });
  }

  async submitToken(token: string) {
    this.localTokenStorage.setToken({ token });
    this.authState = { type: AuthenticationStateType.PendingTokenValidation, token: null };
    const result = await this.tokenChecker.checkToken({ token });
    if (!(result.type === 'success') || !result.isValid) {
      this.authState = { type: AuthenticationStateType.Anonymous, token: null };
    } else {
      this.authState = { type: AuthenticationStateType.Authenticated, token: { token } };
    }
  }
}

export const authenticationStore = proxy(new AuthenticationStore());

// Optional: Export a subscribe function for easier state management in components
export const subscribeToAuthState = (callback: (state: AuthenticationState) => void) => {
  return subscribe(authenticationStore, () => callback(authenticationStore.authState));
};
