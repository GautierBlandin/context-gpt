import { AuthenticationStore } from './Authentication.store';
import { AuthTokenHandlerFake } from '../ports/AuthenticationRepository.fake';
import { LocalTokenStorageFake } from '../ports/LocalTokenStorage.fake';
import { TokenCheckerSingleton } from '../composition-root/AuthenticationRepository.singleton';
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
    const { localTokenStorageFake, tokenCheckerFake } = setup();
    localTokenStorageFake.setToken({ token: 'validToken' });
    tokenCheckerFake.setValidToken('validToken');

    const newStore = new AuthenticationStore();
    newStore.initialize();

    await vi.runAllTimersAsync();

    expect(newStore.authState).toEqual({ type: AuthenticationStateType.Authenticated, token: { token: 'validToken' } });
  });

  it('should transition to Anonymous state when initial token is invalid', async () => {
    const { localTokenStorageFake, tokenCheckerFake } = setup();
    localTokenStorageFake.setToken({ token: 'invalidToken' });
    tokenCheckerFake.setValidToken('validToken');

    const store = new AuthenticationStore();
    store.initialize();

    await vi.runAllTimersAsync();

    expect(store.authState).toEqual({ type: AuthenticationStateType.Anonymous, token: null });
  });

  describe('login', () => {
    it('should handle successful login and transition to Authenticated state', async () => {
      const { store, tokenCheckerFake } = setup();
      tokenCheckerFake.setValidToken('newValidToken');

      store.login({ token: 'newValidToken' });

      await vi.runAllTimersAsync();

      expect(store.authState).toEqual({
        type: AuthenticationStateType.Authenticated,
        token: { token: 'newValidToken' },
      });

      expect(tokenCheckerFake.currentToken).toEqual('newValidToken');
    });

    it('should handle token submission and transition to Anonymous state when invalid', async () => {
      const { store, tokenCheckerFake } = setup();
      tokenCheckerFake.setValidToken('validToken');
      tokenCheckerFake.setDelay(1);

      store.login({ token: 'invalidToken' });

      await vi.runAllTimersAsync();

      expect(store.authState).toEqual({ type: AuthenticationStateType.Anonymous, token: null });
    });

    it('should handle token checker errors and transition to Anonymous state', async () => {
      const { store, tokenCheckerFake } = setup();
      tokenCheckerFake.setReturnError(true, 'Token check failed');

      store.login({ token: 'someToken' });

      await vi.runAllTimersAsync();

      expect(store.authState).toEqual({ type: AuthenticationStateType.Anonymous, token: null });
    });
  });
});

const setup = () => {
  TokenCheckerSingleton.reset();
  LocalTokenStorageSingleton.reset();

  const tokenCheckerFake = new AuthTokenHandlerFake();
  tokenCheckerFake.setDelay(100);
  const localTokenStorageFake = new LocalTokenStorageFake();

  TokenCheckerSingleton.setOverride(tokenCheckerFake);
  LocalTokenStorageSingleton.setOverride(localTokenStorageFake);

  vi.useFakeTimers();

  return {
    store: new AuthenticationStore(),
    tokenCheckerFake,
    localTokenStorageFake,
  };
};
