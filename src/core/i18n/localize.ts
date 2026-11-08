import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './locales.js';
import { translations, type Translations } from './translations/index.js';

export const localize = (select: (t: Translations) => string) => ({
  value: select(translations[DEFAULT_LOCALE]),
  localizations: Object.fromEntries(
    SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).map(
      (locale) => [locale, select(translations[locale])],
    ),
  ),
});

export const describeCommand = (select: (t: Translations) => string) => {
  const { value, localizations } = localize(select);
  return { description: value, descriptionLocalizations: localizations };
};

export const describeOption = (select: (t: Translations) => string) => {
  const { value, localizations } = localize(select);
  return { description: value, description_localizations: localizations };
};

export const describeName = (select: (t: Translations) => string) => {
  const { value, localizations } = localize(select);
  return { name: value, name_localizations: localizations };
};
