import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_LOCALE,
  detectBrowserLocale,
  I18NEXT_LANGUAGE_STORAGE_KEY,
  LANGUAGE_STORAGE_KEY,
  persistLocale,
  readPersistedLocale,
  resolveLocale,
  SUPPORTED_LOCALES,
  toI18nLanguage,
} from '../language';

describe('resolveLocale', () => {
  it('returns exact supported locale unchanged', () => {
    expect(resolveLocale('pt-BR')).toBe('pt-BR');
    expect(resolveLocale('de')).toBe('de');
    expect(resolveLocale('en')).toBe('en');
  });

  it('maps base language code to a supported locale', () => {
    expect(resolveLocale('pt-PT')).toBe('pt-BR');
    expect(resolveLocale('de-AT')).toBe('de');
    expect(resolveLocale('en-US')).toBe('en');
    expect(resolveLocale('en-GB')).toBe('en');
  });

  it('normalizes locale casing before resolving', () => {
    expect(resolveLocale('pt-br')).toBe('pt-BR');
    expect(resolveLocale('EN-us')).toBe('en');
  });

  it('falls back to DEFAULT_LOCALE for unsupported languages', () => {
    expect(resolveLocale('fr')).toBe(DEFAULT_LOCALE);
    expect(resolveLocale('es-ES')).toBe(DEFAULT_LOCALE);
    expect(resolveLocale('zh-CN')).toBe(DEFAULT_LOCALE);
  });

  it('falls back to DEFAULT_LOCALE for null / undefined / empty', () => {
    expect(resolveLocale(null)).toBe(DEFAULT_LOCALE);
    expect(resolveLocale(undefined)).toBe(DEFAULT_LOCALE);
    expect(resolveLocale('')).toBe(DEFAULT_LOCALE);
  });

  it('covers every supported locale without fallback', () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(resolveLocale(locale)).toBe(locale);
    }
  });
});

describe('detectBrowserLocale', () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  function mockNavigator(languages: string[], language?: string) {
    Object.defineProperty(global, 'navigator', {
      value: { languages, language: language ?? languages[0] ?? '' },
      writable: true,
      configurable: true,
    });
  }

  it('returns a supported locale when browser preference matches', () => {
    mockNavigator(['de-DE', 'en-US']);
    expect(detectBrowserLocale()).toBe('de');
  });

  it('returns en when browser prefers en-US', () => {
    mockNavigator(['en-US']);
    expect(detectBrowserLocale()).toBe('en');
  });

  it('returns pt-BR when browser prefers pt-BR', () => {
    mockNavigator(['pt-BR']);
    expect(detectBrowserLocale()).toBe('pt-BR');
  });

  it('falls back to DEFAULT_LOCALE for fully unsupported browser language', () => {
    mockNavigator(['fr-FR']);
    expect(detectBrowserLocale()).toBeNull();
  });

  it('picks first matching locale from navigator.languages list', () => {
    mockNavigator(['zh-CN', 'de', 'en-US']);
    expect(detectBrowserLocale()).toBe('de');
  });

  it('returns null when navigator is not available (SSR)', () => {
    Object.defineProperty(global, 'navigator', {
      value: undefined,
      writable: true,
      configurable: true,
    });
    expect(detectBrowserLocale()).toBeNull();
  });
});

describe('localStorage persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('readPersistedLocale returns null when nothing is stored', () => {
    expect(readPersistedLocale()).toBeNull();
  });

  it('persistLocale saves the locale to localStorage', () => {
    persistLocale('de');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('de');
    expect(localStorage.getItem(I18NEXT_LANGUAGE_STORAGE_KEY)).toBe('de');
  });

  it('readPersistedLocale returns the previously persisted locale', () => {
    persistLocale('en');
    expect(readPersistedLocale()).toBe('en');
  });

  it('readPersistedLocale reads the existing i18next key as fallback', () => {
    localStorage.setItem(I18NEXT_LANGUAGE_STORAGE_KEY, 'pt');
    expect(readPersistedLocale()).toBe('pt-BR');
  });

  it('readPersistedLocale returns null for an unsupported stored value', () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'fr');
    expect(readPersistedLocale()).toBeNull();
  });

  it('readPersistedLocale returns null for a corrupted stored value', () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, '!!!');
    expect(readPersistedLocale()).toBeNull();
  });

  it('persistLocale does not throw when localStorage is unavailable', () => {
    const getItem = Storage.prototype.getItem;
    const setItem = Storage.prototype.setItem;
    Storage.prototype.setItem = () => { throw new Error('blocked'); };
    Storage.prototype.getItem = () => { throw new Error('blocked'); };

    expect(() => persistLocale('de')).not.toThrow();
    expect(() => readPersistedLocale()).not.toThrow();

    Storage.prototype.setItem = setItem;
    Storage.prototype.getItem = getItem;
  });
});

describe('toI18nLanguage', () => {
  it('maps pt-BR to the i18next resource key', () => {
    expect(toI18nLanguage('pt-BR')).toBe('pt');
  });

  it('keeps resource keys for en and de', () => {
    expect(toI18nLanguage('en')).toBe('en');
    expect(toI18nLanguage('de')).toBe('de');
  });
});
