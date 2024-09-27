import { ChunkType, ThreadsSdk } from './threads.sdk';
import { SharedStateMother } from './share-state.mother';
import { SharedState } from './shared-state';
import { beforeEach, describe, expect, it } from 'vitest';
import { getValidAuthorizationToken } from './auth-test-helper';
import { createApiClient } from './test-client';

describe('Threads sdk', () => {
  let threadsSdk: ThreadsSdk;
  let sharedState: SharedState;

  beforeEach(() => {
    const testSharedState = SharedStateMother.getValidSharedState();
    threadsSdk = new ThreadsSdk(testSharedState, createApiClient());
    sharedState = testSharedState;
  });

  describe('createThread', () => {
    it('should return the expected response when given valid input', async () => {
      // Use the auth-test-helper to get a valid token
      sharedState.accessToken = await getValidAuthorizationToken();

      const { response, data, error } = await threadsSdk.createThread();

      expect(error).toBeUndefined();
      expect(data?.threadId).toBeDefined();
      expect(response.status).toBe(201);
    });
  });

  describe('postMessage', () => {
    it('should return the expected response when given valid input', async () => {
      // Use the auth-test-helper to get a valid token
      sharedState.accessToken = await getValidAuthorizationToken();

      const thread = await threadsSdk.createThread();

      if (!thread.data) {
        throw new Error('Failed to create thread');
      }

      const message =
        'The following message is a part of an end-to-end test to integrate you with our chatbot. If you understand this message, please response exactly with the following text: "I understand, and my API is healthy!"';

      let result = '';
      let hasStarted = false;
      let hasEnded = false;

      for await (const chunk of threadsSdk.postMessage({ message, threadId: thread.data.threadId })) {
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
      sharedState.accessToken = await getValidAuthorizationToken();

      const thread = await threadsSdk.createThread();

      if (!thread.data) {
        throw new Error('Failed to create thread');
      }

      sharedState.accessToken = null;

      const response = await threadsSdk
        .postMessage({ message: 'valid message', threadId: thread.data.threadId })
        .next();
      const chunk = response.value;

      expect(chunk).toMatchObject({
        type: ChunkType.Error,
        error: expect.stringContaining('401'),
      });
    });
  });
});
