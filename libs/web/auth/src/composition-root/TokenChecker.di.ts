import { singletonFactory } from '@context-gpt/di';
import { AuthTokenHandlerImpl } from '../infrastructure';
import { AuthTokenHandler } from '../ports';

export const TokenCheckerSingleton = singletonFactory<AuthTokenHandler>({
  factory: () => new AuthTokenHandlerImpl(),
});
