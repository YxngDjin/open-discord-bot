import * as z from 'zod';
import type { SupportedLocale } from '../i18n/locales.js';

export type ModuleDefinition<TSchema extends z.ZodObject = z.ZodObject> = {
  key: string;
  /** Display name in every supported language, e.g. for /help and /module list. */
  name: Record<SupportedLocale, string>;
  settingsSchema: TSchema;
  /**
   * Names of the top-level slash commands that belong to this module
   * (without "/" and without subcommands). /help hides them while the
   * module is disabled on a server.
   */
  commands?: string[];
};
