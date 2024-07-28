import { Chunk } from '../model/Chunk';
import { Message } from '../model/Message';

export interface LLMProxy {
  sendPrompt(input: SendPromptInput): void;
}

export interface SendPromptInput {
  messages: Message[];
  addChunkCallback: (chunk: Chunk) => void;
  endCallback: () => void;
}
