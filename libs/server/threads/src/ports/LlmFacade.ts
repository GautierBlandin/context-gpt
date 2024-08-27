import { Message } from '../core/Message';
import { Observable } from 'rxjs';

export abstract class LlmFacade {
  abstract prompt(args: { messages: Message[] }): Observable<Chunk>;
}

export interface Chunk {
  content: string;
}
