import { ContextGptSdk } from '@context-gpt/context-gpt-sdk';

const sdk = new ContextGptSdk('');

export function getSdkSingleton() {
  return sdk;
}
