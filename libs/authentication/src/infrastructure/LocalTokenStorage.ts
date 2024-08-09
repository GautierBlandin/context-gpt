import { LocalTokenStorage, LocalTokenStorageOutput } from '../ports';

export class LocalTokenStorageImpl implements LocalTokenStorage {
  getToken(): LocalTokenStorageOutput {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return null;
    }
    return { token };
  }

  setToken({ token }: { token: string }): void {
    localStorage.setItem('authToken', token);
  }
}
