import { threadsRepositorySingleton } from '../../compositionRoot/threads.repository.singleton';
import { MutationObserver, QueryClient } from '@tanstack/query-core';
import { toPromise } from '@context-gpt/errors';
import { proxy } from 'valtio';

export function createThreadHeadless(queryClient: QueryClient) {
  const threadsRepository = threadsRepositorySingleton.getInstance();
  const mutationObserver = new MutationObserver(queryClient, {
    mutationFn: () => toPromise(threadsRepository.createThread()),
  });

  const state = proxy({
    error: mutationObserver.getCurrentResult().error,
    thread: mutationObserver.getCurrentResult().data,
    isPending: mutationObserver.getCurrentResult().isPending,
    createThread: () => mutationObserver.mutate(),
  });

  mutationObserver.subscribe((mutationState) => {
    state.error = mutationState.error;
    state.thread = mutationState.data;
    state.isPending = mutationState.isPending;
  });

  return state;
}
