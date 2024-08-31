import { ChunkType, ThreadsSdk } from './threads.sdk';
import { SharedStateMother } from './share-state.mother';
import { SharedState } from './shared-state';
import { describe, expect, it } from 'vitest';
import { getValidToken } from './test-token';

describe('Threads sdk', () => {
  let threadsSdk: ThreadsSdk;
  let sharedState: SharedState;

  beforeEach(() => {
    const testSharedState = SharedStateMother.getValidSharedState();

    threadsSdk = new ThreadsSdk(testSharedState);
    sharedState = testSharedState;
  });

  describe('Claude Endpoint (/claude)', () => {
    it('should return the expected response when given valid input', async () => {
      sharedState.accessToken = getValidToken();

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

      for await (const chunk of threadsSdk.postMessage({ messages })) {
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
      sharedState.accessToken = null;

      const response = await threadsSdk.postMessage({ messages: [] }).next();
      const chunk = response.value;

      expect(chunk).toMatchObject({
        type: ChunkType.Error,
        error: expect.stringContaining('401'),
      });
    });
  });
});
