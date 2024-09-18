import { AuthenticationStore } from './Authentication.store';
import { AuthenticationRepositoryFake } from '../ports/AuthenticationRepository.fake';
import { LocalTokenStorageFake } from '../ports/LocalTokenStorage.fake';
import { AuthenticationRepositorySingleton } from '../composition-root/AuthenticationRepository.singleton';
import { LocalTokenStorageSingleton } from '../composition-root/LocalTokenStorage.di';
import { AuthenticationStateType } from '../core';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('Authentication store', () => {
  afterEach(async () => {
    await vi.runAllTimersAsync();
  });

  it('should initialize with PreInitialization state', () => {
    const { store } = setup();

    expect(store.authState).toEqual({ type: AuthenticationStateType.PreInitialization, token: null });
  });

  it('should initialize as Anonymous when no token is present after calling initialize', async () => {
    const { localTokenStorageFake } = setup();

    localTokenStorageFake.clearToken();
    const store = new AuthenticationStore();

    await store.initialize();

    expect(store.authState).toEqual({ type: AuthenticationStateType.Anonymous, token: null });
  });

  it('should initialize as PendingInitialTokenValidation when a token is present after calling initialize', async () => {
    const { localTokenStorageFake } = setup();
    localTokenStorageFake.setToken({ token: 'initialToken' });

    const newStore = new AuthenticationStore();
    newStore.initialize();

    expect(newStore.authState).toEqual({
      type: AuthenticationStateType.PendingInitialTokenValidation,
      token: { token: 'initialToken' },
    });
  });

  it('should transition to Authenticated state when initial token is valid', async () => {
    const { localTokenStorageFake, authRepoFake } = setup();
    localTokenStorageFake.setToken({ token: 'validToken' });
    authRepoFake.setValidToken('validToken');

    const newStore = new AuthenticationStore();
    newStore.initialize();

    await vi.runAllTimersAsync();

    expect(newStore.authState).toEqual({ type: AuthenticationStateType.Authenticated, token: { token: 'validToken' } });
  });

  it('should transition to Anonymous state when initial token is invalid', async () => {
    const { localTokenStorageFake, authRepoFake } = setup();
    localTokenStorageFake.setToken({ token: 'invalidToken' });
    authRepoFake.setValidToken('validToken');

    const store = new AuthenticationStore();
    store.initialize();

    await vi.runAllTimersAsync();

    expect(store.authState).toEqual({ type: AuthenticationStateType.Anonymous, token: null });
  });

  describe('login', () => {
    it('should handle successful login and transition to Authenticated state', async () => {
      const { store, authRepoFake } = setup();
      authRepoFake.setValidToken('newValidToken');

      const loginPromise = store.login({ email: 'test@example.com', password: 'password' });

      await vi.runAllTimersAsync();

      await loginPromise;

      expect(store.authState).toEqual({
        type: AuthenticationStateType.Authenticated,
        token: { token: expect.stringMatching(/^fake_token_\d+$/) },
      });

      expect(authRepoFake.currentToken).toMatch(/^fake_token_\d+$/);
    });

    it('should handle login failure and transition to Anonymous state', async () => {
      const { store, authRepoFake } = setup();
      authRepoFake.setReturnError(true, 'Invalid credentials');

      const loginPromise = store.login({ email: 'test@example.com', password: 'wrong_password' });

      await vi.runAllTimersAsync();

      const result = await loginPromise;

      expect(result).toEqual({ error: 'Invalid credentials' });
      expect(store.authState).toEqual({ type: AuthenticationStateType.Anonymous, token: null });
    });
  });
});

const setup = () => {
  AuthenticationRepositorySingleton.reset();
  LocalTokenStorageSingleton.reset();

  const authRepoFake = new AuthenticationRepositoryFake();
  authRepoFake.setDelay(100);
  const localTokenStorageFake = new LocalTokenStorageFake();

  AuthenticationRepositorySingleton.setOverride(authRepoFake);
  LocalTokenStorageSingleton.setOverride(localTokenStorageFake);

  vi.useFakeTimers();

  return {
    store: new AuthenticationStore(),
    authRepoFake,
    localTokenStorageFake,
  };
};
