import { QueryClient } from '@tanstack/query-core';
import { createThreadHeadless } from './create-thread.experiment.headless';
import { beforeEach } from 'vitest';
import { threadsRepositorySingleton } from '../../compositionRoot/threads.repository.singleton';
import { FakeThreadsRepository } from '../../ports/threads.repository.fake';
import { err, success } from '@context-gpt/errors';

describe('createThreadHeadless', () => {
  let fakeThreadsRepository: FakeThreadsRepository;
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    fakeThreadsRepository = new FakeThreadsRepository();
    threadsRepositorySingleton.setOverride(fakeThreadsRepository);
  });

  it('initialize correctly', async () => {
    const { thread, isPending, error } = createThreadHeadless(queryClient);

    expect(isPending).toBe(false);
    expect(error).toBeNull();
    expect(thread).toBeUndefined();
  });

  it('is in loading state while mutation is pending', async () => {
    vi.spyOn(fakeThreadsRepository, 'createThread').mockImplementation(async () => {
      await sleep(10);
      return success({ id: 'thread-id', messages: [] });
    });

    const state = createThreadHeadless(queryClient);

    state.createThread();

    expect(state.isPending).toBe(true);
    expect(state.error).toBeNull();
    expect(state.thread).toBeUndefined();
  });

  it('successfully creates a thread', async () => {
    vi.spyOn(fakeThreadsRepository, 'createThread').mockImplementation(async () => {
      await sleep(10);
      return success({ id: 'thread-id', messages: [] });
    });

    const state = createThreadHeadless(queryClient);

    state.createThread();

    await sleep(20);

    expect(state.isPending).toBe(false);
    expect(state.error).toBeNull();
    expect(state.thread).toMatchObject({ id: 'thread-id', messages: [] });
  });

  it('stores the error when the mutation fails', async () => {
    vi.spyOn(fakeThreadsRepository, 'createThread').mockImplementation(async () => {
      await sleep(10);
      return err(new Error('Failed to create thread'));
    });

    const state = createThreadHeadless(queryClient);

    state.createThread().catch(() => {});

    await sleep(20);

    expect(state.isPending).toBe(false);
    expect(state.error).toBeInstanceOf(Error);
    expect(state.thread).toBeUndefined();
  });
});

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
