import { ContextGptSdk } from './context-gpt-sdk';

const API_URL = process?.env?.['NEXT_PUBLIC_API_URL'];

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not set in the environment variables');
}

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
