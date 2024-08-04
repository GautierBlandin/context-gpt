import * as dotenv from 'dotenv';
import { makeRequest } from '../support/makeRequest';

dotenv.config({ path: '.env.e2e' });

const VALID_TOKEN = process.env.API_ACCESS_TOKEN;

describe('API End-to-End Tests', () => {
  describe('Health Endpoint (/health)', () => {
    it('should return OK status', async () => {
      const result = await makeRequest({ endpoint: '/health' });
      expect(result).toEqual({ status: 'OK' });
    });
  });

  describe('Claude Endpoint (/claude)', () => {
    it('should return the expected response when given valid input', async () => {
      const messages = [
        {
          sender: 'User',
          content:
            'The following message is a part of an end-to-end test to integrate you with our chatbot. If you understand this message, please response exactly with the following text: "I understand, and my API is healthy!"',
        },
      ];
      const response = await makeRequest({
        endpoint: '/claude',
        method: 'POST',
        data: { messages },
        isSSE: true,
      });

      expect(response).toBeDefined();
      expect(response).toEqual('I understand, and my API is healthy!');
    });
  });

  describe('Check Token Endpoint (/check-token)', () => {
    it('should return true for a valid token', async () => {
      const result = await makeRequest({
        endpoint: '/check-token',
        method: 'POST',
        data: { token: VALID_TOKEN },
      });
      expect(result).toEqual({ isValid: true });
    });

    it('should return false for an invalid token', async () => {
      const result = await makeRequest({
        endpoint: '/check-token',
        method: 'POST',
        data: { token: 'invalid_token' },
      });
      expect(result).toEqual({ isValid: false });
    });
  });
});
