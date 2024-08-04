import { Module } from '@nestjs/common';
import { ClaudeController } from './chat/claude.controller';
import { TokenController } from './token/token.controller';
import { TokenService } from './token/token.service';
import { HealthController } from './health/health.controller'; // Add this line

@Module({
  imports: [],
  controllers: [ClaudeController, TokenController, HealthController],
  providers: [TokenService],
})
export class AppModule {}
