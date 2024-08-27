import { Body, Controller, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ThreadsIdMessagesRequestPostDto } from './threads.dto';
import { AuthGuard } from '@context-gpt/server-auth';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LlmFacade } from '../ports/LlmFacade';
import { Message } from '../core/Message';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('threads')
export class ThreadsController {
  constructor(private readonly llmFacade: LlmFacade) {}

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
      const mappedMessages: Message[] = claudeRequestDto.messages.map((msg) => ({
        sender: msg.sender === 'User' ? 'user' : 'assistant',
        content: msg.content,
      }));
      const observable = this.llmFacade.prompt({ messages: mappedMessages });

      observable.subscribe({
        next: (chunk) => {
          res.write(`data: ${JSON.stringify({ content: chunk.content })}\n\n`);
        },
        error: (error) => {
          res.write(`data: ${JSON.stringify({ error })}\n\n`);
          res.end();
        },
        complete: () => {
          res.write('data: [DONE]\n\n');
          res.end();
        },
      });
    } catch (error) {
      res.write(`data: ${JSON.stringify({ error: 'An error occurred' })}\n\n`);
      res.end();
    }
  }
}
