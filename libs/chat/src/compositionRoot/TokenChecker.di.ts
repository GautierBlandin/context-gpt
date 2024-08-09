import { TokenCheckerImpl } from '../infrastructure';
import { singletonFactory } from '@context-gpt/di';

export const TokenCheckerSingleton = singletonFactory<TokenCheckerImpl>({
  factory: () => new TokenCheckerImpl(),
});
