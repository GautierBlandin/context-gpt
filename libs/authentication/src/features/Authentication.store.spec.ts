import { TokenCheckerFake } from '../ports/TokenChecker.fake';
import { LocalTokenStorageFake } from '../ports/LocalTokenStorage.fake';
import { TokenCheckerSingleton } from '../composition-root/TokenChecker.di';
import { LocalTokenStorageSingleton } from '../composition-root/LocalTokenStorage.di';
import { authenticationStoreFactory } from './Authentication.store';

describe('Authentication store', () => {
  afterEach(async () => {
    await vi.runAllTimersAsync();
  });

  it('should initialize as Anonymous when no token is present', () => {
    const { store } = setup();

    expect(store.getState().authState).toEqual({ type: 'anonymous', token: null });
  });

  it('should initialize as PendingInitialTokenValidation when a token is present', () => {
    const { localTokenStorageFake } = setup();
    localTokenStorageFake.setToken({ token: 'initialToken' });

    const newStore = authenticationStoreFactory();

    expect(newStore.getState().authState).toEqual({
      type: 'pendingInitialTokenValidation',
      token: { token: 'initialToken' },
    });
  });

  it('should transition to Authenticated state when initial token is valid', async () => {
    const { localTokenStorageFake, tokenCheckerFake } = setup();
    localTokenStorageFake.setToken({ token: 'validToken' });
    tokenCheckerFake.setValidToken('validToken');

    const newStore = authenticationStoreFactory();

    await vi.runAllTimersAsync();

    expect(newStore.getState().authState).toEqual({ type: 'authenticated', token: { token: 'validToken' } });
  });

  it('should transition to Anonymous state when initial token is invalid', async () => {
    const { localTokenStorageFake, tokenCheckerFake } = setup();
    localTokenStorageFake.setToken({ token: 'invalidToken' });
    tokenCheckerFake.setValidToken('validToken');

    const store = authenticationStoreFactory();

    await vi.runAllTimersAsync();

    expect(store.getState().authState).toEqual({ type: 'anonymous', token: null });
  });

  it('should handle token submission and transition to Authenticated state when valid', async () => {
    const { store, tokenCheckerFake } = setup();
    tokenCheckerFake.setValidToken('newValidToken');

    store.getState().actions.submitToken('newValidToken');

    expect(store.getState().authState.type).toBe('pendingTokenValidation');

    await vi.runAllTimersAsync();

    expect(store.getState().authState).toEqual({ type: 'authenticated', token: { token: 'newValidToken' } });
  });

  it('should handle token submission and transition to Anonymous state when invalid', async () => {
    const { store, tokenCheckerFake } = setup();
    tokenCheckerFake.setValidToken('validToken');

    store.getState().actions.submitToken('invalidToken');

    expect(store.getState().authState.type).toBe('pendingTokenValidation');

    await vi.runAllTimersAsync();

    expect(store.getState().authState).toEqual({ type: 'anonymous', token: null });
  });

  it('should handle token checker errors and transition to Anonymous state', async () => {
    const { store, tokenCheckerFake } = setup();
    tokenCheckerFake.setReturnError(true, 'Token check failed');

    store.getState().actions.submitToken('someToken');

    expect(store.getState().authState.type).toBe('pendingTokenValidation');

    await vi.runAllTimersAsync();

    expect(store.getState().authState).toEqual({ type: 'anonymous', token: null });
  });
});

const setup = () => {
  TokenCheckerSingleton.reset();
  LocalTokenStorageSingleton.reset();

  const tokenCheckerFake = new TokenCheckerFake();
  tokenCheckerFake.setDelay(100);
  const localTokenStorageFake = new LocalTokenStorageFake();

  TokenCheckerSingleton.setOverride(tokenCheckerFake);
  LocalTokenStorageSingleton.setOverride(localTokenStorageFake);

  vi.useFakeTimers();

  return {
    store: authenticationStoreFactory(),
    tokenCheckerFake,
    localTokenStorageFake,
  };
};
