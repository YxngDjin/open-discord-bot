import { describe, expect, it } from 'vitest';
import { translations } from './index.js';

/** All strings in a value, however deeply nested. Functions are skipped. */
const collectStrings = (value: unknown): string[] => {
  if (typeof value === 'string') return [value];
  if (typeof value === 'object' && value !== null) {
    return Object.values(value).flatMap(collectStrings);
  }
  return [];
};

/** All command and option descriptions of one language. */
const descriptionsOf = (texts: object): string[] =>
  Object.values(texts).flatMap((section: Record<string, unknown>) => [
    ...collectStrings(section.commands),
    ...collectStrings(section.options),
  ]);

describe('translations', () => {
  for (const [locale, texts] of Object.entries(translations)) {
    describe(locale, () => {
      const descriptions = descriptionsOf(texts);

      it('has command and option descriptions', () => {
        // Guards against the test silently checking nothing
        expect(descriptions.length).toBeGreaterThan(50);
      });

      // Discord rejects ALL commands at startup if a single description is
      // empty or longer than 100 characters.
      it('keeps every description between 1 and 100 characters', () => {
        for (const description of descriptions) {
          expect(description.length, description).toBeGreaterThan(0);
          expect(description.length, description).toBeLessThanOrEqual(100);
        }
      });
    });
  }
});
