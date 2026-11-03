export const SUPPORTED_LOCALES = ['en', 'de'] as const;

export const LOCALE_NAMES = {
  en: 'English',
  de: 'Deutsch',
} satisfies Record<SupportedLocale, string>;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'en';

export const resolveLocale = (input: string): SupportedLocale => {
  return (
    SUPPORTED_LOCALES.find(
      (locale) => locale === input.split('-')[0].toLowerCase(),
    ) ?? DEFAULT_LOCALE
  );
};
