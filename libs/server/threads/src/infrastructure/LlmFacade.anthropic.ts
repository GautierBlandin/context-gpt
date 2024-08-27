import { Message } from '../core/Message';
import { Observable } from 'rxjs';
import { Anthropic } from '@anthropic-ai/sdk';
import { Env } from '@context-gpt/server-shared';
import { Chunk, LlmFacade } from '../ports/LlmFacade';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AnthropicLlmFacade extends LlmFacade {
  private readonly anthropic: Anthropic;

  constructor(private readonly env: Env) {
    super();
    const apiKey = this.env.get('CLAUDE_API_KEY');
    if (!apiKey) {
      throw new Error('CLAUDE_API_KEY is not set in the environment variables');
    }
    this.anthropic = new Anthropic({ apiKey });
  }

  prompt(args: { messages: Message[] }): Observable<Chunk> {
    return new Observable<Chunk>((observer) => {
      this.initializeAnthropicStream(args.messages)
        .then(async (anthropicStream) => {
          for await (const chunk of anthropicStream) {
            if (chunk.type === 'content_block_delta' && 'text' in chunk.delta) {
              observer.next({ content: chunk.delta.text });
            }
          }
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  private async initializeAnthropicStream(messages: Message[]) {
    return this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 5000,
      messages: messages.map((msg) => ({
        role: msg.sender,
        content: msg.content,
      })),
      stream: true,
    });
  }
}
