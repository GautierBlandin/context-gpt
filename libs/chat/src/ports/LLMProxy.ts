import { Chunk } from '../model/Chunk';

export interface LLMProxy {
  sendPrompt(input: SendPromptInput): void;
}

export interface SendPromptInput {
  prompt: string;
  addChunkCallback: (chunk: Chunk) => void;
  endCallback: () => void;
}
