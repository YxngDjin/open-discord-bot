import * as z from 'zod';
import type { ModuleDefinition } from '../../core/module-registry/module-definition.js';

export const welcomeSettingsSchema = z.object({
  channelId: z.string().optional(),
  message: z.string().max(2000).optional(),
  autoRoleIds: z.array(z.string()).default([]),
  autoRoleDelaySeconds: z.number().int().min(0).max(3600).default(0),
  goodbyeEnabled: z.boolean().default(false),
  goodbyeMessage: z.string().max(2000).optional(),
});

export type WelcomeSettings = z.infer<typeof welcomeSettingsSchema>;

export const welcomeModule = {
  key: 'welcome',
  name: { en: 'Welcome', de: 'Willkommen' },
  commands: ['welcome'],
  settingsSchema: welcomeSettingsSchema,
} satisfies ModuleDefinition;
