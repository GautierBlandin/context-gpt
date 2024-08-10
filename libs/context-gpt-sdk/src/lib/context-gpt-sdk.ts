import type { paths } from '../../api-types/schema';
import createClient, { Client } from 'openapi-fetch';

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

export class ContextGptSdk {
  private readonly baseUrl: string;
  private accessToken: string | null = null;
  private client: Client<paths>;

  constructor(baseUrl: string) {
    this.client = createClient<paths>({ baseUrl });
    this.baseUrl = baseUrl;
  }

  public setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  public async checkToken({ token }: paths['/api/check-token']['post']['requestBody']['content']['application/json']) {
    return this.client.POST('/api/check-token', { body: { token } });
  }

  public async healthCheck() {
    return this.client.GET('/api/health');
  }

  public async *promptClaude({
    messages,
  }: paths['/api/claude']['post']['requestBody']['content']['application/json']): AsyncGenerator<Chunk, void, unknown> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}/api/claude`, {
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
