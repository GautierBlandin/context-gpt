import { AuthToken } from './AuthToken';

export type AuthenticationState =
  | PreInitialization
  | Anonymous
  | PendingInitialTokenValidation
  | Authenticated
  | PendingTokenValidation;

export type PreInitialization = {
  type: AuthenticationStateType.PreInitialization;
  token: null;
};

export type Anonymous = {
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

export enum AuthenticationStateType {
  Anonymous = 'anonymous',
  PendingInitialTokenValidation = 'pendingInitialTokenValidation',
  Authenticated = 'authenticated',
  PendingTokenValidation = 'pendingTokenValidation',
  PreInitialization = 'preInitialization',
}
