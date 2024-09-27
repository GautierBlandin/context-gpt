import { Result } from '@context-gpt/errors';
import { ThreadAggregate } from '../domain/thread.aggregate';
import { DomainError, InfrastructureError } from '@context-gpt/server-shared-errors';

export abstract class ThreadsRepository {
  abstract save(thread: ThreadAggregate): Promise<Result<void, InfrastructureError>>;
  abstract get(id: string): Promise<Result<ThreadAggregate, InfrastructureError | ThreadNotFoundError>>;
  abstract listForUser(userId: string): Promise<Result<ThreadAggregate[], InfrastructureError | DomainError>>;
}

export class ThreadNotFoundError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ThreadNotFoundError';
  }
}
