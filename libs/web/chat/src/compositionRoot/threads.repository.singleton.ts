import { singletonFactory } from '@context-gpt/di';
import { ThreadsRepository } from '../ports/threads.repository';
import { HttpThreadsRepository } from '../infrastructure/threads.repository.http';

export const threadsRepositorySingleton = singletonFactory<ThreadsRepository>({
  factory: () => new HttpThreadsRepository(),
});
