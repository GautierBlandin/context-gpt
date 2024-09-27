import { InvalidUserIdError, ThreadAggregate } from './thread.aggregate';
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
      const result = thread.addUserMessage(validAddUserMessageInput());

      expect(result.type).toBe('success');
      expect(result.value?.state.status).toBe('WaitingForChatbotResponse');
      expect(result.value?.state.messages).toHaveLength(1);
      expect(result.value?.state.messages[0]).toEqual({
        sender: 'user',
        content: 'Hello, chatbot!',
      });
    });

    it('returns an error when adding an empty message', () => {
      const thread = ThreadAggregate.createThread('user123');
      const result1 = thread.addUserMessage(validAddUserMessageInput().withContent(''));
      const result2 = thread.addUserMessage(validAddUserMessageInput().withContent('   '));

      expect(result1.type).toBe('error');
      expect(result2.type).toBe('error');
      expect(result1.error).toBeInstanceOf(DomainError);
      expect(result2.error).toBeInstanceOf(DomainError);
    });

    it('returns an error when adding a message from a different user', () => {
      const thread = ThreadAggregate.createThread('user123');
      const result1 = thread.addUserMessage(validAddUserMessageInput().withUserId('user456'));

      expect(result1.type).toBe('error');
      expect(result1.error).toBeInstanceOf(InvalidUserIdError);
    });

    it('returns an error when adding a message in the wrong state', () => {
      const thread = ThreadAggregate.createThread('user123');
      const result1 = thread.addUserMessage(validAddUserMessageInput());
      const result2 = result1.value?.addUserMessage(validAddUserMessageInput().withContent('Another message'));

      expect(result1.type).toBe('success');
      expect(result2?.type).toBe('error');
      expect(result2?.error).toBeInstanceOf(DomainError);
    });

    it('trims the message content', () => {
      const thread = ThreadAggregate.createThread('user123');
      const result = thread.addUserMessage(validAddUserMessageInput().withContent('  Hello, chatbot!  '));

      expect(result.type).toBe('success');
      expect(result.value?.state.messages[0].content).toBe('Hello, chatbot!');
    });
  });

  describe('addChatbotResponse', () => {
    it('adds a chatbot response and transitions to WaitingForUserMessage state', () => {
      const thread = ThreadAggregate.createThread('user123');
      const result = thread.addUserMessage(validAddUserMessageInput()).value?.addChatbotResponse('Hello, human!');

      expect(result?.type).toBe('success');
      expect(result?.value?.state.status).toBe('WaitingForUserMessage');
      expect(result?.value?.state.messages).toHaveLength(2);
      expect(result?.value?.state.messages[1]).toEqual({
        sender: 'assistant',
        content: 'Hello, human!',
      });
    });

    it('returns an error when adding an empty response', () => {
      const thread = ThreadAggregate.createThread('user123');
      const result1 = thread.addUserMessage(validAddUserMessageInput()).value?.addChatbotResponse('');

      expect(result1?.type).toBe('error');
      expect(result1?.error).toBeInstanceOf(DomainError);
    });

    it('returns an error when adding a space-only response', () => {
      const thread = ThreadAggregate.createThread('user123');
      const result1 = thread.addUserMessage(validAddUserMessageInput()).value?.addChatbotResponse('    ');

      expect(result1?.type).toBe('error');
      expect(result1?.error).toBeInstanceOf(DomainError);
    });

    it('returns an error when adding a response in the wrong state', () => {
      const thread = ThreadAggregate.createThread('user123');
      const result = thread.addChatbotResponse('Hello, human!');

      expect(result.type).toBe('error');
      expect(result.error).toBeInstanceOf(DomainError);
    });

    it('trims the response content', () => {
      const thread = ThreadAggregate.createThread('user123');
      const result = thread.addUserMessage(validAddUserMessageInput()).value?.addChatbotResponse('  Hello, human!  ');

      expect(result?.type).toBe('success');
      expect(result?.value?.state.messages[1].content).toBe('Hello, human!');
    });
  });

  it('allows multiple message exchanges', () => {
    const thread = ThreadAggregate.createThread('user123');
    const result = thread
      .addUserMessage(validAddUserMessageInput().withContent('Hello, chatbot!'))
      .value?.addChatbotResponse('Hello, human!')
      .value?.addUserMessage(validAddUserMessageInput().withContent('How are you?'))
      .value?.addChatbotResponse("I'm doing well, thank you!");

    expect(result?.type).toBe('success');
    expect(result?.value?.state.messages).toHaveLength(4);
    expect(result?.value?.state.status).toBe('WaitingForUserMessage');
  });
});

function validAddUserMessageInput() {
  return {
    content: 'Hello, chatbot!',
    userId: 'user123',
    withContent(content: string) {
      this.content = content;
      return this;
    },
    withUserId(userId: string) {
      this.userId = userId;
      return this;
    },
  };
}
