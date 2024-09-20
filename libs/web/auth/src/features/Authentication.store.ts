import { proxy, ref } from 'valtio/vanilla';
import { AuthenticationState, AuthenticationStateType, AuthToken } from '../core';
import { LocalTokenStorageSingleton } from '../composition-root/LocalTokenStorage.di';
import { AuthenticationRepositorySingleton } from '../composition-root/AuthenticationRepository.singleton';
import { Result } from '@context-gpt/errors';

export class AuthenticationStore {
  public authState: AuthenticationState;

  private localTokenStorage = ref(LocalTokenStorageSingleton.getInstance());
  private authenticationRepository = ref(AuthenticationRepositorySingleton.getInstance());

  constructor() {
    this.authState = { type: AuthenticationStateType.PreInitialization, token: null };
  }

  public async initialize() {
    this.authState = this.determineInitialAuthState();
    if (this.authState.type === AuthenticationStateType.PendingInitialTokenValidation) {
      this.handlePendingInitialTokenValidation({ token: this.authState.token });
    }
  }

  public async login({ email, password }: { email: string; password: string }): Promise<Result<void, string>> {
    this.authState = { type: AuthenticationStateType.PendingTokenValidation, token: null };

    const result = await this.authenticationRepository.login({ email, password });

    if (result.type === 'error') {
      this.authState = { type: AuthenticationStateType.Anonymous, token: null };
      return { type: 'error', error: result.error.message };
    }

    const token = result.value.token;
    this.localTokenStorage.setToken({ token });
    this.authState = { type: AuthenticationStateType.Authenticated, token: { token } };
    this.authenticationRepository.setToken({ token });
    return { type: 'success', value: undefined };
  }

  public async register({ email, password }: { email: string; password: string }): Promise<Result<void, string>> {
    const result = await this.authenticationRepository.register({ email, password });

    if (result.type === 'error') {
      return { type: 'error', error: result.error.message };
    }

    return { type: 'success', value: undefined };
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

  private async handlePendingInitialTokenValidation({ token }: { token: AuthToken }) {
    this.authenticationRepository.setToken({ token: token.token });
    const result = await this.authenticationRepository.validateToken();
    if (result.type === 'error' || !result.value.isValid) {
      this.authState = { type: AuthenticationStateType.Anonymous, token: null };
    } else {
      this.authState = { type: AuthenticationStateType.Authenticated, token };
    }
  }
}

export const authenticationStore = proxy(new AuthenticationStore());
