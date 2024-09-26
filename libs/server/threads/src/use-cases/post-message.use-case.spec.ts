import { PostMessageUseCase, PostMessageUseCaseImpl } from './post-message.use-case';
import { ThreadsRepositoryFake } from '../ports/threads.repository.fake';
import { LlmFacadeFake } from '../ports/LLmFacade.fake';
import { ThreadAggregate } from '../domain/thread.aggregate';
import { DomainError } from '@context-gpt/server-shared-errors';
import { lastValueFrom, tap } from 'rxjs';

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

    const result = await useCase.execute({
      threadId: thread.state.id,
      userId: 'user-123',
      message: 'Hello, AI!',
    });

    expect(result.type).toBe('success');
    if (result.type !== 'success') throw new Error('Unexpected result type');

    const responseChunks: string[] = [];
    await lastValueFrom(result.value.responseStream.pipe(tap((chunk) => responseChunks.push(chunk.content))));

    expect(responseChunks.join('')).toBe('Hello, how can I help you?');

    const updatedThread = await threadsRepository.get(thread.state.id);
    expect(updatedThread.type).toBe('success');
    if (updatedThread.type !== 'success') throw new Error('Unexpected result type');

    expect(updatedThread.value.state.messages).toHaveLength(2);
    expect(updatedThread.value.state.messages[0]).toEqual({
      sender: 'user',
      content: 'Hello, AI!',
    });
    expect(updatedThread.value.state.messages[1]).toEqual({
      sender: 'assistant',
      content: 'Hello, how can I help you?',
    });
  });

  it('handles thread not found error', async () => {
    const result = await useCase.execute({
      threadId: 'non-existent-id',
      userId: 'user-123',
      message: 'Hello, AI!',
    });

    expect(result.type).toBe('error');
    if (result.type !== 'error') throw new Error('Unexpected result type');
    expect(result.error).toBeInstanceOf(DomainError);
  });

  it('handles LLM error', async () => {
    const thread = ThreadAggregate.createThread('user-123');
    await threadsRepository.save(thread);

    llmFacade.setError('LLM failed');

    const result = await useCase.execute({
      threadId: thread.state.id,
      userId: 'user-123',
      message: 'Hello, AI!',
    });

    expect(result.type).toBe('success');
    if (result.type !== 'success') throw new Error('Unexpected result type');

    try {
      await lastValueFrom(result.value.responseStream);
    } catch (error) {
      expect(error).toBe('LLM failed');
    }
  });
});
