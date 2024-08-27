import { config } from 'dotenv';
import { join } from 'path';
import { ProcessEnv } from './env.process';

describe('Environment service', () => {
  beforeAll(() => {
    // Load the env-test file
    config({ path: join(__dirname, 'env-test') });
  });

  it('returns the associated environment variable', () => {
    const env = new ProcessEnv(); // Or however you instantiate your Environment service

    // Test the MY_ENV_VARIABLE
    expect(env.get('MY_ENV_VARIABLE')).toBe('test');
  });
});
