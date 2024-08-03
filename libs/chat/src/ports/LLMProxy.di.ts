import { Claude3_5Proxy } from '../infrastructure/Claude3.5Proxy';
import { singletonFactory } from '@context-gpt/di';
import { LLMProxy } from './LLMProxy';

export const LLMProxyDi = singletonFactory<LLMProxy>({
  factory: () => new Claude3_5Proxy(),
});
