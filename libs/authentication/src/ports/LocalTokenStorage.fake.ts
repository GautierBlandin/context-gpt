import { LocalTokenStorage, LocalTokenStorageOutput } from './LocalTokenStorage';

export class LocalTokenStorageFake implements LocalTokenStorage {
  private token: string | null = null;

  getToken(): LocalTokenStorageOutput {
    if (this.token === null) {
      return null;
    }
    return { token: this.token };
  }

  setToken({ token }: { token: string }): void {
    this.token = token;
  }
}
