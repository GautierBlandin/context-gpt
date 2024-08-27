import { Module } from '@nestjs/common';
import { ThreadsController } from './threads/threads.controller';
import { HealthController } from './health/health.controller';
import { ServerAuthModule } from '@context-gpt/server-auth'; // Import the AuthModule

@Module({
  imports: [ServerAuthModule],
  controllers: [ThreadsController, HealthController],
  providers: [],
})
export class AppModule {}
