import { Module } from '@nestjs/common';
import { ServerAuthModule } from '@context-gpt/server-auth';
import { ServerThreadsModule } from '@context-gpt/server-threads';
import { HealthController } from './health/health.controller';

@Module({
  imports: [ServerAuthModule, ServerThreadsModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
