import { Module } from '@nestjs/common';
import { ThreadsController } from './threads/threads.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { HealthController } from './health/health.controller';
import { AuthGuard } from './auth/auth.guard'; // Add this line

@Module({
  imports: [],
  controllers: [ThreadsController, AuthController, HealthController],
  providers: [AuthService, AuthGuard],
})
export class AppModule {}
