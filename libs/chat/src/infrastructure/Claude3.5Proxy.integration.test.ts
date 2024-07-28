import { Claude3_5Proxy } from './Claude3.5Proxy';
import { SendPromptInput } from '../ports/LLMProxy';
import { Message } from '../model/Message';

describe('Claude3_5Proxy Integration Test', () => {
  let proxy: Claude3_5Proxy;

  beforeEach(() => {
    proxy = new Claude3_5Proxy();
  });

  it('should send messages and receive a response', async () => {
    const messages: Message[] = [
      { content: 'What is the capital of France?', sender: 'User' }
    ];
    const chunks: string[] = [];
    let isComplete = false;

    const input: SendPromptInput = {
      messages,
      addChunkCallback: (chunk) => {
        chunks.push(chunk.content);
      },
      endCallback: () => {
        isComplete = true;
      },
    };

    await proxy.sendPrompt(input);

    // Assertions
    expect(chunks.length).toBeGreaterThan(0);
    const fullResponse = chunks.join('');
    expect(fullResponse.toLowerCase()).toContain('paris');
    expect(isComplete).toBe(true);
  }, 30000); // Increase timeout to 30 seconds for API call
});
