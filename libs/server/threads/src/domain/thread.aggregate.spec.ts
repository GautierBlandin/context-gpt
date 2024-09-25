import { ThreadAggregate } from './thread.aggregate';

describe('ThreadAggregate', () => {
  describe('createThread', () => {
    it('creates a new thread with a valid ID, initial state, and createdBy field', () => {
      const userId = 'user123';
      const thread = ThreadAggregate.createThread(userId);

      expect(thread.state.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
      expect(thread.state.createdAt).toBeInstanceOf(Date);
      expect(thread.state.status).toBe('WaitingForUserMessage');
      expect(thread.state.createdBy).toBe(userId);
    });
  });

  describe('from', () => {
    it('reconstructs a thread from its state', () => {
      const state = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        status: 'WaitingForUserMessage' as const,
        createdBy: 'user456',
        messages: [],
      };

      const thread = ThreadAggregate.from(state);

      expect(thread.state).toEqual(state);
    });
  });
});
