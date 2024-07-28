import { LLMProxy, SendPromptInput } from '../ports/LLMProxy';
import { Anthropic } from '@anthropic-ai/sdk';

export class Claude3_5Proxy implements LLMProxy {
  private client: Anthropic;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_CLAUDE_API_KEY is not set in the environment variables');
    }
    this.client = new Anthropic({ apiKey });
  }

  async sendPrompt(input: SendPromptInput): Promise<void> {
    try {
      const stream = await this.client.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: input.messages.map(msg => ({
          role: msg.sender === 'User' ? 'user' : 'assistant',
          content: msg.content
        })),
        stream: true,
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && 'text' in chunk.delta) {
          input.addChunkCallback({ content: chunk.delta.text });
        }
      }

      input.endCallback();
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw error;
    }
  }
}
