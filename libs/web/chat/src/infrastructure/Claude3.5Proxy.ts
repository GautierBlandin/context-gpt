import { LLMProxy, SendPromptInput } from '../ports';
import { ChunkType, getSdk } from '@context-gpt/context-gpt-sdk';

export class Claude3_5Proxy implements LLMProxy {
  private sdk = getSdk();

  async sendPrompt(input: SendPromptInput): Promise<void> {
    try {
      const generator = this.sdk.promptClaude({ messages: input.messages });

      for await (const chunk of generator) {
        switch (chunk.type) {
          case ChunkType.Start:
            // Handle start of stream if needed
            break;
          case ChunkType.Content:
            input.addChunkCallback({ content: chunk.content });
            break;
          case ChunkType.End:
            input.endCallback();
            break;
          case ChunkType.Error:
            throw new Error(chunk.error);
        }
      }
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw error;
    }
  }
}
