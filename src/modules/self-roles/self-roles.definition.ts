import * as z from 'zod';
import type { ModuleDefinition } from '../../core/module-registry/module-definition.js';

export const selfRolesSettingsSchema = z.object({});

export type SelfRolesSettings = z.infer<typeof selfRolesSettingsSchema>;

export const selfRolesModule = {
  key: 'self-roles',
  name: { en: 'Self roles', de: 'Selbstrollen' },
  commands: ['self-role'],
  settingsSchema: selfRolesSettingsSchema,
} satisfies ModuleDefinition;
