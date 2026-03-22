import { getPublicRuntimeConfig } from '@/lib/config';

describe('getPublicRuntimeConfig', () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    if (originalApiUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL;
      return;
    }

    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
  });

  it('uses the environment variable when available', () => {
    process.env.NEXT_PUBLIC_API_URL = 'http://fake-api';

    expect(getPublicRuntimeConfig()).toEqual({
      apiUrl: 'http://fake-api'
    });
  });

  it('uses the fallback URL when the environment variable is missing', () => {
    delete process.env.NEXT_PUBLIC_API_URL;

    expect(getPublicRuntimeConfig()).toEqual({
      apiUrl: 'http://localhost:8080'
    });
  });
});
