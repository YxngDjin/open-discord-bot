import * as z from 'zod';
import type { ModuleDefinition } from '../../core/module-registry/module-definition.js';

export const xpSettingsSchema = z.object({
  messageXp: z.number().int().min(0).max(100).default(20),
  messageCooldownSeconds: z.number().int().min(0).max(3600).default(60),
  voiceXpPerMinute: z.number().int().min(0).max(100).default(10),
  ignoredChannelIds: z.array(z.string()).default([]),
  levelUpMessages: z.boolean().default(true),
  levelUpChannelId: z.string().optional(),
  levelRoles: z
    .array(z.object({ level: z.number().int().min(1), roleId: z.string() }))
    .default([]),
  leaderboardChannelId: z.string().optional(),
  leaderboardTime: z.iso.time({ precision: -1 }).default('18:00'),
});

export type XpSettings = z.infer<typeof xpSettingsSchema>;

export const xpModule = {
  key: 'xp',
  name: { en: 'XP & levels', de: 'XP & Level' },
  commands: ['rank', 'leaderboard', 'xp'],
  settingsSchema: xpSettingsSchema,
} satisfies ModuleDefinition;
