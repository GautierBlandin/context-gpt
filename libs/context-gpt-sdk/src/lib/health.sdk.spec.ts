import { HealthSdk } from './health.sdk';
import { createApiClient } from './test-client';

describe('Health SDK', () => {
  let healthSdk: HealthSdk;

  beforeEach(() => {
    healthSdk = new HealthSdk(createApiClient());
  });

  it('returns 200 OK', async () => {
    const { response } = await healthSdk.check();

    expect(response.status).toBe(200);
  });
});
