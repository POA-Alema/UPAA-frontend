type PublicRuntimeConfig = {
  apiUrl: string;
};

const DEFAULT_API_URL = 'http://localhost:3001';
const DEFAULT_BROWSER_PROXY_URL = '/api/backend';

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function isBrowserHttps(): boolean {
  return typeof window !== 'undefined' && window.location.protocol === 'https:';
}

function getServerApiUrl(publicApiUrl: string | undefined): string {
  const serverApiUrl = process.env.SERVER_API_URL ?? process.env.BACKEND_API_URL;

  if (serverApiUrl) {
    return serverApiUrl;
  }

  if (publicApiUrl && isAbsoluteUrl(publicApiUrl)) {
    return publicApiUrl;
  }

  return DEFAULT_API_URL;
}

function getBrowserApiUrl(publicApiUrl: string | undefined): string {
  if (publicApiUrl && isBrowserHttps() && publicApiUrl.startsWith('http://')) {
    return DEFAULT_BROWSER_PROXY_URL;
  }

  return publicApiUrl ?? DEFAULT_API_URL;
}

export function getPublicRuntimeConfig(): PublicRuntimeConfig {
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;

  return {
    apiUrl:
      typeof window === 'undefined'
        ? getServerApiUrl(publicApiUrl)
        : getBrowserApiUrl(publicApiUrl)
  };
}
