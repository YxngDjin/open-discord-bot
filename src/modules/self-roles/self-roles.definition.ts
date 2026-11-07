import * as z from 'zod';
import type { ModuleDefinition } from '../../core/module-registry/module-definition.js';

export const selfRolesSettingsSchema = z.object({});

export type SelfRolesSettings = z.infer<typeof selfRolesSettingsSchema>;

export const selfRolesModule = {
  key: 'self-roles',
  settingsSchema: selfRolesSettingsSchema,
} satisfies ModuleDefinition;
