import { ContextGptSdk } from './context-gpt-sdk';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.e2e' });

const VALID_TOKEN = process.env['API_ACCESS_TOKEN'];

describe('contextGptSdk', () => {
  const sdk = new ContextGptSdk('http://localhost:8000');

  describe('Check Token Endpoint (/check-token)', () => {
    it('should return true for a valid token', async () => {
      if (!VALID_TOKEN) {
        throw new Error('API_ACCESS_TOKEN is not set in the environment variables');
      }

      const result = await sdk.checkToken({ token: VALID_TOKEN });
      expect(result.data).toEqual({ isValid: true });
    });

    it('should return false for an invalid token', async () => {
      const result = await sdk.checkToken({ token: 'invalid_token' });
      expect(result.data).toEqual({ isValid: false });
    });
  });

  describe('Health Endpoint (/health)', () => {
    it('should return OK status', async () => {
      const result = await sdk.healthCheck();
      expect(result.data).toEqual({ status: 'OK' });
    });
  });
});
