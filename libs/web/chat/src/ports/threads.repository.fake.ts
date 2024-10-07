import { ThreadsRepository } from './threads.repository';
import { createThread, Thread } from '../core/Thread';
import { ResultAsync, success } from '@context-gpt/errors';

export class FakeThreadsRepository implements ThreadsRepository {
  private threads: Map<string, Thread> = new Map();

  public async createThread(): ResultAsync<Thread, Error> {
    const id = this.generateId();
    const thread = createThread(id);
    this.threads.set(id, thread);
    return success(thread);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
