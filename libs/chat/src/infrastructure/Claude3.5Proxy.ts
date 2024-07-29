import { LLMProxy, SendPromptInput } from '../ports/LLMProxy';

export class Claude3_5Proxy implements LLMProxy {
  async sendPrompt(input: SendPromptInput): Promise<void> {
    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: input.messages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is null');
      }

      const decoder = new TextDecoder();

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              input.endCallback();
            } else {
              try {
                const parsedData = JSON.parse(data);
                if (parsedData.content) {
                  input.addChunkCallback({ content: parsedData.content });
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw error;
    }
  }
}
