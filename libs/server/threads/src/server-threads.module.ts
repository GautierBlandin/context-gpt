import { Module } from '@nestjs/common';
import { ThreadsController } from './adapters/threads.controller';
import { ServerSharedModule } from '@context-gpt/server-shared';
import { ServerAuthModule } from '@context-gpt/server-auth';
import { LlmFacade } from './ports/LlmFacade';
import { AnthropicLlmFacade } from './infrastructure/LlmFacade.anthropic';

@Module({
  imports: [ServerSharedModule, ServerAuthModule],
  providers: [
    {
      provide: LlmFacade,
      useClass: AnthropicLlmFacade,
    },
  ],
  controllers: [ThreadsController],
})
export class ServerThreadsModule {}
