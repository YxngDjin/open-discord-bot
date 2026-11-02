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

export const ModuleCommandsDecorator = createCommandGroupDecorator({
  name: 'module',
  description: "Manage the bot's modules on this server",
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
  })
  public async onList(@Context() [interaction]: SlashCommandContext) {
    const guildId = interaction.guildId!;

    const lines = await Promise.all(
      this.registry.getAll().map(async (definition) => {
        const isOn = await this.settings.isEnabled(guildId, definition.key);

        return `${definition.key} ${isOn ? '✅' : '❌'}`;
      }),
    );

    return interaction.reply({
      content: lines.join('\n'),
      flags: MessageFlags.Ephemeral,
    });
  }

  @Subcommand({ name: 'enable', description: 'Enable a module on this server' })
  public async onEnable(
    @Context() [interaction]: SlashCommandContext,
    @Options() { module }: ModuleKeyDto,
  ) {
    const definition = this.registry.get(module);
    if (!definition) {
      return interaction.reply({
        content: `Module "${module}" does not exist`,
        flags: MessageFlags.Ephemeral,
      });
    }
    await this.settings.setEnabled(interaction.guildId!, module, true);
    return interaction.reply({
      content: `✅ Enabled module "${module}"`,
      flags: MessageFlags.Ephemeral,
    });
  }

  @Subcommand({
    name: 'disable',
    description: 'Disable a module on this server',
  })
  public async onDisable(
    @Context() [interaction]: SlashCommandContext,
    @Options() { module }: ModuleKeyDto,
  ) {
    const definition = this.registry.get(module);
    if (!definition) {
      return interaction.reply({
        content: `Module "${module}" does not exist`,
        flags: MessageFlags.Ephemeral,
      });
    }
    await this.settings.setEnabled(interaction.guildId!, module, false);
    return interaction.reply({
      content: `❌ Disabled module "${module}"`,
      flags: MessageFlags.Ephemeral,
    });
  }
}
