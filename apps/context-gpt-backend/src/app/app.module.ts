import { Module } from '@nestjs/common';
import { ThreadsController } from './chat/threads.controller';
import { TokenController } from './token/token.controller';
import { TokenService } from './token/token.service';
import { HealthController } from './health/health.controller';
import { AuthGuard } from './authorization/authorization'; // Add this line

@Module({
  imports: [],
  controllers: [ThreadsController, TokenController, HealthController],
  providers: [TokenService, AuthGuard],
})
export class AppModule {}
