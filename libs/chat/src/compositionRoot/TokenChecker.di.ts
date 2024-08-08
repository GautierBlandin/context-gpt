import { TokenChecker } from '../infrastructure/TokenChecker';
import { singletonFactory } from '@context-gpt/di';

export const TokenCheckerSingleton = singletonFactory<TokenChecker>({
  factory: () => new TokenChecker(),
});
