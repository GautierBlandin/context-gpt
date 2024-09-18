import type { paths } from '../../api-types/schema';
import { SharedState } from './shared-state';

export enum ChunkType {
  Start = 'start',
  Content = 'content',
  End = 'end',
  Error = 'error',
}

export type Chunk =
  | { type: ChunkType.Start }
  | { type: ChunkType.Content; content: string }
  | { type: ChunkType.End }
  | { type: ChunkType.Error; error: string };

export class ThreadsSdk {
  constructor(private readonly sharedState: SharedState) {}

  public async *postMessage({
    messages,
  }: paths['/threads/{id}/messages']['post']['requestBody']['content']['application/json']): AsyncGenerator<
    Chunk,
    void,
    unknown
  > {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.sharedState.accessToken) {
      headers['Authorization'] = `Bearer ${this.sharedState.accessToken}`;
    }

    const response = await fetch(`${this.sharedState.baseUrl}/threads/1/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      yield { type: ChunkType.Error, error: `HTTP error! status: ${response.status}` };
      return;
    }

    if (!response.body) {
      yield { type: ChunkType.Error, error: 'Response body is null' };
      return;
    }

    yield { type: ChunkType.Start };

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              yield { type: ChunkType.End };
            } else {
              try {
                const parsedData = JSON.parse(data);
                if (parsedData.content) {
                  yield { type: ChunkType.Content, content: parsedData.content };
                }
              } catch (e) {
                yield { type: ChunkType.Error, error: `Error parsing SSE data: ${e}` };
              }
            }
          }
        }
      }
    } catch (error) {
      yield { type: ChunkType.Error, error: `Stream reading error: ${error}` };
    }
  }
}
