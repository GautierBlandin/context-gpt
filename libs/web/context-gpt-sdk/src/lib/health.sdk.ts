import { Client } from 'openapi-fetch';
import type { paths } from '../../api-types/schema';

export class HealthSdk {
  constructor(private readonly client: Client<paths>) {}

  public async check() {
    return await this.client.GET('/health');
  }
}
