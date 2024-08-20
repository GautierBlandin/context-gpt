import { ContextGptSdk } from './context-gpt-sdk';
import { proxy } from 'valtio';

const API_URL = import.meta.env['VITE_API_URL'] || '';
const API_PREFIX = import.meta.env['VITE_API_PREFIX'] || '';

function combineBaseUrl(url: string, prefix: string): string {
  const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  const cleanPrefix = prefix.startsWith('/') ? prefix.slice(1) : prefix;

  return `${cleanUrl}/${cleanPrefix}`;
}

export function initializeSdkSingleton({ baseUrl, prefix }: Config) {
  const combinedBaseUrl = combineBaseUrl(baseUrl, prefix);
  const sdk = new ContextGptSdk({ baseUrl: combinedBaseUrl });

  const state = proxy({
    sdk,
  });

  return {
    getSdk: () => state.sdk,
  };
}

export type Config = {
  baseUrl: string;
  prefix: string;
};

export const { getSdk } = initializeSdkSingleton({
  baseUrl: API_URL,
  prefix: API_PREFIX,
});
