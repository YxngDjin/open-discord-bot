import { Injectable, Logger } from '@nestjs/common';
import {
  type ApplicationCommand,
  ApplicationCommandOptionType,
  Colors,
  EmbedBuilder,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
} from 'discord.js';
import {
  Context,
  Options,
  SlashCommand,
  type SlashCommandContext,
} from 'necord';
import { I18nService } from '../../core/i18n/i18n.service.js';
import { resolveLocale } from '../../core/i18n/locales.js';
import { ModuleRegistryService } from '../../core/module-registry/module-registry.service.js';
import { ModuleSettingsService } from '../../core/module-registry/module-settings.service.js';
import { translations } from '../../core/i18n/translations/index.js';
import { describeCommand } from '../../core/i18n/localize.js';
import { ClearDto, UserInfoDto } from './dto/dto.js';
import { chunkLines } from '../../core/utils/chunk-lines.js';

/** Discord timestamp with date and relative time, e.g. "14 November 2023 (3 years ago)". */
const timestamp = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000);
  return `<t:${seconds}:D> (<t:${seconds}:R>)`;
};

@Injectable()
export class UtilityCommands {
  private readonly logger = new Logger(UtilityCommands.name);

  constructor(
    private readonly moduleRegistry: ModuleRegistryService,
    private readonly moduleSettings: ModuleSettingsService,
    private readonly i18n: I18nService,
  ) {}

  @SlashCommand({
    name: 'ping',
    ...describeCommand((t) => t.utility.commands.ping),
  })
  public async onPing(@Context() [interaction]: SlashCommandContext) {
    return interaction.reply(`🏓 Pong! ${interaction.client.ws.ping} ms`);
  }

