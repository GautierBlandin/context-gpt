import { AuthSdk } from './auth.sdk';
import { createApiClient } from './test-client';
import { SharedState } from './shared-state';
import { beforeEach, describe, expect, it } from 'vitest';
import { SharedStateMother } from './share-state.mother';

function generateRandomEmail(): string {
  const randomString = Math.random().toString(36).substring(7);
  return `test-${randomString}@example.com`;
}

describe('Auth sdk', () => {
  let authSdk: AuthSdk;
  let sharedState: SharedState;

  beforeEach(() => {
    const testSharedState: SharedState = SharedStateMother.getValidSharedState();
    authSdk = new AuthSdk(createApiClient(), testSharedState);
    sharedState = testSharedState;
  });

  describe('register', () => {
    it('returns 201 Created when registration is successful', async () => {
      const email = generateRandomEmail();
      const password = 'password123';

      const { response } = await authSdk.register({ email, password });
      expect(response.status).toBe(201);
    });
  });

  describe('login', () => {
    it('returns 200 OK with a token when login is successful', async () => {
      // First, register a new user
      const email = generateRandomEmail();
      const password = 'password123';

      const registerResponse = await authSdk.register({ email, password });
      expect(registerResponse.response.status).toBe(201);

      // Now, try to login with the newly registered user
      const { response, data } = await authSdk.login({ email, password });
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('token');
    });
  });

  describe('validate', () => {
    it('returns 200 OK when token is valid', async () => {
      // First, register and login to get a valid token
      const email = generateRandomEmail();
      const password = 'password123';

      await authSdk.register({ email, password });
      const { data: loginData } = await authSdk.login({ email, password });

      if (!loginData) {
        throw new Error('Login failed');
      }
      sharedState.accessToken = loginData.token;

      const { response } = await authSdk.validate();
      expect(response.status).toBe(200);
    });

    it('throws an error when access token is not set', async () => {
      sharedState.accessToken = null;
      await expect(authSdk.validate()).rejects.toThrow('Access token is not set');
    });
  });
});
