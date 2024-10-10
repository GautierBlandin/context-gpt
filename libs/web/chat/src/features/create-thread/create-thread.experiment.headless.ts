import { threadsRepositorySingleton } from '../../compositionRoot/threads.repository.singleton';
import { MutationObserver, QueryClient } from '@tanstack/query-core';
import { toPromise } from '@context-gpt/errors';

export function createThreadHeadless(queryClient: QueryClient) {
  const threadsRepository = threadsRepositorySingleton.getInstance();
  const mutationObserver = new MutationObserver(queryClient, {
    mutationFn: () => toPromise(threadsRepository.createThread()),
  });

  const state = {
    error: mutationObserver.getCurrentResult().error,
    thread: mutationObserver.getCurrentResult().data,
    isPending: mutationObserver.getCurrentResult().isPending,
    createThread: () => mutationObserver.mutate(),
  };

  mutationObserver.subscribe((mutationState) => {
    console.log('here');
    state.error = mutationState.error;
    state.thread = mutationState.data;
    state.isPending = mutationState.isPending;
  });

  return state;
}
