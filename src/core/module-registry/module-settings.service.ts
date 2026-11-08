import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { ModuleRegistryService } from './module-registry.service.js';
import type * as z from 'zod';
import type { ModuleDefinition } from './module-definition.js';
import type { Prisma } from '../../generated/prisma/client.js';
import { nullToUndefined } from './null-to-undefined.js';

@Injectable()
export class ModuleSettingsService {
  private readonly logger = new Logger(ModuleSettingsService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly moduleRegistryService: ModuleRegistryService,
  ) {}

  async isEnabled(guildId: string, key: string) {
    const setting = await this.prisma.guildModule.findUnique({
      where: {
        guildId_module: {
          guildId,
          module: key,
        },
      },
    });

    return setting?.enabled ?? false;
  }

  async setEnabled(guildId: string, key: string, enabled: boolean) {
    const definition = this.moduleRegistryService.get(key);
    if (!definition) {
      throw new Error(`Module "${key}" does not exist`);
    }

    await this.prisma.guildModule.upsert({
      where: {
        guildId_module: {
          guildId,
          module: key,
        },
      },
      create: {
        guildId,
        module: key,
        enabled,
      },
      update: {
        enabled,
      },
    });
  }

  async getSettings<TSchema extends z.ZodObject>(
    guildId: string,
    definition: ModuleDefinition<TSchema>,
  ): Promise<z.infer<TSchema>> {
    const entry = await this.prisma.guildModule.findUnique({
      where: {
        guildId_module: {
          guildId,
          module: definition.key,
        },
      },
    });
    const raw = entry?.settings ?? {};
    const result = definition.settingsSchema.safeParse(raw);
    if (result.success) {
      return result.data;
    }
    this.logger.warn(
      `Invalid settings for module "${definition.key}" on Server ${guildId}:\n${result.error.message}`,
    );
    return definition.settingsSchema.parse({});
  }

  async updateSettings<TSchema extends z.ZodObject>(
    guildId: string,
    definition: ModuleDefinition<TSchema>,
    patch: Partial<z.infer<TSchema>>,
  ): Promise<z.infer<TSchema>> {
    const currentSettings = await this.getSettings(guildId, definition);
    const newSettings = { ...currentSettings, ...nullToUndefined(patch) };

    const result = definition.settingsSchema.safeParse(newSettings);

    const details = result?.error?.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    if (!result.success) {
      throw new Error(details);
    }

    const settingsJson = result.data as Prisma.InputJsonObject;

    await this.prisma.guildModule.upsert({
      where: {
        guildId_module: {
          guildId,
          module: definition.key,
        },
      },
      create: {
        guildId,
        module: definition.key,
        settings: settingsJson,
      },
      update: {
        settings: settingsJson,
      },
    });

    return result.data;
  }
}
