import type { paths } from '../../api-types/schema';
import createClient, { Client } from 'openapi-fetch';

export class ContextGptSdk {
  constructor(baseUrl: string) {
    this.client = createClient<paths>({ baseUrl });
  }

  private client: Client<paths>;

  public async checkToken({ token }: paths['/api/check-token']['post']['requestBody']['content']['application/json']) {
    return this.client.POST('/api/check-token', { body: { token } });
  }

  public async healthCheck() {
    return this.client.GET('/api/health');
  }
}
