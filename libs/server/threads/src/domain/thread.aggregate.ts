import { v4 as uuidv4 } from 'uuid';
import { Message } from './Message';

export interface ThreadState {
  id: string;
  createdAt: Date;
  status: 'WaitingForUserMessage';
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
}
