import { ThreadAggregate } from './thread.aggregate';
import { DomainError } from '@context-gpt/server-shared-errors';

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

  describe('addUserMessage', () => {
    it('adds a user message and transitions to WaitingForChatbotResponse state', () => {
      const thread = ThreadAggregate.createThread('user123');
      const updatedThread = thread.addUserMessage('Hello, chatbot!');

      expect(updatedThread.state.status).toBe('WaitingForChatbotResponse');
      expect(updatedThread.state.messages).toHaveLength(1);
      expect(updatedThread.state.messages[0]).toEqual({
        sender: 'user',
        content: 'Hello, chatbot!',
      });
    });

    it('throws an error when adding an empty message', () => {
      const thread = ThreadAggregate.createThread('user123');
      expect(() => thread.addUserMessage('')).toThrow(DomainError);
      expect(() => thread.addUserMessage('   ')).toThrow(DomainError);
    });

    it('throws an error when adding a message in the wrong state', () => {
      const thread = ThreadAggregate.createThread('user123');
      const updatedThread = thread.addUserMessage('Hello');
      expect(() => updatedThread.addUserMessage('Another message')).toThrow(DomainError);
    });

    it('trims the message content', () => {
      const thread = ThreadAggregate.createThread('user123');
      const updatedThread = thread.addUserMessage('  Hello, chatbot!  ');
      expect(updatedThread.state.messages[0].content).toBe('Hello, chatbot!');
    });
  });

  describe('addChatbotResponse', () => {
    it('adds a chatbot response and transitions to WaitingForUserMessage state', () => {
      const thread = ThreadAggregate.createThread('user123').addUserMessage('Hello, chatbot!');
      const updatedThread = thread.addChatbotResponse('Hello, human!');

      expect(updatedThread.state.status).toBe('WaitingForUserMessage');
      expect(updatedThread.state.messages).toHaveLength(2);
      expect(updatedThread.state.messages[1]).toEqual({
        sender: 'assistant',
        content: 'Hello, human!',
      });
    });

    it('throws an error when adding an empty response', () => {
      const thread = ThreadAggregate.createThread('user123').addUserMessage('Hello, chatbot!');
      expect(() => thread.addChatbotResponse('')).toThrow(DomainError);
      expect(() => thread.addChatbotResponse('   ')).toThrow(DomainError);
    });

    it('throws an error when adding a response in the wrong state', () => {
      const thread = ThreadAggregate.createThread('user123');
      expect(() => thread.addChatbotResponse('Hello')).toThrow(DomainError);
    });

    it('trims the response content', () => {
      const thread = ThreadAggregate.createThread('user123').addUserMessage('Hello, chatbot!');
      const updatedThread = thread.addChatbotResponse('  Hello, human!  ');
      expect(updatedThread.state.messages[1].content).toBe('Hello, human!');
    });

    it('allows multiple message exchanges', () => {
      const thread = ThreadAggregate.createThread('user123')
        .addUserMessage('Hello, chatbot!')
        .addChatbotResponse('Hello, human!')
        .addUserMessage('How are you?')
        .addChatbotResponse("I'm doing well, thank you!");

      expect(thread.state.messages).toHaveLength(4);
      expect(thread.state.status).toBe('WaitingForUserMessage');
    });
  });
});
