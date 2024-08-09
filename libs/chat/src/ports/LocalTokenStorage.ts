export interface LocalTokenStorage {
  getToken(): LocalTokenStorageOutput;
  setToken({ token }: { token: string }): void;
}

export interface LocalTokenStorageOutput {
  token: string | null;
}
