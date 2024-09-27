import { PostMessageUseCase, PostMessageUseCaseImpl } from './post-message.use-case';
import { ThreadsRepositoryFake } from '../ports/threads.repository.fake';
import { LlmFacadeFake } from '../ports/LLmFacade.fake';
import { BadLlmResponseError, BadUserMessageError, ThreadAggregate } from '../domain/thread.aggregate';
import { InfrastructureError } from '@context-gpt/server-shared-errors';
import { lastValueFrom, Observable, toArray } from 'rxjs';
import { ThreadNotFoundError } from '../ports/threads.repository';

describe('PostMessageUseCase', () => {
  let useCase: PostMessageUseCase;
  let threadsRepository: ThreadsRepositoryFake;
  let llmFacade: LlmFacadeFake;

  beforeEach(() => {
    threadsRepository = new ThreadsRepositoryFake();
    llmFacade = new LlmFacadeFake();
    useCase = new PostMessageUseCaseImpl(threadsRepository, llmFacade);
  });

  it('posts a message successfully', async () => {
    const thread = ThreadAggregate.createThread('user-123');
    await threadsRepository.save(thread);

    llmFacade.setChunkContents(['Hello', ', how', ' can I help', ' you?']);

    const response = await lastValueFrom(
      useCase
        .execute({
          threadId: thread.state.id,
          userId: 'user-123',
          message: 'Hello, AI!',
        })
        .pipe(toArray()),
    );

    expect(response.map((chunk) => chunk.content).join('')).toBe('Hello, how can I help you?');

    const updatedThread = await threadsRepository.get(thread.state.id);
    expect(updatedThread.type).toBe('success');
    if (updatedThread.type === 'success') {
      expect(updatedThread.value.state.messages).toHaveLength(2);
      expect(updatedThread.value.state.messages[0]).toEqual({
        sender: 'user',
        content: 'Hello, AI!',
      });
      expect(updatedThread.value.state.messages[1]).toEqual({
        sender: 'assistant',
        content: 'Hello, how can I help you?',
      });
    }
  });

  it('handles the user message being invalid', async () => {
    const thread = ThreadAggregate.createThread('user-123');
    await threadsRepository.save(thread);

    expect(
      await catchObservableError(
        useCase.execute({
          threadId: thread.state.id,
          userId: 'user-123',
          message: '',
        }),
      ),
    ).toBeInstanceOf(BadUserMessageError);
  });

  it('handles thread not found error', async () => {
    const thread = ThreadAggregate.createThread('user-123');

    expect(
      await catchObservableError(
        useCase.execute({
          threadId: thread.state.id,
          userId: 'user-123',
          message: 'Hello, AI!',
        }),
      ),
    ).toBeInstanceOf(ThreadNotFoundError);
  });

  it('handles LLM error', async () => {
    const thread = ThreadAggregate.createThread('user-123');
    await threadsRepository.save(thread);

    llmFacade.setError('LLM failed');

    expect(
      await catchObservableError(
        useCase.execute({
          threadId: thread.state.id,
          userId: 'user-123',
          message: 'Hello, AI!',
        }),
      ),
    ).toBe('LLM failed');
  });

  it('rejects an invalid LLM response', async () => {
    const thread = ThreadAggregate.createThread('user-123');
    await threadsRepository.save(thread);

    llmFacade.setChunkContents(['']);

    expect(
      await catchObservableError(
        useCase.execute({
          threadId: thread.state.id,
          userId: 'user-123',
          message: 'Hello, AI!',
        }),
      ),
    ).toBeInstanceOf(BadLlmResponseError);
  });

  it('handles repository error', async () => {
    const thread = ThreadAggregate.createThread('user-123');
    await threadsRepository.save(thread);

    llmFacade.setChunkContents(['Hello', ', how', ' can I help', ' you?']);

    jest.spyOn(threadsRepository, 'save').mockResolvedValue({
      type: 'error',
      error: new InfrastructureError('Repository error'),
    });

    expect(
      await catchObservableError(
        useCase.execute({
          threadId: thread.state.id,
          userId: 'user-123',
          message: 'Hello, AI!',
        }),
      ),
    ).toBeInstanceOf(InfrastructureError);
  });
});

async function catchObservableError(observable: Observable<unknown>): Promise<unknown> {
  try {
    await lastValueFrom(observable);
  } catch (error) {
    return error;
  }

  throw new Error('Expected error to be thrown');
}
