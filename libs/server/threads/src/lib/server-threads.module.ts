import { Module } from '@nestjs/common';
import { ThreadsController } from './threads.controller';
import { ServerSharedModule } from '@context-gpt/server-shared';
import { ServerAuthModule } from '@context-gpt/server-auth';

@Module({
  imports: [ServerSharedModule, ServerAuthModule],
  controllers: [ThreadsController],
})
export class ServerThreadsModule {}
