import { ContextGptSdk } from './context-gpt-sdk';

export function initializeSdkSingleton({ baseUrl }: Config) {
  const sdk = new ContextGptSdk(baseUrl);

  return {
    getSdk: () => sdk,
  };
}

export type Config = {
  baseUrl: string;
};

export const { getSdk } = initializeSdkSingleton({ baseUrl: '' });
