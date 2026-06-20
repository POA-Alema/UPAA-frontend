declare module "i18next" {
  type InitOptions = Record<string, unknown>;

  const i18n: {
    use(plugin: unknown): typeof i18n;
    init(options: InitOptions): typeof i18n;
    t(key: string, options?: unknown): string;
  };

  export default i18n;
}

declare module "react-i18next" {
  export const initReactI18next: unknown;

  export function useTranslation(namespace?: string): {
    i18n: {
      language: string;
      changeLanguage(language: string): Promise<unknown>;
    };
    t: (
      key: string,
      fallbackOrOptions?: string | Record<string, unknown>,
      options?: Record<string, unknown>,
    ) => string;
  };
}
