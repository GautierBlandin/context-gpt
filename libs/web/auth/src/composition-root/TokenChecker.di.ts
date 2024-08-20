import { singletonFactory } from '@context-gpt/di';
import { TokenCheckerImpl } from '../infrastructure';
import { AuthTokenHandler } from '../ports';

export const TokenCheckerSingleton = singletonFactory<AuthTokenHandler>({
  factory: () => new TokenCheckerImpl(),
});
