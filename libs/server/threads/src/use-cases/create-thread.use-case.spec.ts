import { CreateThreadUseCase, CreateThreadUseCaseImpl } from './create-thread.use-case';
import { ThreadsRepositoryFake } from '../ports/threads.repository.fake';
import { err } from '@context-gpt/errors';
import { InfrastructureError } from '@context-gpt/server-shared-errors';

describe('CreateThreadUseCase', () => {
  let useCase: CreateThreadUseCase;
  let threadsRepository: ThreadsRepositoryFake;

  beforeEach(() => {
    threadsRepository = new ThreadsRepositoryFake();
    useCase = new CreateThreadUseCaseImpl(threadsRepository);
  });

  it('creates a thread successfully', async () => {
    const result = await useCase.execute({ userId: 'user-123' });

    expect(result.type).toBe('success');
    if (result.type !== 'success') {
      throw new Error('Unexpected result type');
    }
    expect(result.value.threadId).toBeDefined();
    expect(typeof result.value.threadId).toBe('string');

    // Check that the thread was saved in the repository
    const savedThread = await threadsRepository.get(result.value.threadId);
    expect(savedThread.type).toBe('success');
    if (savedThread.type === 'success') {
      expect(savedThread.value.state.createdBy).toBe('user-123');
    }
  });

  it('handles repository errors', async () => {
    const error = new InfrastructureError('Database connection failed');
    threadsRepository.save = jest.fn().mockResolvedValue(err(error));

    const result = await useCase.execute({ userId: 'user-123' });

    expect(result.type).toBe('error');
    if (result.type === 'error') {
      expect(result.error).toBe(error);
    }
  });
});
