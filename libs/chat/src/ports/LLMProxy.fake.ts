import { LLMProxy, SendPromptInput } from './LLMProxy';

export class LLMProxyFake implements LLMProxy {
  private responseChunks: string[] = [];
  private delay = 1;
  private shouldThrowError = false;

  setResponse(chunks: string[]): void {
    this.responseChunks = chunks;
  }

  setDelay(milliseconds: number): void {
    this.delay = milliseconds;
  }

  setShouldThrowError(shouldThrow: boolean): void {
    this.shouldThrowError = shouldThrow;
  }

  async sendPrompt(input: SendPromptInput): Promise<void> {
    if (this.shouldThrowError) {
      throw new Error('Fake LLM error');
    }

    for (const chunk of this.responseChunks) {
      if (this.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, this.delay));
      }
      input.addChunkCallback({ content: chunk });
    }

    input.endCallback();
  }
}
