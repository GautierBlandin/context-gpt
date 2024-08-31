# Web Framework

The backend of the application is built using the NestJS framework.

NestJS implementation details are kept at the adapter layer. We avoid using the framework below.
For this reason, we avoid using the @Injectable() decorator. Instead, we use abstract classes as injection
token and register the implementations explicitly in the module.

Example of a module

```ts
import { Module } from '@nestjs/common';
import { ThreadsController } from './adapters/threads.controller';
import { ServerEnvModule } from '@context-gpt/server-shared-env';
import { ServerAuthModule } from '@context-gpt/server-auth';
import { LlmFacade } from './ports/LlmFacade';
import { AnthropicLlmFacade } from './infrastructure/LlmFacade.anthropic';

@Module({
  imports: [ServerEnvModule, ServerAuthModule],
  providers: [
    {
      provide: LlmFacade,
      useClass: AnthropicLlmFacade,
    },
  ],
  controllers: [ThreadsController],
})
export class ServerThreadsModule {
}
```
