import { QueryClient } from '@tanstack/query-core';
import { createThreadHeadlessStoreFactory } from './create-thread.zustand-experiment.headless';
import { createStore } from 'zustand';
import { FakeThreadsRepository } from '../../ports/threads.repository.fake';
import { threadsRepositorySingleton } from '../../compositionRoot/threads.repository.singleton';
import { success } from '@context-gpt/errors';

describe('create thread store', () => {
  it('initializes correctly', () => {
    const { store } = setup();

    expect(store.getState().isPending).toBe(false);
    expect(store.getState().error).toBeNull();
    expect(store.getState().data).toBeUndefined();
  });

  it('is in loading state while mutation is pending', async () => {
    const { store, fakeThreadsRepository } = setup();

    vi.spyOn(fakeThreadsRepository, 'createThread').mockImplementation(async () => {
      await sleep(10);
      return success({ id: 'thread-id', messages: [] });
    });

    store.getState().createThread();

    expect(store.getState().isPending).toBe(true);
    expect(store.getState().error).toBeNull();
    expect(store.getState().data).toBeUndefined();
  });

  it('successfully creates a thread', async () => {
    const { store, fakeThreadsRepository } = setup();

    vi.spyOn(fakeThreadsRepository, 'createThread').mockImplementation(async () => {
      await sleep(10);
      return success({ id: 'thread-id', messages: [] });
    });

    store.getState().createThread();

    await sleep(20);

    expect(store.getState().isPending).toBe(false);
    expect(store.getState().error).toBeNull();
    expect(store.getState().data).toMatchObject({ id: 'thread-id', messages: [] });
  });
});

const setup = () => {
  const queryClient = new QueryClient();
  const storeCreator = createThreadHeadlessStoreFactory(queryClient);

  const fakeThreadsRepository = new FakeThreadsRepository();
  threadsRepositorySingleton.setOverride(fakeThreadsRepository);

  return {
    store: createStore(storeCreator),
    fakeThreadsRepository,
  };
};

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
