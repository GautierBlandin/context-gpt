import { AuthSdk } from './auth.sdk';
import { createApiClient } from './test-client';
import { SharedState } from './shared-state';
import { expect, it } from 'vitest';

describe('Auth sdk', () => {
  let authSdk: AuthSdk;
  let sharedState: SharedState;

  beforeEach(() => {
    const testSharedState: SharedState = { accessToken: null };
    authSdk = new AuthSdk(createApiClient(), testSharedState);

    sharedState = testSharedState;
  });

  describe('login', () => {
    it('returns 200 OK with a token when login is successful', async () => {
      const token = getValidToken();

      const { response, data } = await authSdk.login({ token: token });

      expect(response.status).toBe(200);
      expect(data).toEqual({ access_token: token });
    });
  });

  describe('validate', () => {
    it('returns 200 OK when token is valid', async () => {
      sharedState.accessToken = getValidToken();

      const { response, data } = await authSdk.validate();

      expect(response.status).toBe(200);
      expect(data).toEqual({ is_valid: true });
    });

    it('should return false for an invalid token', async () => {
      sharedState.accessToken = 'invalid_token';

      const result = await authSdk.validate();
      expect(result.response.status).toBe(200);
      expect(result.data).toEqual({ is_valid: false });
    });
  });
});

function getValidToken() {
  const VALID_TOKEN = import.meta.env['API_ACCESS_TOKEN'];

  if (!VALID_TOKEN) {
    throw new Error('API_ACCESS_TOKEN is not set in the environment variables');
  }

  return VALID_TOKEN;
}
