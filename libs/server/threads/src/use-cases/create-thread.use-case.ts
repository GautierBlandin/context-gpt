import { Result } from '@context-gpt/errors';
import { ThreadsRepository } from '../ports/threads.repository';
import { ThreadAggregate, ThreadState } from '../domain/thread.aggregate';
import { DomainError, InfrastructureError } from '@context-gpt/server-shared-errors';
import { Inject } from '@nestjs/common';

export interface CreateThreadUseCaseInput {
  userId: string;
}

export interface CreateThreadUseCaseOutput {
  thread: ThreadState;
}

export abstract class CreateThreadUseCase {
  abstract execute(
    input: CreateThreadUseCaseInput,
  ): Promise<Result<CreateThreadUseCaseOutput, DomainError | InfrastructureError>>;
}

export class CreateThreadUseCaseImpl extends CreateThreadUseCase {
  constructor(@Inject(ThreadsRepository) private readonly threadsRepository: ThreadsRepository) {
    super();
  }

  async execute(
    input: CreateThreadUseCaseInput,
  ): Promise<Result<CreateThreadUseCaseOutput, DomainError | InfrastructureError>> {
    const thread = ThreadAggregate.createThread(input.userId);

    const saveResult = await this.threadsRepository.save(thread);
    if (saveResult.type === 'error') {
      return saveResult;
    }

    return {
      type: 'success',
      value: { thread: thread.state },
    };
  }
}
