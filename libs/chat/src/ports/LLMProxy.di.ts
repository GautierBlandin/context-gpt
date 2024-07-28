import { Claude3_5Proxy } from '../infrastructure/Claude3.5Proxy';
import { injectableFactory } from '@context-gpt/di';
import { LLMProxy } from './LLMProxy';

export const LLMProxyDi = injectableFactory<LLMProxy>({
  factory: () => new Claude3_5Proxy(),
});
