import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClaudeController } from './claude.controller';
import { TokenController } from './token/token.controller';
import { TokenService } from './token/token.service';

@Module({
  imports: [],
  controllers: [AppController, ClaudeController, TokenController],
  providers: [AppService, TokenService],
})
export class AppModule {}
