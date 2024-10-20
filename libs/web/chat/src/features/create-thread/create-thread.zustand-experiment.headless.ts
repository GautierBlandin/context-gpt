import { Thread } from '../../core/Thread';
import { MutationObserver, MutationObserverResult, QueryClient } from '@tanstack/query-core';
import { StateCreator } from 'zustand';
import { threadsRepositorySingleton } from '../../compositionRoot/threads.repository.singleton';
import { toPromise } from '@context-gpt/errors';

type CreateThreadState = Pick<MutationObserverResult<Thread, Error>, 'data' | 'error' | 'isPending'> & {
  createThread: () => Promise<void>;
};

export const createThreadHeadlessStoreFactory: (queryClient: QueryClient) => StateCreator<CreateThreadState> =
  (queryClient) => (set) => {
    const threadsRepository = threadsRepositorySingleton.getInstance();
    const mutationObserver = new MutationObserver(queryClient, {
      mutationFn: () => toPromise(threadsRepository.createThread()),
    });

    mutationObserver.subscribe((mutationState) => {
      set({
        error: mutationState.error,
        data: mutationState.data,
        isPending: mutationState.isPending,
      });
    });

    return {
      error: mutationObserver.getCurrentResult().error,
      data: mutationObserver.getCurrentResult().data,
      isPending: mutationObserver.getCurrentResult().isPending,
      createThread: async () => {
        await mutationObserver.mutate().catch(noop);
      },
    };
  };

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop(): void {}
