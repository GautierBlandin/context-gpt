import { Client } from 'openapi-fetch';
import type { paths } from '../../api-types/schema';
import { SharedState } from './shared-state';

export class AuthSdk {
  constructor(
    private readonly client: Client<paths>,
    private readonly sharedState: SharedState,
  ) {}

  public async login({ token }: { token: string }) {
    return this.client.POST('/auth/login', {
      body: { token },
    });
  }

  public async validate() {
    if (!this.sharedState.accessToken) {
      throw new Error('Access token is not set. Use setAccessToken() to set the access token.');
    }

    return this.client.GET('/auth/validate', {
      params: {
        header: { Authorization: `Bearer ${this.sharedState.accessToken}` },
      },
    });
  }
}
