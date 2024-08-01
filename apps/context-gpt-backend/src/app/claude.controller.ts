import { Controller, Post, Req, Res, StreamableFile } from '@nestjs/common';
import { Request, Response } from 'express';
import { Anthropic } from '@anthropic-ai/sdk';
import { Readable } from 'stream';

@Controller('api/claude')
export class ClaudeController {
  private readonly anthropic: Anthropic;

  constructor() {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('CLAUDE_API_KEY is not set in the environment variables');
    }
    this.anthropic = new Anthropic({ apiKey });
  }

  @Post()
  async handleClaudeRequest(@Req() req: Request, @Res() res: Response) {
    const { messages } = req.body;

    const anthropicStream = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1000,
      messages: messages.map((msg: any) => ({
        role: msg.sender === 'User' ? 'user' : 'assistant',
        content: msg.content,
      })),
      stream: true,
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    const readable = new Readable({
      read() {},
    });

    (async () => {
      try {
        for await (const chunk of anthropicStream) {
          if (chunk.type === 'content_block_delta' && 'text' in chunk.delta) {
            readable.push(`data: ${JSON.stringify({ content: chunk.delta.text })}\n\n`);
          }
        }
        readable.push('data: [DONE]\n\n');
        readable.push(null);
      } catch (error) {
        console.error('Error calling Claude API:', error);
        readable.push(`data: ${JSON.stringify({ error: 'An error occurred' })}\n\n`);
        readable.push(null);
      }
    })();

    return new StreamableFile(readable);
  }
}
