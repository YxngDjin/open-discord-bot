import { Injectable, NotFoundException } from '@nestjs/common';
import { SupportedLocale } from '../../i18n/locales.js';
import { ModuleRegistryService } from '../../module-registry/module-registry.service.js';
import { ModuleSettingsService } from '../../module-registry/module-settings.service.js';
import * as z from 'zod';

export type ModuleSummary = {
  key: string;
  name: Record<SupportedLocale, string>;
  enabled: boolean;
};

export type moduleDetail = ModuleSummary & {
  settings: Record<string, unknown>;
  schema: unknown;
};

@Injectable()
export class GuildModulesService {
  constructor(
    private readonly registry: ModuleRegistryService,
    private readonly settings: ModuleSettingsService,
  ) {}

  async list(guildId: string): Promise<ModuleSummary[]> {
    return Promise.all(
      this.registry.getAll().map(async (definition) => ({
        key: definition.key,
        name: definition.name,
        enabled: await this.settings.isEnabled(guildId, definition.key),
      })),
    );
  }

  async get(guildId: string, key: string) {
    const definition = this.registry.get(key);
    if (!definition) {
      throw new NotFoundException(`Module "${key}" does not exist`);
    }

    return {
      key: definition.key,
      name: definition.name,
      enabled: await this.settings.isEnabled(guildId, definition.key),
      settings: await this.settings.getSettings(guildId, definition),
      schema: z.toJSONSchema(definition.settingsSchema),
    };
  }

  async setEnabled(
    guildId: string,
    key: string,
    enabled: boolean,
  ): Promise<moduleDetail> {
    const isExisting = this.registry.get(key);
    if (!isExisting) {
      throw new NotFoundException(`Module "${key}" does not exist`);
    }
    await this.settings.setEnabled(guildId, key, enabled);
    return await this.get(guildId, key);
  }
}
