import { Chunk, Message } from '../core';

export interface LLMProxy {
  sendPrompt(input: SendPromptInput): void;
}

export interface SendPromptInput {
  messages: Message[];
  addChunkCallback: (chunk: Chunk) => void;
  endCallback: () => void;
}
