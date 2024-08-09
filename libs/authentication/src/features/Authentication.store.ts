import { AuthToken } from '../core/AuthToken';
import { createStore } from 'zustand';
import { LocalTokenStorageSingleton } from '../composition-root/LocalTokenStorage.di';
import { TokenCheckerSingleton } from '../composition-root/TokenChecker.di';

interface AuthenticationStoreState {
  authState: AuthenticationState;
  actions: AuthenticationActions;
}

type AuthenticationState = Anonymous | PendingInitialTokenValidation | Authenticated | PendingTokenValidation;

type Anonymous = {
  type: AuthenticationStateType.Anonymous;
  token: null;
};

type PendingInitialTokenValidation = {
  type: AuthenticationStateType.PendingInitialTokenValidation;
  token: AuthToken;
};

type Authenticated = {
  type: AuthenticationStateType.Authenticated;
  token: AuthToken;
};

type PendingTokenValidation = {
  type: AuthenticationStateType.PendingTokenValidation;
  token: null;
};

enum AuthenticationStateType {
  Anonymous = 'anonymous',
  PendingInitialTokenValidation = 'pendingInitialTokenValidation',
  Authenticated = 'authenticated',
  PendingTokenValidation = 'pendingTokenValidation',
}

interface AuthenticationActions {
  submitToken: (token: string) => Promise<void>;
}

export const authenticationStoreFactory = () =>
  createStore<AuthenticationStoreState>((set, get) => {
    const localTokenStorage = LocalTokenStorageSingleton.getInstance();
    const tokenChecker = TokenCheckerSingleton.getInstance();

    const initialToken = localTokenStorage.getToken();

    let initialAuthState: AuthenticationState;
    if (initialToken !== null) {
      initialAuthState = {
        type: AuthenticationStateType.PendingInitialTokenValidation,
        token: initialToken,
      };
    } else {
      initialAuthState = {
        type: AuthenticationStateType.Anonymous,
        token: null,
      };
    }

    if (initialAuthState.type === AuthenticationStateType.PendingInitialTokenValidation) {
      tokenChecker.checkToken({ token: initialAuthState.token.token }).then((result) => {
        if (!(result.type === 'success') || !result.isValid) {
          set({ authState: { type: AuthenticationStateType.Anonymous, token: null } });
        } else {
          // Safe assertion as this can only happen if there was an initial token
          set({ authState: { type: AuthenticationStateType.Authenticated, token: initialToken! } });
        }
      });
    }

    return {
      authState: {
        ...initialAuthState,
      },
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

export const authenticationStore = authenticationStoreFactory();
