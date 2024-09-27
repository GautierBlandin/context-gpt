import { v4 as uuidv4 } from 'uuid';
import { Message } from './Message';
import { DomainError } from '@context-gpt/server-shared-errors';
import { err, Result, success } from '@context-gpt/errors';

export interface ThreadState {
  id: string;
  createdAt: Date;
  status: 'WaitingForUserMessage' | 'WaitingForChatbotResponse';
  createdBy: string;
  messages: Message[];
}

export class ThreadAggregate {
  private constructor(public state: ThreadState) {}

  static createThread(userId: string): ThreadAggregate {
    const state: ThreadState = {
      id: uuidv4(),
      createdAt: new Date(),
      status: 'WaitingForUserMessage',
      createdBy: userId,
      messages: [],
    };
    return new ThreadAggregate(state);
  }

  static from(state: ThreadState): ThreadAggregate {
    return new ThreadAggregate(state);
  }

  addUserMessage({
    content,
    userId,
  }: {
    content: string;
    userId: string;
  }): Result<ThreadAggregate, InvalidUserIdError | InvalidStateError | BadUserMessageError> {
    if (userId !== this.state.createdBy) {
      return err(new InvalidUserIdError('User ID does not match thread creator'));
    }

    if (!content || content.trim().length === 0) {
      return err(new BadUserMessageError('User message content cannot be empty'));
    }

    if (this.state.status !== 'WaitingForUserMessage') {
      return err(new InvalidStateError('Cannot add user message when not waiting for user input'));
    }

    const newMessage: Message = {
      sender: 'user',
      content: content.trim(),
    };

    this.state = {
      ...this.state,
      status: 'WaitingForChatbotResponse',
      messages: [...this.state.messages, newMessage],
    };
    return success(this);
  }

  addChatbotResponse(content: string): Result<ThreadAggregate, DomainError> {
    if (!content || content.trim().length === 0) {
      return err(new BadLlmResponseError());
    }

    if (this.state.status !== 'WaitingForChatbotResponse') {
      return err(new DomainError('Cannot add chatbot response when not waiting for it'));
    }

    const newMessage: Message = {
      sender: 'assistant',
      content: content.trim(),
    };

    this.state = {
      ...this.state,
      status: 'WaitingForUserMessage',
      messages: [...this.state.messages, newMessage],
    };

    return success(this);
  }
}

export class BadLlmResponseError extends DomainError {
  constructor() {
    super('LLM response is invalid');
    this.name = 'BadLlmResponseError';
  }
}

export class BadUserMessageError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'BadUserResponseError';
  }
}

export class InvalidUserIdError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUserIdError';
  }
}

export class InvalidStateError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidStateError';
  }
}
