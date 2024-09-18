import { proxy, ref } from 'valtio/vanilla';
import { AuthenticationState, AuthenticationStateType, AuthToken } from '../core';
import { LocalTokenStorageSingleton } from '../composition-root/LocalTokenStorage.di';
import { TokenCheckerSingleton } from '../composition-root/AuthenticationRepository.singleton';

export class AuthenticationStore {
  public authState: AuthenticationState;

  private localTokenStorage = ref(LocalTokenStorageSingleton.getInstance());
  private tokenChecker = ref(TokenCheckerSingleton.getInstance());

  constructor() {
    this.authState = { type: AuthenticationStateType.PreInitialization, token: null };
  }

  public async initialize() {
    this.authState = this.determineInitialAuthState();
    if (this.authState.type === AuthenticationStateType.PendingInitialTokenValidation) {
      this.handlePendingInitialTokenValidation({ token: this.authState.token });
    }
  }

  public async login({ token }: { token: string }): Promise<{ error?: string }> {
    this.localTokenStorage.setToken({ token });
    this.authState = { type: AuthenticationStateType.PendingTokenValidation, token: null };

    const { type, accessToken, error } = await this.tokenChecker.login({ token });

    if (type === 'error') {
      this.authState = { type: AuthenticationStateType.Anonymous, token: null };
      return { error };
    }

    this.authState = { type: AuthenticationStateType.Authenticated, token: { token: accessToken } };
    this.tokenChecker.setToken({ token });
    return {};
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
    this.tokenChecker.setToken({ token: token.token });
    this.tokenChecker.checkToken().then((result) => {
      if (!(result.type === 'success') || !result.isValid) {
        this.authState = { type: AuthenticationStateType.Anonymous, token: null };
      } else {
        this.authState = { type: AuthenticationStateType.Authenticated, token };
      }
    });
  }
}

export const authenticationStore = proxy(new AuthenticationStore());
