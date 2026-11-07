import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, resolveLocale } from './locales.js';

describe('resolveLocale', () => {
  it('keeps a supported language', () => {
    expect(resolveLocale('de')).toBe('de');
    expect(resolveLocale('en')).toBe('en');
  });

  it('ignores the region of Discord locales', () => {
    expect(resolveLocale('en-US')).toBe('en');
    expect(resolveLocale('en-GB')).toBe('en');
  });

  it('ignores upper and lower case', () => {
    expect(resolveLocale('DE')).toBe('de');
  });

  it('falls back to the default language for unsupported languages', () => {
    expect(resolveLocale('fr')).toBe(DEFAULT_LOCALE);
    expect(resolveLocale('pt-BR')).toBe(DEFAULT_LOCALE);
  });
});
