import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Anthropic } from '@anthropic-ai/sdk';

@Controller('claude')
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

    // Set headers for SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    });

    try {
      const anthropicStream = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1000,
        messages: messages.map((msg: any) => ({
          role: msg.sender === 'User' ? 'user' : 'assistant',
          content: msg.content,
        })),
        stream: true,
      });

      console.log('Anthropic stream created');

      for await (const chunk of anthropicStream) {
        if (chunk.type === 'content_block_delta' && 'text' in chunk.delta) {
          res.write(`data: ${JSON.stringify({ content: chunk.delta.text })}\n\n`);
        }
      }

      res.write('data: [DONE]\n\n');
    } catch (error) {
      console.error('Error calling Claude API:', error);
      res.write(`data: ${JSON.stringify({ error: 'An error occurred' })}\n\n`);
    } finally {
      res.end();
    }
  }
}
