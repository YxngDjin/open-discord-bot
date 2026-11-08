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
import { describeCommand, describeOption } from '../i18n/localize.js';
import { translations } from '../i18n/translations/index.js';

export const ModuleCommandsDecorator = createCommandGroupDecorator({
  name: 'module',
  ...describeCommand((t) => t.module.commands.module),
  defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
  contexts: [InteractionContextType.Guild],
});

export class ModuleKeyDto {
  @StringOption({
    name: 'module',
    ...describeOption((t) => t.module.options.module),
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
    ...describeCommand((t) => t.module.commands.list),
  })
  public async onList(@Context() [interaction]: SlashCommandContext) {
    const guildId = interaction.guildId!;
    const locale = resolveLocale(interaction.locale);
    const t = translations[locale];

    const lines = await Promise.all(
      this.registry.getAll().map(async (definition) => {
        const isOn = await this.settings.isEnabled(guildId, definition.key);
        return `${isOn ? '✅' : '❌'} ${definition.name[locale]} (\`${definition.key}\`)`;
      }),
    );

    if (lines.length === 0) {
      return interaction.reply({
        content: t.module.noModules,
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
    ...describeCommand((t) => t.module.commands.enable),
  })
  public async onEnable(
    @Context() [interaction]: SlashCommandContext,
    @Options() { module }: ModuleKeyDto,
  ) {
    const locale = resolveLocale(interaction.locale);
    const t = translations[locale];

    const definition = this.registry.get(module);
    if (!definition) {
      return interaction.reply({
        content: t.module.missingModule({ module }),
        flags: MessageFlags.Ephemeral,
      });
    }
    await this.settings.setEnabled(interaction.guildId!, module, true);
    return interaction.reply({
      content: t.module.enabled({ module }),
      flags: MessageFlags.Ephemeral,
    });
  }

  @Subcommand({
    name: 'disable',
    ...describeCommand((t) => t.module.commands.disable),
  })
  public async onDisable(
    @Context() [interaction]: SlashCommandContext,
    @Options() { module }: ModuleKeyDto,
  ) {
    const locale = resolveLocale(interaction.locale);
    const t = translations[locale];
    const definition = this.registry.get(module);
    if (!definition) {
      return interaction.reply({
        content: t.module.missingModule({ module }),
        flags: MessageFlags.Ephemeral,
      });
    }
    await this.settings.setEnabled(interaction.guildId!, module, false);
    return interaction.reply({
      content: t.module.disabled({ module }),
      flags: MessageFlags.Ephemeral,
    });
  }
}
