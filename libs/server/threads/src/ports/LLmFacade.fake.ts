import { Chunk, LlmFacade } from './LlmFacade';
import { from, Observable, throwError } from 'rxjs';
import { Message } from '../domain/Message';

export class LlmFacadeFake extends LlmFacade {
  private chunks: Chunk[] = [];

  private error: string | null = null;

  private history: Message[][] = [];

  public setChunks(chunks: Chunk[]) {
    this.chunks = chunks;
  }

  public setChunkContents(contents: string[]) {
    this.chunks = contents.map((content) => ({ content }));
  }

  public setError(err: string) {
    this.error = err;
  }

  public getHistory(): Message[][] {
    return this.history;
  }

  public prompt(args: { messages: Message[] }): Observable<Chunk> {
    this.history.push(args.messages);

    if (this.error) {
      return throwError(() => this.error);
    }

    return from(this.chunks);
  }
}
