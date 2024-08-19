import { Chunk } from '../core/Chunk';
import { Message } from '../core/Message';

export interface LLMProxy {
  sendPrompt(input: SendPromptInput): void;
}

export interface SendPromptInput {
  messages: Message[];
  addChunkCallback: (chunk: Chunk) => void;
  endCallback: () => void;
}
