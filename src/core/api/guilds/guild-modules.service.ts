import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { SupportedLocale } from '../../i18n/locales.js';
import { ModuleRegistryService } from '../../module-registry/module-registry.service.js';
import { ModuleSettingsService } from '../../module-registry/module-settings.service.js';
import * as z from 'zod';

export type ModuleSummary = {
  key: string;
  name: Record<SupportedLocale, string>;
  enabled: boolean;
};

export type ModuleDetail = ModuleSummary & {
  settings: Record<string, unknown>;
  schema: unknown;
};

@Injectable()
export class GuildModulesService {
  constructor(
    private readonly registry: ModuleRegistryService,
    private readonly settings: ModuleSettingsService,
  ) {}

  /** The module's definition, or a 404 if there is no module with this key. */
  private getDefinition(key: string) {
    const definition = this.registry.get(key);
    if (!definition) {
      throw new NotFoundException(`Module "${key}" does not exist`);
    }
    return definition;
  }

  async list(guildId: string): Promise<ModuleSummary[]> {
    return Promise.all(
      this.registry.getAll().map(async (definition) => ({
        key: definition.key,
        name: definition.name,
        enabled: await this.settings.isEnabled(guildId, definition.key),
      })),
    );
  }

  async get(guildId: string, key: string): Promise<ModuleDetail> {
    const definition = this.getDefinition(key);

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
  ): Promise<ModuleDetail> {
    this.getDefinition(key);
    await this.settings.setEnabled(guildId, key, enabled);
    return this.get(guildId, key);
  }

  async replaceSettings(
    guildId: string,
    key: string,
    body: unknown,
  ): Promise<ModuleDetail> {
    const definition = this.getDefinition(key);
    const parse = definition.settingsSchema.safeParse(body);
    if (!parse.success) {
      throw new BadRequestException(parse.error.issues);
    }
    await this.settings.replaceSettings(guildId, definition, parse.data);
    return this.get(guildId, key);
  }
}
