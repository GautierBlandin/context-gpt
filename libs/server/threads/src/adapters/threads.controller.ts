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
import {
  convertThreadStateToDto,
  CreateThreadResponseDto,
  ThreadDto,
  ThreadsIdMessagesRequestPostDto,
} from './threads.dto';
import { AuthGuard, WithAuthUser } from '@context-gpt/server-auth';
import { ApiBearerAuth, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from '@context-gpt/server-shared-errors';
import { CreateThreadUseCase } from '../use-cases/create-thread.use-case';
import { PostMessageUseCase } from '../use-cases/post-message.use-case';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Unauthorized',
  type: ErrorResponseDto,
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Internal server error',
  type: ErrorResponseDto,
})
@ApiHeader({ name: 'authorization' })
@Controller('threads')
export class ThreadsController {
  constructor(
    private readonly createThreadUseCase: CreateThreadUseCase,
    private readonly postMessageUseCase: PostMessageUseCase,
  ) {}
  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Thread created successfully',
    type: ThreadDto,
  })
  async createThread(@Req() request: WithAuthUser<Request>): Promise<CreateThreadResponseDto> {
    const userId = request.user.userId;
    const result = await this.createThreadUseCase.execute({ userId });

    if (result.type === 'error') {
      throw new InternalServerErrorException(result.error.message);
    }

    return convertThreadStateToDto(result.value.thread);
  }

  @Post(':id/messages')
  async handleClaudeRequest(
    @Param('id') threadId: string,
    @Body() claudeRequestDto: ThreadsIdMessagesRequestPostDto,
    @Req() request: WithAuthUser<Request>,
    @Res() res: Response,
  ) {
    // Set headers for SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    });

    try {
      const userId = request.user.userId;
      const message = claudeRequestDto.message;

      const observable = this.postMessageUseCase.execute({ threadId, userId, message });

      observable.subscribe({
        next: (chunk) => {
          res.write(`data: ${JSON.stringify({ content: chunk.content })}\n\n`);
        },
        error: (error) => {
          res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
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
