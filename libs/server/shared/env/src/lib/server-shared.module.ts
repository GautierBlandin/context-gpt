import { Module } from '@nestjs/common';
import { Env } from './env';
import { ProcessEnv } from './env.process';

@Module({
  providers: [
    {
      provide: Env,
      useClass: ProcessEnv,
    },
  ],
  exports: [Env],
})
export class ServerSharedModule {}
