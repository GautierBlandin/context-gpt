import type { paths } from '../../api-types/schema';
import createClient, { Client } from 'openapi-fetch';
import { SharedState } from './shared-state';
import { AuthSdk } from './auth.sdk';
import { ThreadsSdk } from './threads.sdk';
import { HealthSdk } from './health.sdk';

export interface ConstructorOptions {
  baseUrl: string;
}

export class ContextGptSdk {
  private readonly sharedState: SharedState;
  private readonly client: Client<paths>;

  public auth: AuthSdk;
  public threads: ThreadsSdk;
  public health: HealthSdk;

  constructor({ baseUrl }: ConstructorOptions) {
    this.sharedState = {
      accessToken: null,
      baseUrl,
    };
    this.client = createClient<paths>({ baseUrl });
    this.auth = new AuthSdk(this.client, this.sharedState);
    this.threads = new ThreadsSdk(this.sharedState);
    this.health = new HealthSdk(this.client);
  }

  public setAccessToken(token: string) {
    this.sharedState.accessToken = token;
  }
}
