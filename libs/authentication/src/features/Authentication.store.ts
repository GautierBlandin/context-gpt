import { AuthToken } from '../core';
import { createStore } from 'zustand';
import { LocalTokenStorageSingleton } from '../composition-root/LocalTokenStorage.di';
import { TokenCheckerSingleton } from '../composition-root/TokenChecker.di';
import { AuthenticationState, AuthenticationStateType } from '../core';

interface AuthenticationStoreState {
  authState: AuthenticationState;
  actions: AuthenticationActions;
}

interface AuthenticationActions {
  submitToken: (token: string) => Promise<void>;
}

export const authenticationStoreFactory = () =>
  createStore<AuthenticationStoreState>((set, get) => {
    const localTokenStorage = LocalTokenStorageSingleton.getInstance();
    const tokenChecker = TokenCheckerSingleton.getInstance();

    const initialToken = localTokenStorage.getToken();
    const initialAuthState = determineInitialAuthState(initialToken);

    if (initialAuthState.type === AuthenticationStateType.PendingInitialTokenValidation) {
      handlePendingInitialTokenValidation(initialAuthState.token, tokenChecker, set);
    }

    return {
      authState: initialAuthState,
      actions: {
        submitToken: async (token: string) => {
          localTokenStorage.setToken({ token });
          set({ authState: { type: AuthenticationStateType.PendingTokenValidation, token: null } });
          const result = await tokenChecker.checkToken({ token: token });
          if (!(result.type === 'success') || !result.isValid) {
            set({ authState: { type: AuthenticationStateType.Anonymous, token: null } });
          } else {
            set({ authState: { type: AuthenticationStateType.Authenticated, token: { token } } });
          }
        },
      },
    };
  });

function determineInitialAuthState(initialToken: AuthToken | null): AuthenticationState {
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

function handlePendingInitialTokenValidation(
  initialToken: AuthToken,
  tokenChecker: ReturnType<typeof TokenCheckerSingleton.getInstance>,
  set: (state: Partial<AuthenticationStoreState>) => void,
) {
  tokenChecker.checkToken({ token: initialToken.token }).then((result) => {
    if (!(result.type === 'success') || !result.isValid) {
      set({ authState: { type: AuthenticationStateType.Anonymous, token: null } });
    } else {
      set({ authState: { type: AuthenticationStateType.Authenticated, token: initialToken } });
    }
  });
}

export const authenticationStore = authenticationStoreFactory();
