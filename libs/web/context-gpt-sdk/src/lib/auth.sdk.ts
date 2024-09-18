import { Client } from 'openapi-fetch';
import type { paths } from '../../api-types/schema';
import { SharedState } from './shared-state';

export class AuthSdk {
  constructor(
    private readonly client: Client<paths>,
    private readonly sharedState: SharedState,
  ) {}

  public async register({ email, password }: { email: string; password: string }) {
    return this.client.POST('/auth/register', {
      body: { email, password },
    });
  }

  public async login({ email, password }: { email: string; password: string }) {
    return this.client.POST('/auth/login', {
      body: { email, password },
    });
  }

  public async validate() {
    if (!this.sharedState.accessToken) {
      throw new Error('Access token is not set. Use setAccessToken() to set the access token.');
    }

    return this.client.GET('/auth/validate', {
      params: {
        header: { authorization: `Bearer ${this.sharedState.accessToken}` },
      },
    });
  }
}
