import * as z from 'zod';
import type { ModuleDefinition } from '../../core/module-registry/module-definition.js';

export const moderationSettingsSchema = z.object({
  dmUsers: z.boolean().default(true),
});

export type ModerationSettings = z.infer<typeof moderationSettingsSchema>;

export const moderationModule = {
  key: 'moderation',
  name: { en: 'Moderation', de: 'Moderation' },
  commands: ['mod'],
  settingsSchema: moderationSettingsSchema,
} satisfies ModuleDefinition;
