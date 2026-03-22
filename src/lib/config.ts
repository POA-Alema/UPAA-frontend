type PublicRuntimeConfig = {
  apiUrl: string;
};

const DEFAULT_API_URL = 'http://localhost:8080';

export function getPublicRuntimeConfig(): PublicRuntimeConfig {
  return {
    apiUrl: process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL
  };
}
