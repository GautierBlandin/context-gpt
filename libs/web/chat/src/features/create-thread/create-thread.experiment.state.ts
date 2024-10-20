import { useRef } from 'react';
import { useSnapshot } from 'valtio';
import { createThreadHeadless } from './create-thread.experiment.headless';
import { QueryClient } from '@tanstack/query-core';

export function useCreateThread() {
  const createThreadRef = useRef(createThreadHeadless(new QueryClient()));

  const { thread, isPending, error } = useSnapshot(createThreadRef.current);

  return {
    thread,
    isPending,
    error,
    createThread: () => {
      return createThreadRef.current.createThread();
    },
  };
}
