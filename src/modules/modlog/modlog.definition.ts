import * as z from 'zod';
import type { ModuleDefinition } from '../../core/module-registry/module-definition.js';

export const modlogSettingsSchema = z.object({
  channelId: z.string().optional(),
  logModeration: z.boolean().default(true),
  logJoins: z.boolean().default(false),
  logLeaves: z.boolean().default(false),
});

export type ModlogSettings = z.infer<typeof modlogSettingsSchema>;

export const modlogModule = {
  key: 'modlog',
  name: { en: 'Mod log', de: 'Mod-Log' },
  commands: ['modlog'],
  settingsSchema: modlogSettingsSchema,
} satisfies ModuleDefinition;
