import { create, useStore } from 'zustand';
import { createThreadHeadlessStoreFactory } from './create-thread.zustand-experiment.headless';
import { QueryClient } from '@tanstack/query-core';
import { useState } from 'react';

export function useCreateThread() {
  const [store] = useState(() => create(createThreadHeadlessStoreFactory(new QueryClient())));

  const createThreadStore = useStore(store);

  return {
    thread: createThreadStore.data,
    isPending: createThreadStore.isPending,
    error: createThreadStore.error,
    createThread: () => {
      return createThreadStore.createThread();
    },
  };
}
