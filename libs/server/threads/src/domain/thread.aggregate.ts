import { v4 as uuidv4 } from 'uuid';

interface ThreadState {
  id: string;
  createdAt: Date;
  status: 'WaitingForUserMessage';
  createdBy: string;
}

export class ThreadAggregate {
  private constructor(public readonly state: ThreadState) {}

  static createThread(userId: string): ThreadAggregate {
    const state: ThreadState = {
      id: uuidv4(),
      createdAt: new Date(),
      status: 'WaitingForUserMessage',
      createdBy: userId,
    };
    return new ThreadAggregate(state);
  }

  static from(state: ThreadState): ThreadAggregate {
    return new ThreadAggregate(state);
  }
}
