import {
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateThreadResponseDto, ThreadsIdMessagesRequestPostDto } from './threads.dto';
import { AuthGuard, WithAuthUser } from '@context-gpt/server-auth';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { LlmFacade } from '../ports/LlmFacade';
import { Message } from '../domain/Message';
import { ErrorResponseDto } from '@context-gpt/server-shared-errors';
import { CreateThreadUseCase } from '../use-cases/create-thread.use-case';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Unauthorized',
  type: ErrorResponseDto,
})
@Controller('threads')
export class ThreadsController {
  constructor(
    private readonly llmFacade: LlmFacade,
    private readonly createThreadUseCase: CreateThreadUseCase,
  ) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Thread created successfully',
    type: CreateThreadResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async createThread(@Req() request: WithAuthUser<Request>): Promise<CreateThreadResponseDto> {
    const userId = request.user.userId;
    const result = await this.createThreadUseCase.execute({ userId });

    if (result.type === 'error') {
      throw new InternalServerErrorException(result.error.message);
    }

    return { threadId: result.value.threadId };
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
