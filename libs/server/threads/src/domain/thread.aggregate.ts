import { v4 as uuidv4 } from 'uuid';
import { Message } from './Message';
import { DomainError } from '@context-gpt/server-shared-errors';

export interface ThreadState {
  id: string;
  createdAt: Date;
  status: 'WaitingForUserMessage' | 'WaitingForChatbotResponse';
  createdBy: string;
  messages: Message[];
}

export class ThreadAggregate {
  private constructor(public readonly state: ThreadState) {}

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

  addUserMessage(content: string): ThreadAggregate {
    if (!content || content.trim().length === 0) {
      throw new DomainError('User message content cannot be empty');
    }

    if (this.state.status !== 'WaitingForUserMessage') {
      throw new DomainError('Cannot add user message when not waiting for user input');
    }

    const newMessage: Message = {
      sender: 'user',
      content: content.trim(),
    };

    const newState: ThreadState = {
      ...this.state,
      status: 'WaitingForChatbotResponse',
      messages: [...this.state.messages, newMessage],
    };

    return new ThreadAggregate(newState);
  }

  addChatbotResponse(content: string): ThreadAggregate {
    if (!content || content.trim().length === 0) {
      throw new DomainError('Chatbot response content cannot be empty');
    }

    if (this.state.status !== 'WaitingForChatbotResponse') {
      throw new DomainError('Cannot add chatbot response when not waiting for it');
    }

    const newMessage: Message = {
      sender: 'assistant',
      content: content.trim(),
    };

    const newState: ThreadState = {
      ...this.state,
      status: 'WaitingForUserMessage',
      messages: [...this.state.messages, newMessage],
    };

    return new ThreadAggregate(newState);
  }
}
