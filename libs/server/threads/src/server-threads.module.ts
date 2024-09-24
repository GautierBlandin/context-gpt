import { Module } from '@nestjs/common';
import { ThreadsController } from './adapters/threads.controller';
import { ServerSharedModule } from '@context-gpt/server-shared-env';
import { ServerAuthModule } from '@context-gpt/server-auth';
import { LlmFacade } from './ports/LlmFacade';
import { AnthropicLlmFacade } from './infrastructure/LlmFacade.anthropic';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { ThreadsRepository } from './ports/threads.repository';
import { PrismaThreadsRepository } from './infrastructure/threads.repository.prisma';

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
  ],
  controllers: [ThreadsController],
})
export class ServerThreadsModule {}
