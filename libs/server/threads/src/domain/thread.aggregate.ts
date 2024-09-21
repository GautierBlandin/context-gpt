import { v4 as uuidv4 } from 'uuid';

interface ThreadState {
  id: string;
  createdAt: Date;
  status: 'WaitingForUserMessage';
}

export class ThreadAggregate {
  private constructor(public readonly state: ThreadState) {}

  static createThread(): ThreadAggregate {
    const state: ThreadState = {
      id: uuidv4(),
      createdAt: new Date(),
      status: 'WaitingForUserMessage',
    };
    return new ThreadAggregate(state);
  }

  static from(state: ThreadState): ThreadAggregate {
    return new ThreadAggregate(state);
  }
}
