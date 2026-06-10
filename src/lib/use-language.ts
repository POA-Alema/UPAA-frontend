'use client';

import { useCallback, useEffect, useState } from 'react';
import i18n from '@/features/i18n';
import {
  DEFAULT_LOCALE,
  detectBrowserLocale,
  persistLocale,
  readPersistedLocale,
  toI18nLanguage,
  type SupportedLocale,
} from '@/lib/language';

type LanguageSource = 'persisted' | 'browser' | 'default';

type UseLanguageReturn = {
  locale: SupportedLocale;
  source: LanguageSource;
  ready: boolean;
  setLocale: (locale: SupportedLocale) => void;
};

export function useLanguage(): UseLanguageReturn {
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);
  const [source, setSource] = useState<LanguageSource>('default');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const persisted = readPersistedLocale();

    if (persisted) {
      setLocaleState(persisted);
      setSource('persisted');
    } else {
      const browser = detectBrowserLocale();
      if (browser) {
        setLocaleState(browser);
        setSource('browser');
      } else {
        setSource('default');
      }
    }

    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;

    const nextLanguage = toI18nLanguage(locale);
    if (i18n.language !== nextLanguage) {
      i18n.changeLanguage(nextLanguage).catch(() => {});
    }
  }, [locale]);

  const setLocale = useCallback((next: SupportedLocale) => {
    persistLocale(next);
    setLocaleState(next);
    setSource('persisted');
  }, []);

  return { locale, source, ready, setLocale };
}
