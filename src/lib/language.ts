export const SUPPORTED_LOCALES = ['pt-BR', 'en', 'de'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'pt-BR';

export const LANGUAGE_STORAGE_KEY = 'upaa:locale';

export function resolveLocale(
  locale?: string | null,
): SupportedLocale {
  if (!locale) {
    return DEFAULT_LOCALE;
  }

  if (SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    return locale as SupportedLocale;
  }

  const baseLanguage = locale.split('-')[0];

  const matchedLocale = SUPPORTED_LOCALES.find(
    (supportedLocale) => supportedLocale === baseLanguage,
  );

  return matchedLocale ?? DEFAULT_LOCALE;
}

export function detectBrowserLocale(): SupportedLocale | null {
  if (typeof navigator === 'undefined') {
    return null;
  }

  const browserLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const language of browserLanguages) {
    const resolvedLocale = resolveLocale(language);

    const isSupported = SUPPORTED_LOCALES.includes(resolvedLocale);

    if (
      isSupported &&
      (language.startsWith('pt') ||
        language.startsWith('en') ||
        language.startsWith('de'))
    ) {
      return resolvedLocale;
    }
  }

  return DEFAULT_LOCALE;
}

export function persistLocale(locale: SupportedLocale): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
  } catch {
    // ignore storage errors
  }
}

export function readPersistedLocale(): SupportedLocale | null {
  try {
    const storedLocale = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (!storedLocale) {
      return null;
    }

    const isSupported = SUPPORTED_LOCALES.includes(
      storedLocale as SupportedLocale,
    );

    return isSupported ? (storedLocale as SupportedLocale) : null;
  } catch {
    return null;
  }
}