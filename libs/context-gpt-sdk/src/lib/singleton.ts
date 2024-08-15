import { ContextGptSdk } from './context-gpt-sdk';

const API_URL = import.meta.env['VITE_API_URL'] || '';

export function initializeSdkSingleton({ baseUrl }: Config) {
  const sdk = new ContextGptSdk(baseUrl);

  return {
    getSdk: () => sdk,
  };
}

export type Config = {
  baseUrl: string;
};

export const { getSdk } = initializeSdkSingleton({ baseUrl: API_URL });
