import { LocalTokenStorage, LocalTokenStorageOutput } from '../ports/LocalTokenStorage';

export class LocalTokenStorageImpl implements LocalTokenStorage {
  getToken(): LocalTokenStorageOutput {
    return { token: localStorage.getItem('authToken') };
  }

  setToken({ token }: { token: string }): void {
    localStorage.setItem('authToken', token);
  }
}
