import { Module } from '@nestjs/common';
import { ThreadsController } from './threads/threads.controller';
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module'; // Import the AuthModule

@Module({
  imports: [AuthModule], // Import AuthModule here
  controllers: [ThreadsController, HealthController],
  providers: [],
})
export class AppModule {}
