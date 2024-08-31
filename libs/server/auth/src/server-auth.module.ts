import { Module } from '@nestjs/common';
import { AuthController } from './adapters/auth.controller';
import { AuthGuard } from './adapters/auth.guard';
import { ServerSharedModule } from '@context-gpt/server-shared-env';
import { LoginUserUseCase, LoginUserUseCaseImpl } from './use-cases/login-user.use-case';
import { RegisterUserUseCase, RegisterUserUseCaseImpl } from './use-cases/register-user.use-case';
import { ValidateTokenUseCase, ValidateTokenUseCaseImpl } from './use-cases/validate-token.use-case';
import { TokenService, TokenServiceImpl } from './domain/token.service';

@Module({
  imports: [ServerSharedModule],
  controllers: [AuthController],
  providers: [
    AuthGuard,
    {
      provide: LoginUserUseCase,
      useClass: LoginUserUseCaseImpl,
    },
    {
      provide: RegisterUserUseCase,
      useClass: RegisterUserUseCaseImpl,
    },
    {
      provide: ValidateTokenUseCase,
      useClass: ValidateTokenUseCaseImpl,
    },
    {
      provide: TokenService,
      useClass: TokenServiceImpl,
    },
  ],
  exports: [AuthGuard],
})
export class ServerAuthModule {}
