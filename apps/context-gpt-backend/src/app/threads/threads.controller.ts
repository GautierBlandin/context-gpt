import { Body, Controller, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Anthropic } from '@anthropic-ai/sdk';
import { ThreadsIdMessagesRequestPostDto } from './threads.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('threads')
export class ThreadsController {
  private readonly anthropic: Anthropic;

  constructor() {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('CLAUDE_API_KEY is not set in the environment variables');
    }
    this.anthropic = new Anthropic({ apiKey });
  }

  @Post(':id/messages')
  async handleClaudeRequest(
    @Param('id') threadId: string,
    @Body() claudeRequestDto: ThreadsIdMessagesRequestPostDto,
    @Res() res: Response,
  ) {
    // Set headers for SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    });

    try {
      const anthropicStream = await this.initializeAnthropicStream(claudeRequestDto);

      for await (const chunk of anthropicStream) {
        if (chunk.type === 'content_block_delta' && 'text' in chunk.delta) {
          res.write(`data: ${JSON.stringify({ content: chunk.delta.text })}\n\n`);
        }
      }

      res.write('data: [DONE]\n\n');
    } catch (error) {
      res.write(`data: ${JSON.stringify({ error: 'An error occurred' })}\n\n`);
    } finally {
      res.end();
    }
  }

  private async initializeAnthropicStream(claudeRequestDto: ThreadsIdMessagesRequestPostDto) {
    const { messages } = claudeRequestDto;

    return this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1000,
      messages: messages.map((msg) => ({
        role: msg.sender === 'User' ? 'user' : 'assistant',
        content: msg.content,
      })),
      stream: true,
    });
  }
}
