import { singletonFactory } from '@context-gpt/di';
import { TokenCheckerImpl } from '../infrastructure';

export const TokenCheckerSingleton = singletonFactory<TokenCheckerImpl>({
  factory: () => new TokenCheckerImpl(),
});
