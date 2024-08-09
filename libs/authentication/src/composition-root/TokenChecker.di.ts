import { singletonFactory } from '@context-gpt/di';
import { TokenCheckerImpl } from '../infrastructure';
import { TokenChecker } from '../ports';

export const TokenCheckerSingleton = singletonFactory<TokenChecker>({
  factory: () => new TokenCheckerImpl(),
});
