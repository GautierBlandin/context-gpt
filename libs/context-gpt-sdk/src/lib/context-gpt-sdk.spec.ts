import { ChunkType, ContextGptSdk } from './context-gpt-sdk';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.e2e' });

const VALID_TOKEN = process.env['API_ACCESS_TOKEN'];

if (!VALID_TOKEN) {
  throw new Error('API_ACCESS_TOKEN is not set in the environment variables');
}

describe('contextGptSdk', () => {
  describe('Check Token Endpoint (/check-token)', () => {
    it('should return true for a valid token', async () => {
      const { sdk } = setup();

      const result = await sdk.checkToken({ token: VALID_TOKEN });
      expect(result.data).toEqual({ isValid: true });
    });

    it('should return false for an invalid token', async () => {
      const { sdk } = setup();

      const result = await sdk.checkToken({ token: 'invalid_token' });
      expect(result.data).toEqual({ isValid: false });
    });
  });

  describe('Health Endpoint (/health)', () => {
    it('should return OK status', async () => {
      const { sdk } = setup();

      const result = await sdk.healthCheck();
      expect(result.data).toEqual({ status: 'OK' });
    });
  });

  describe('Claude Endpoint (/claude)', () => {
    it('should return the expected response when given valid input', async () => {
      const { sdk } = setup();

      sdk.setAccessToken(VALID_TOKEN);

      const messages = [
        {
          sender: 'User' as const,
          content:
            'The following message is a part of an end-to-end test to integrate you with our chatbot. If you understand this message, please response exactly with the following text: "I understand, and my API is healthy!"',
        },
      ];

      let result = '';
      let hasStarted = false;
      let hasEnded = false;

      for await (const chunk of sdk.promptClaude({ messages })) {
        switch (chunk.type) {
          case ChunkType.Start:
            hasStarted = true;
            break;
          case ChunkType.Content:
            result += chunk.content;
            break;
          case ChunkType.End:
            hasEnded = true;
            break;
          case ChunkType.Error:
            throw new Error(chunk.error);
        }
      }

      expect(hasStarted).toBe(true);
      expect(hasEnded).toBe(true);
      expect(result.trim()).toEqual('I understand, and my API is healthy!');
    });

    it('should return 401 if no token is provided', async () => {
      const { sdk } = setup();

      const response = await sdk.promptClaude({ messages: [] }).next();
      const chunk = response.value;

      expect(chunk).toMatchObject({
        type: ChunkType.Error,
        error: expect.stringContaining('401'),
      });
    });
  });
});

const setup = () => {
  const sdk = new ContextGptSdk('http://localhost:8000');

  return {
    sdk,
  };
};
