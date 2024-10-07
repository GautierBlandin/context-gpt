import { Message } from './Message';

export interface Thread {
  id: string;
  messages: Message[];
}

export function createThread(id: string): Thread {
  return { id, messages: [] };
}
