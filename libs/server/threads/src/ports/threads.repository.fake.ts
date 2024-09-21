import { err, Result, success } from '@context-gpt/errors';
import { ThreadAggregate } from '../domain/thread.aggregate';
import { DomainError, InfrastructureError } from '@context-gpt/server-shared-errors';
import { ThreadsRepository } from './threads.repository';

export class ThreadsRepositoryFake extends ThreadsRepository {
  private threads: Map<string, ThreadAggregate> = new Map();

  async save(thread: ThreadAggregate): Promise<Result<void, InfrastructureError>> {
    this.threads.set(thread.state.id, thread);
    return success(undefined);
  }

  async get(id: string): Promise<Result<ThreadAggregate, InfrastructureError | DomainError>> {
    const thread = this.threads.get(id);
    if (!thread) {
      return err(new DomainError(`Thread with id ${id} not found`));
    }
    return success(thread);
  }

  async listForUser(userId: string): Promise<Result<ThreadAggregate[], InfrastructureError | DomainError>> {
    const userThreads = Array.from(this.threads.values()).filter((thread) => thread.state.createdBy === userId);
    return success(userThreads);
  }

  clear(): void {
    this.threads.clear();
  }
}
