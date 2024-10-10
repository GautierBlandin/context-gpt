import { useState } from 'react';
import { threadsRepositorySingleton } from '../../compositionRoot/threads.repository.singleton';
import { useMutation } from 'react-query';
import { toPromise } from '@context-gpt/errors';
import { Thread } from '../../core/Thread';

export function useCreateThread() {
  const [threadsRepository] = useState(() => threadsRepositorySingleton.getInstance());

  const { data, error, mutate, isLoading } = useMutation<Thread, Error>(async () => {
    return await toPromise(threadsRepository.createThread());
  });

  return {
    thread: data,
    error: error,
    isLoading,
    createThread: mutate,
  };
}
