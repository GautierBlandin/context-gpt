import { act, renderHook, waitFor } from '@testing-library/react';
import { useCreateThread } from './create-thread.headless';
import { threadsRepositorySingleton } from '../../compositionRoot/threads.repository.singleton';
import { FakeThreadsRepository } from '../../ports/threads.repository.fake';
import { err, Result, success } from '@context-gpt/errors';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Thread } from '../../core/Thread';

describe('useCreateThread', () => {
  let fakeThreadsRepository: FakeThreadsRepository;
  let queryClient: QueryClient;

  beforeEach(() => {
    fakeThreadsRepository = new FakeThreadsRepository();
    threadsRepositorySingleton.setOverride(fakeThreadsRepository);
    queryClient = new QueryClient();
  });

  afterEach(() => {
    threadsRepositorySingleton.reset();
    queryClient.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('has defined thread data and undefined error if the mutation resolves successfully', async () => {
    const { result } = renderHook(() => useCreateThread(), { wrapper });

    act(() => {
      result.current.createThread();
    });

    await waitFor(() => {
      expect(result.current.thread).toBeDefined();
      expect(result.current.error).toBeNull();
    });
  });

  it('has undefined thread data and defined error if the mutation fails', async () => {
    const { result } = renderHook(() => useCreateThread(), { wrapper });

    const mockError = new Error('Failed to create thread');
    vi.spyOn(fakeThreadsRepository, 'createThread').mockResolvedValue(err(mockError));

    act(() => {
      result.current.createThread();
    });

    await waitFor(() => {
      expect(result.current.thread).toBeUndefined();
      expect(result.current.error).toEqual(mockError);
    });
  });

  it('is in loading state before the mutation resolves', async () => {
    let resolvePromise: (value: Result<Thread, Error>) => void;

    const promise = new Promise<Result<Thread, Error>>((resolve) => {
      resolvePromise = resolve;
    });

    // Override the createThread method to return our manually resolvable promise
    vi.spyOn(fakeThreadsRepository, 'createThread').mockImplementation(() => {
      return promise;
    });

    const { result } = renderHook(() => useCreateThread(), { wrapper });

    act(() => {
      result.current.createThread();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    act(() => {
      resolvePromise(success({ id: '1', messages: [] }));
    });

    // Wait for the loading state to change
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
