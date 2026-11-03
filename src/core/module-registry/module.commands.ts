import { Injectable } from '@nestjs/common';
import {
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
} from 'discord.js';
import {
  Context,
  createCommandGroupDecorator,
  Options,
  type SlashCommandContext,
  StringOption,
  Subcommand,
} from 'necord';
import { ModuleRegistryService } from './module-registry.service.js';
import { ModuleSettingsService } from './module-settings.service.js';
import { resolveLocale } from '../i18n/locales.js';
import { moduleCommandsTranslations } from './i18n/index.js';

export const ModuleCommandsDecorator = createCommandGroupDecorator({
  name: 'module',
  description: "Manage the bot's modules on this server",
  descriptionLocalizations: {
    de: 'Verwalte die Module des Bots auf diesem Server',
  },
  defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
  contexts: [InteractionContextType.Guild],
});

export class ModuleKeyDto {
  @StringOption({
    name: 'module',
    description: 'The module to enable or disable',
    required: true,
  })
  module: string;
}

@Injectable()
@ModuleCommandsDecorator()
export class ModuleCommands {
  constructor(
    private readonly registry: ModuleRegistryService,
    private readonly settings: ModuleSettingsService,
  ) {}

  @Subcommand({
    name: 'list',
    description: 'Show all modules and whether they are enabled',
    descriptionLocalizations: {
      de: 'Zeige alle Module und ob sie aktiviert sind',
    },
  })
  public async onList(@Context() [interaction]: SlashCommandContext) {
    const guildId = interaction.guildId!;
    const locale = resolveLocale(interaction.locale);
    const t = moduleCommandsTranslations[locale];

    const lines = await Promise.all(
      this.registry.getAll().map(async (definition) => {
        const isOn = await this.settings.isEnabled(guildId, definition.key);
        return `${definition.key} ${isOn ? '✅' : '❌'}`;
      }),
    );

    if (lines.length === 0) {
      return interaction.reply({
        content: t.noModules,
        flags: MessageFlags.Ephemeral,
      });
    }

    return interaction.reply({
      content: lines.join('\n'),
      flags: MessageFlags.Ephemeral,
    });
  }

  @Subcommand({
    name: 'enable',
    description: 'Enable a module on this server',
    descriptionLocalizations: {
      de: 'Aktiviere ein Modul auf diesem Server',
    },
  })
  public async onEnable(
    @Context() [interaction]: SlashCommandContext,
    @Options() { module }: ModuleKeyDto,
  ) {
    const locale = resolveLocale(interaction.locale!);
    const t = moduleCommandsTranslations[locale];

    const definition = this.registry.get(module);
    if (!definition) {
      return interaction.reply({
        content: t.missingModule({ module }),
        flags: MessageFlags.Ephemeral,
      });
    }
    await this.settings.setEnabled(interaction.guildId!, module, true);
    return interaction.reply({
      content: t.enabled({ module }),
      flags: MessageFlags.Ephemeral,
    });
  }

  @Subcommand({
    name: 'disable',
    description: 'Disable a module on this server',
    descriptionLocalizations: {
      de: 'Deaktiviere ein Modul auf diesem Server',
    },
  })
  public async onDisable(
    @Context() [interaction]: SlashCommandContext,
    @Options() { module }: ModuleKeyDto,
  ) {
    const locale = resolveLocale(interaction.locale!);
    const t = moduleCommandsTranslations[locale];
    const definition = this.registry.get(module);
    if (!definition) {
      return interaction.reply({
        content: t.missingModule({ module }),
        flags: MessageFlags.Ephemeral,
      });
    }
    await this.settings.setEnabled(interaction.guildId!, module, false);
    return interaction.reply({
      content: t.disabled({ module }),
      flags: MessageFlags.Ephemeral,
    });
  }
}
