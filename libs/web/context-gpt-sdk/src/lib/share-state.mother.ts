export class SharedStateMother {
  static getValidSharedState() {
    const API_URL = import.meta.env['VITE_API_URL'];
    const API_PREFIX = import.meta.env['VITE_API_PREFIX'];

    if (!API_URL) {
      throw new Error('VITE_API_URL is not set in the environment variables');
    }

    if (!API_PREFIX) {
      throw new Error('VITE_API_PREFIX is not set in the environment variables');
    }

    return {
      accessToken: null,
      baseUrl: combineBaseUrl(API_URL, API_PREFIX),
    };
  }
}

function combineBaseUrl(url: string, prefix: string): string {
  // Remove trailing slash from URL if present
  const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  // Remove leading slash from prefix if present
  const cleanPrefix = prefix.startsWith('/') ? prefix.slice(1) : prefix;

  return `${cleanUrl}/${cleanPrefix}`;
}
