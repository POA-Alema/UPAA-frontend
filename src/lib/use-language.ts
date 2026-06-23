'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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
    const nextLanguage = toI18nLanguage(locale);
    if (i18n.language !== nextLanguage) {
      i18n.changeLanguage(nextLanguage)
        .then(() => { document.documentElement.lang = locale; })
        .catch(() => {});
    } else {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback((next: SupportedLocale) => {
    persistLocale(next);
    setLocaleState(next);
    setSource('persisted');
    router.refresh();
  }, [router]);

  return { locale, source, ready, setLocale };
}
