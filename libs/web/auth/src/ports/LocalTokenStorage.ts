import { AuthToken } from '../core/AuthToken';

export interface LocalTokenStorage {
  getToken(): LocalTokenStorageOutput;
  setToken({ token }: { token: string }): void;
}

export type LocalTokenStorageOutput = AuthToken | null;
