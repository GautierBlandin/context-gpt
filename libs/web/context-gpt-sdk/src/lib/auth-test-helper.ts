import { AuthSdk } from './auth.sdk';
import { createApiClient } from './test-client';
import { SharedState } from './shared-state';
import { SharedStateMother } from './share-state.mother';

function generateRandomEmail(): string {
  const randomString = Math.random().toString(36).substring(7);
  return `test-${randomString}@example.com`;
}

export async function getValidAuthorizationToken(): Promise<string> {
  const sharedState: SharedState = SharedStateMother.getValidSharedState();
  const authSdk = new AuthSdk(createApiClient(), sharedState);

  const email = generateRandomEmail();
  const password = 'testPassword123';

  // Register a new user
  const registerResponse = await authSdk.register({ email, password });
  if (registerResponse.response.status !== 201) {
    throw new Error('Failed to register user');
  }

  // Login with the newly registered user
  const loginResponse = await authSdk.login({ email, password });
  if (loginResponse.response.status !== 200 || !loginResponse.data) {
    throw new Error('Failed to login');
  }

  return loginResponse.data.token;
}
