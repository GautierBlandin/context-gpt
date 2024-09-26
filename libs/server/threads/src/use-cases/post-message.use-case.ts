import { err, Result, success } from '@context-gpt/errors';
import { ThreadsRepository } from '../ports/threads.repository';
import { Chunk, LlmFacade } from '../ports/LlmFacade';
import { DomainError, InfrastructureError } from '@context-gpt/server-shared-errors';
import { Inject } from '@nestjs/common';
import { Observable } from 'rxjs';

export interface PostMessageUseCaseInput {
  threadId: string;
  userId: string;
  message: string;
}

export interface PostMessageUseCaseOutput {
  responseStream: Observable<Chunk>;
}

export abstract class PostMessageUseCase {
  abstract execute(
    input: PostMessageUseCaseInput,
  ): Promise<Result<PostMessageUseCaseOutput, DomainError | InfrastructureError>>;
}

export class PostMessageUseCaseImpl extends PostMessageUseCase {
  constructor(
    @Inject(ThreadsRepository) private readonly threadsRepository: ThreadsRepository,
    @Inject(LlmFacade) private readonly llmFacade: LlmFacade,
  ) {
    super();
  }

  async execute(
    input: PostMessageUseCaseInput,
  ): Promise<Result<PostMessageUseCaseOutput, DomainError | InfrastructureError>> {
    const threadResult = await this.threadsRepository.get(input.threadId);

    if (threadResult.type === 'error') {
      return threadResult;
    }

    const thread = threadResult.value;

    try {
      thread.addUserMessage(input.message);
    } catch (error) {
      if (error instanceof DomainError) {
        return err(error);
      }
      return err(new InfrastructureError('Unexpected error adding user message'));
    }
    const responseStream = this.llmFacade.prompt({ messages: thread.state.messages });

    const managedResponseStream = new Observable<Chunk>((observer) => {
      let fullResponse = '';

      responseStream.subscribe({
        next: (chunk) => {
          fullResponse += chunk.content;
          observer.next(chunk);
        },
        error: (error) => observer.error(error),
        complete: async () => {
          thread.addChatbotResponse(fullResponse);
          const saveResult = await this.threadsRepository.save(thread);
          if (saveResult.type === 'error') {
            observer.error(saveResult.error);
          } else {
            observer.complete();
          }
        },
      });
    });

    return success({ responseStream: managedResponseStream });
  }
}
