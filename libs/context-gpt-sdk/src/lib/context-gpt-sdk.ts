import type { paths } from '../../api-types/schema';
import createClient, { Client } from 'openapi-fetch';

export class ContextGptSdk {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.client = createClient<paths>({ baseUrl });
    this.baseUrl = baseUrl;
  }

  private client: Client<paths>;

  public async checkToken({ token }: paths['/api/check-token']['post']['requestBody']['content']['application/json']) {
    return this.client.POST('/api/check-token', { body: { token } });
  }

  public async healthCheck() {
    return this.client.GET('/api/health');
  }

  public async promptClaude({
    messages,
  }: paths['/api/claude']['post']['requestBody']['content']['application/json']): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch(`${this.baseUrl}/api/claude`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    return response.body;
  }
}
