import * as z from 'zod';
import type { ModuleDefinition } from '../../core/module-registry/module-definition.js';

export const tempVoiceSettings = z.object({
  creatorChannelId: z.string().optional(),
  categoryId: z.string().optional(),
  nameTemplate: z.string().min(1).max(100).default("{user}'s channel"),
  userLimit: z.number().int().min(0).max(99).default(0),
  deleteAfterMinutes: z.number().int().min(0).max(60).default(3),
});

export type TempVoiceSettings = z.infer<typeof tempVoiceSettings>;

export const tempVoiceModule = {
  key: 'temp-voice',
  name: { en: 'Temporary voice channels', de: 'Temporäre Voice-Channels' },
  commands: ['tempvoice', 'voice'],
  settingsSchema: tempVoiceSettings,
} satisfies ModuleDefinition;
