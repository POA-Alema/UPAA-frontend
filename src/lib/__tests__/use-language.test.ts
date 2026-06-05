import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LANGUAGE_STORAGE_KEY } from '../language';
import { useLanguage } from '../use-language';

function mockNavigatorLanguages(languages: string[]) {
  Object.defineProperty(global, 'navigator', {
    value: { languages, language: languages[0] ?? '' },
    writable: true,
    configurable: true,
  });
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('useLanguage — initialization with saved locale', () => {
  it('resolves to the persisted locale and sets ready:true', async () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'de');

    const { result } = renderHook(() => useLanguage());
    await act(async () => {});

    expect(result.current.ready).toBe(true);
    expect(result.current.locale).toBe('de');
    expect(result.current.source).toBe('persisted');
    expect(document.documentElement.lang).toBe('de');
  });

  it('resolves to en when en is persisted', async () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');

    const { result } = renderHook(() => useLanguage());
    await act(async () => {});

    expect(result.current.locale).toBe('en');
    expect(result.current.source).toBe('persisted');
  });
});

describe('useLanguage — initialization without saved locale', () => {
  it('uses browser language when no locale is persisted', async () => {
    mockNavigatorLanguages(['de-DE', 'en-US']);

    const { result } = renderHook(() => useLanguage());
    await act(async () => {});

    expect(result.current.locale).toBe('de');
    expect(result.current.source).toBe('browser');
    expect(result.current.ready).toBe(true);
  });

  it('falls back to default (pt-BR) for fully unsupported browser language', async () => {
    mockNavigatorLanguages(['fr-FR', 'it']);

    const { result } = renderHook(() => useLanguage());
    await act(async () => {});

    expect(result.current.locale).toBe('pt-BR');
    expect(result.current.source).toBe('default');
  });

  it('uses default locale and source when navigator is unavailable (SSR-like)', async () => {
    Object.defineProperty(global, 'navigator', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useLanguage());
    await act(async () => {});

    expect(result.current.locale).toBe('pt-BR');
    expect(result.current.source).toBe('default');
  });
});

describe('useLanguage — setLocale (user override)', () => {
  it('persisted locale takes precedence over browser language', async () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'de');
    mockNavigatorLanguages(['en-US']);

    const { result } = renderHook(() => useLanguage());
    await act(async () => {});

    expect(result.current.locale).toBe('de');
    expect(result.current.source).toBe('persisted');
  });

  it('setLocale updates locale state and persists to localStorage', async () => {
    mockNavigatorLanguages(['pt-BR']);

    const { result } = renderHook(() => useLanguage());
    await act(async () => {});

    expect(result.current.locale).toBe('pt-BR');

    await act(async () => {
      result.current.setLocale('en');
    });

    expect(result.current.locale).toBe('en');
    expect(result.current.source).toBe('persisted');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
  });

  it('user can override the auto-detected browser locale', async () => {
    mockNavigatorLanguages(['de-DE']);

    const { result } = renderHook(() => useLanguage());
    await act(async () => {});

    expect(result.current.locale).toBe('de');

    await act(async () => {
      result.current.setLocale('en');
    });

    expect(result.current.locale).toBe('en');
    expect(result.current.source).toBe('persisted');
  });

  it('locale persists across hook re-renders (simulated page reload)', async () => {
    const { result: first } = renderHook(() => useLanguage());
    await act(async () => {});
    await act(async () => { first.current.setLocale('de'); });

    const { result: second } = renderHook(() => useLanguage());
    await act(async () => {});

    expect(second.current.locale).toBe('de');
    expect(second.current.source).toBe('persisted');
  });
});