  @SlashCommand({
    name: 'serverinfo',
    ...describeCommand((t) => t.utility.commands.serverinfo),
    contexts: [InteractionContextType.Guild],
  })
  public async onServerInfo(@Context() [interaction]: SlashCommandContext) {
    if (!interaction.inCachedGuild()) return;
    const guild = interaction.guild;

    // Public answer → server language
    const locale = await this.i18n.getGuildLocale(guild.id);
    const t = translations[locale].utility.serverinfo;

    const embed = new EmbedBuilder()
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: t.owner, value: `<@${guild.ownerId}>`, inline: true },
        { name: t.members, value: String(guild.memberCount), inline: true },
        {
          name: t.channels,
          value: String(guild.channels.cache.size),
          inline: true,
        },
        // - 1: roles.cache also contains @everyone
        {
          name: t.roles,
          value: String(guild.roles.cache.size - 1),
          inline: true,
        },
        {
          name: t.boosts,
          value: String(guild.premiumSubscriptionCount ?? 0),
          inline: true,
        },
        { name: t.created, value: timestamp(guild.createdTimestamp) },
      )
      .setColor(Colors.Blurple);

    return interaction.reply({ embeds: [embed] });
  }

  @SlashCommand({
    name: 'userinfo',
    ...describeCommand((t) => t.utility.commands.userinfo),
    contexts: [InteractionContextType.Guild],
  })
  public async onUserInfo(
    @Context() [interaction]: SlashCommandContext,
    @Options() { user }: UserInfoDto,
  ) {
    if (!interaction.inCachedGuild()) return;

    const member = user
      ? await interaction.guild.members.fetch(user.id).catch(() => null)
      : interaction.member;

    if (!member) {
      // Only the asking person sees this → their language
      const t =
        translations[resolveLocale(interaction.locale)].utility.userinfo;
      return interaction.reply({
        content: t.notMember,
        flags: MessageFlags.Ephemeral,
      });
    }

    // Public answer → server language
    const locale = await this.i18n.getGuildLocale(interaction.guild.id);
    const t = translations[locale].utility.userinfo;

    // All roles except @everyone, highest first
    const roleMentions = member.roles.cache
      .filter((role) => role.id !== member.guild.id)
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString());

    const chunks = chunkLines(roleMentions, 1000, ' ');
    const showCount = chunks.length > 0 ? chunks[0].split(' ').length : 0;
    const hiddenCount = roleMentions.length - showCount;

    const roles =
      hiddenCount > 0
        ? `${chunks[0]} ${t.moreRoles({ count: hiddenCount })}`
        : (chunks[0] ?? '');

    const embed = new EmbedBuilder()
      .setTitle(member.displayName)
      .setThumbnail(member.displayAvatarURL())
      .addFields(
        { name: t.username, value: member.user.username, inline: true },
        { name: t.id, value: member.id, inline: true },
        // Without roles the text is empty, and Discord rejects empty field values
        { name: t.roles, value: roles || t.none },
        { name: t.created, value: timestamp(member.user.createdTimestamp) },
        // joinedTimestamp can be null in rare cases, e.g. with incomplete member data
        {
          name: t.joined,
          value: member.joinedTimestamp
            ? timestamp(member.joinedTimestamp)
            : t.unknown,
        },
      )
      .setColor(member.displayColor);

    return interaction.reply({ embeds: [embed] });
  }

  @SlashCommand({
    name: 'clear',
    ...describeCommand((t) => t.utility.commands.clear),
    contexts: [InteractionContextType.Guild],
    defaultMemberPermissions: [PermissionFlagsBits.ManageMessages],
  })
  public async onClear(
    @Context() [interaction]: SlashCommandContext,
    @Options() { amount }: ClearDto,
  ) {
    if (!interaction.inCachedGuild()) return;
    const t = translations[resolveLocale(interaction.locale)].utility.clear;

    const channel = interaction.channel;
    if (!channel?.isTextBased()) {
      return interaction.reply({
        content: t.wrongChannel,
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      // true = skip messages older than 14 days. Discord can't bulk delete
      // them, and without it the whole call would fail.
      const deleted = await channel.bulkDelete(amount, true);
      return interaction.reply({
        content: t.deleted({ count: deleted.size }),
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      this.logger.warn(
        `Could not delete messages in guild ${interaction.guild.id}: ${String(error)}`,
      );
      return interaction.reply({
        content: t.failed,
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  @SlashCommand({
    name: 'help',
    ...describeCommand((t) => t.utility.commands.help),
    contexts: [InteractionContextType.Guild],
  })
  public async onHelp(@Context() [interaction]: SlashCommandContext) {
    if (!interaction.inCachedGuild()) return;
    const locale = resolveLocale(interaction.locale);
    const t = translations[locale].utility.help;

    // In development, commands live on the test server, otherwise globally.
    // Fetch both at the same time.
    const [globalCommands, guildCommands] = await Promise.all([
      interaction.client.application.commands.fetch({
        withLocalizations: true,
      }),
      interaction.guild.commands.fetch({ withLocalizations: true }),
    ]);

    // Remove duplicates: a Map keeps every name once.
    // Server commands come last and win.
    const commands = new Map<string, ApplicationCommand>();
    for (const command of [
      ...globalCommands.values(),
      ...guildCommands.values(),
    ]) {
      commands.set(command.name, command);
    }

    // Which modules are enabled on this server? Once up front, not per command.
    const modules = this.moduleRegistry.getAll();
    const enabled = new Set<string>();
    for (const module of modules) {
      if (
        await this.moduleSettings.isEnabled(interaction.guild.id, module.key)
      ) {
        enabled.add(module.key);
      }
    }

    // Description in the user's language, otherwise English
    const describe = (
      description: string,
      localizations?: Partial<Record<string, string | null>> | null,
    ) => localizations?.[interaction.locale] ?? description;

    // Lines per group: module name, or "General" for commands without a module
    const groups = new Map<string, string[]>();

    for (const command of commands.values()) {
      const module = modules.find((m) => m.commands?.includes(command.name));

      // Module disabled → hide
      if (module && !enabled.has(module.key)) continue;

      // Missing permissions → hide
      const required = command.defaultMemberPermissions;
      if (required && !interaction.memberPermissions.has(required)) continue;

      const subcommands = command.options.filter(
        (option) => option.type === ApplicationCommandOptionType.Subcommand,
      );

      // </name sub:id> becomes a clickable command in Discord
      const lines =
        subcommands.length > 0
          ? subcommands.map(
              (sub) =>
                `</${command.name} ${sub.name}:${command.id}> – ${describe(sub.description, sub.descriptionLocalizations)}`,
            )
          : [
              `</${command.name}:${command.id}> – ${describe(command.description, command.descriptionLocalizations)}`,
            ];

      const group = module ? module.name[locale] : t.general;
      groups.set(group, [...(groups.get(group) ?? []), ...lines]);
    }

    const embed = new EmbedBuilder()
      .setTitle(t.title)
      .setColor(Colors.Blurple)
      .setFooter({ text: t.footer })
      .addFields(
        [...groups].flatMap(([group, lines]) =>
          chunkLines(lines, 1024).map((chunk, index) => ({
            name: index === 0 ? group : `${group} (${index + 1})`,
            value: chunk,
          })),
        ),
      );

    return interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    });
  }
}
