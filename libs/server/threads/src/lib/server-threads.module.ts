import { Module } from '@nestjs/common';
import { ThreadsController } from './threads.controller';
import { ServerSharedModule } from '@context-gpt/server-shared';

@Module({
  imports: [ServerSharedModule],
  controllers: [ThreadsController],
  exports: [ThreadsController],
})
export class ServerThreadsModule {}
