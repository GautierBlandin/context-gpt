import { Module } from '@nestjs/common';
import { ThreadsController } from './adapters/threads.controller';
import { ServerSharedModule } from '@context-gpt/server-shared-env';
import { ServerAuthModule } from '@context-gpt/server-auth';
import { LlmFacade } from './ports/LlmFacade';
import { AnthropicLlmFacade } from './infrastructure/LlmFacade.anthropic';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { ThreadsRepository } from './ports/threads.repository';
import { PrismaThreadsRepository } from './infrastructure/threads.repository.prisma';
import { CreateThreadUseCase, CreateThreadUseCaseImpl } from './use-cases/create-thread.use-case';
import { PostMessageUseCase, PostMessageUseCaseImpl } from './use-cases/post-message.use-case';

@Module({
  imports: [ServerSharedModule, ServerAuthModule],
  providers: [
    PrismaService,
    {
      provide: ThreadsRepository,
      useClass: PrismaThreadsRepository,
    },
    {
      provide: LlmFacade,
      useClass: AnthropicLlmFacade,
    },
    {
      provide: CreateThreadUseCase,
      useClass: CreateThreadUseCaseImpl,
    },
    {
      provide: PostMessageUseCase,
      useClass: PostMessageUseCaseImpl,
    },
  ],
  controllers: [ThreadsController],
})
export class ServerThreadsModule {}
