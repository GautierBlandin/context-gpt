import { Module } from '@nestjs/common';
import { ClaudeController } from './claude.controller';

@Module({
  controllers: [ClaudeController],
})
export class AppModule {}
