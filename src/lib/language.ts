export const SUPPORTED_LOCALES = ['pt-BR', 'en', 'de'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'pt-BR';

export const LANGUAGE_STORAGE_KEY = 'upaa:locale';

export const I18NEXT_LANGUAGE_STORAGE_KEY = 'i18nextLng';

const LOCALE_BY_LANGUAGE: Record<string, SupportedLocale> = {
  pt: 'pt-BR',
  en: 'en',
  de: 'de',
};

export function resolveLocale(locale?: string | null): SupportedLocale {
  if (!locale) {
    return DEFAULT_LOCALE;
  }

  const normalizedLocale = locale.trim();
  const exactLocale = SUPPORTED_LOCALES.find(
    (supportedLocale) =>
      supportedLocale.toLowerCase() === normalizedLocale.toLowerCase(),
  );

  if (exactLocale) {
    return exactLocale;
  }

  const baseLanguage = normalizedLocale.split('-')[0].toLowerCase();

  return LOCALE_BY_LANGUAGE[baseLanguage] ?? DEFAULT_LOCALE;
}

export function detectBrowserLocale(): SupportedLocale | null {
  if (typeof navigator === 'undefined') {
    return null;
  }

  const browserLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const language of browserLanguages) {
    const baseLanguage = language.split('-')[0].toLowerCase();
    const resolvedLocale = LOCALE_BY_LANGUAGE[baseLanguage];

    if (resolvedLocale) {
      return resolvedLocale;
    }
  }

  return null;
}

export function persistLocale(locale: SupportedLocale): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
    localStorage.setItem(I18NEXT_LANGUAGE_STORAGE_KEY, toI18nLanguage(locale));
  } catch {
    // ignore storage errors
  }
}

export function readPersistedLocale(): SupportedLocale | null {
  try {
    const storedLocale =
      localStorage.getItem(LANGUAGE_STORAGE_KEY) ??
      localStorage.getItem(I18NEXT_LANGUAGE_STORAGE_KEY);

    if (!storedLocale) {
      return null;
    }

    const normalizedLocale = storedLocale.trim();
    const exactLocale = SUPPORTED_LOCALES.find(
      (supportedLocale) =>
        supportedLocale.toLowerCase() === normalizedLocale.toLowerCase(),
    );

    if (exactLocale) {
      return exactLocale;
    }

    const baseLanguage = normalizedLocale.split('-')[0].toLowerCase();

    return LOCALE_BY_LANGUAGE[baseLanguage] ?? null;
  } catch {
    return null;
  }
}

export function toI18nLanguage(locale: SupportedLocale): string {
  return locale === 'pt-BR' ? 'pt' : locale;
}
