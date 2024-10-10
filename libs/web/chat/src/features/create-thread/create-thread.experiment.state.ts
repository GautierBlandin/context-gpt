import { useRef } from 'react';
import { proxy, useSnapshot } from 'valtio';
import { createThreadHeadless } from './create-thread.experiment.headless';
import { QueryClient } from '@tanstack/query-core';

export function useCreateThread() {
  const createThreadRef = useRef(proxy(createThreadHeadless(new QueryClient())));

  const snap = useSnapshot(createThreadRef.current);

  return {
    thread: snap.thread,
    isPending: snap.isPending,
    error: snap.error,
    createThread: () => {
      return createThreadRef.current.createThread();
    },
  };
}
