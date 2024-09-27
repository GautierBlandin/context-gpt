import { PrismaService } from './prisma/prisma.service';
import { PrismaThreadsRepository } from './threads.repository.prisma';
import { ThreadAggregate } from '../domain/thread.aggregate';
import { InfrastructureError } from '@context-gpt/server-shared-errors';
import { ThreadNotFoundError } from '../ports/threads.repository';

describe('PrismaThreadsRepository', () => {
  let prismaService: PrismaService;
  let repository: PrismaThreadsRepository;

  beforeEach(async () => {
    prismaService = new PrismaService({
      datasourceUrl: process.env['TEST_DATABASE_URL_THREADS'],
    });
    repository = new PrismaThreadsRepository(prismaService);

    await prismaService.thread.deleteMany();
  });

  afterEach(async () => {
    await prismaService.$disconnect();
  });

  describe('save', () => {
    it('saves a new thread', async () => {
      const thread = ThreadAggregate.createThread('user123');

      const result = await repository.save(thread);

      expect(result.type).toBe('success');

      const { error, value: savedThread } = await repository.get(thread.state.id);

      if (error) {
        throw new Error('Error getting thread in test');
      }

      expect(savedThread).toBeDefined();
      expect(savedThread.state.id).toBe(thread.state.id);
      expect(savedThread.state.createdBy).toBe('user123');
      expect(savedThread.state.status).toBe('WaitingForUserMessage');
      expect(savedThread.state.messages).toEqual([]);
    });

    it('handles save errors', async () => {
      jest.spyOn(prismaService, '$transaction').mockRejectedValueOnce(new Error('Database error'));

      const thread = ThreadAggregate.createThread('user123');
      const result = await repository.save(thread);

      expect(result.type).toBe('error');
      expect(result.error).toBeInstanceOf(InfrastructureError);
    });
  });

  describe('get', () => {
    it('retrieves an existing thread', async () => {
      const thread = ThreadAggregate.createThread('user123');
      await repository.save(thread);

      const result = await repository.get(thread.state.id);

      expect(result.type).toBe('success');
      expect(result.value?.state.id).toBe(thread.state.id);
      expect(result.value?.state.createdBy).toBe('user123');
    });

    it('returns error for non-existent thread', async () => {
      const result = await repository.get('non-existent-id');

      expect(result.type).toBe('error');
      expect(result.error).toBeInstanceOf(ThreadNotFoundError);
    });

    it('handles infrastructure errors', async () => {
      jest.spyOn(prismaService.thread, 'findUnique').mockRejectedValueOnce(new Error('Database error'));

      const result = await repository.get('some-id');

      expect(result.type).toBe('error');
      expect(result.error).toBeInstanceOf(InfrastructureError);
    });
  });

  describe('listForUser', () => {
    it('lists threads for a user', async () => {
      const thread1 = ThreadAggregate.createThread('user123');
      const thread2 = ThreadAggregate.createThread('user123');
      await repository.save(thread1);
      await repository.save(thread2);

      const result = await repository.listForUser('user123');

      expect(result.type).toBe('success');
      expect(result.value?.length).toBe(2);
      expect(result.value?.[0].state.createdBy).toBe('user123');
      expect(result.value?.[1].state.createdBy).toBe('user123');
    });

    it('returns an empty array when no threads exist for user', async () => {
      const result = await repository.listForUser('user456');

      expect(result.type).toBe('success');
      expect(result.value).toEqual([]);
    });

    it('handles list errors', async () => {
      jest.spyOn(prismaService.thread, 'findMany').mockRejectedValueOnce(new Error('Database error'));

      const result = await repository.listForUser('user123');

      expect(result.type).toBe('error');
      expect(result.error).toBeInstanceOf(InfrastructureError);
    });
  });
});
