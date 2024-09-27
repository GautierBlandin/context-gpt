import { ThreadsRepository } from '../ports/threads.repository';
import { Chunk, LlmFacade } from '../ports/LlmFacade';
import { Inject } from '@nestjs/common';
import { Observable } from 'rxjs';

export interface PostMessageUseCaseInput {
  threadId: string;
  userId: string;
  message: string;
}

export abstract class PostMessageUseCase {
  abstract execute(input: PostMessageUseCaseInput): Observable<Chunk>;
}

export class PostMessageUseCaseImpl extends PostMessageUseCase {
  constructor(
    @Inject(ThreadsRepository) private readonly threadsRepository: ThreadsRepository,
    @Inject(LlmFacade) private readonly llmFacade: LlmFacade,
  ) {
    super();
  }

  execute(input: PostMessageUseCaseInput): Observable<Chunk> {
    return new Observable<Chunk>((observer) => {
      let fullResponse = '';

      (async () => {
        const threadResult = await this.threadsRepository.get(input.threadId);
        if (threadResult.type === 'error') {
          observer.error(threadResult.error);
          return;
        }

        const thread = threadResult.value;
        const addMessageResult = thread.addUserMessage(input.message);
        if (addMessageResult.type === 'error') {
          observer.error(addMessageResult.error);
          return;
        }

        const responseStream = this.llmFacade.prompt({ messages: thread.state.messages });

        responseStream.subscribe({
          next: (chunk) => {
            fullResponse += chunk.content;
            observer.next(chunk);
          },
          error: (error) => observer.error(error),
          complete: async () => {
            const addResponseResult = thread.addChatbotResponse(fullResponse);
            if (addResponseResult.type === 'error') {
              observer.error(addResponseResult.error);
              return;
            }

            const saveResult = await this.threadsRepository.save(thread);
            if (saveResult.type === 'error') {
              observer.error(saveResult.error);
              return;
            }

            observer.complete();
          },
        });
      })();
    });
  }
}
