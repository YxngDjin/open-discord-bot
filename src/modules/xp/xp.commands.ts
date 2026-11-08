import { Injectable } from '@nestjs/common';
import { InteractionContextType, MessageFlags } from 'discord.js';
import {
  Context,
  Options,
  SlashCommand,
  type SlashCommandContext,
} from 'necord';
import { resolveLocale } from '../../core/i18n/locales.js';
import { ModuleSettingsService } from '../../core/module-registry/module-settings.service.js';
import { xpTranslations } from './i18n/index.js';
import { xpModule } from './xp.definition.js';
import { XpService } from './xp.service.js';
import { RankDto } from './dto/dto.js';
import { renderLeaderboard } from './leaderboard.render.js';

@Injectable()
export class XpCommands {
  constructor(
    private readonly xp: XpService,
    private readonly moduleSettings: ModuleSettingsService,
  ) {}

  @SlashCommand({
    name: 'rank',
    description: 'Show your level and rank',
    descriptionLocalizations: {
      de: 'Zeige dein Level und deinen Rang',
    },
    contexts: [InteractionContextType.Guild],
  })
  public async onRank(
    @Context() [interaction]: SlashCommandContext,
    @Options() { user }: RankDto,
  ) {
    const locale = resolveLocale(interaction.locale);
    const t = xpTranslations[locale];
    const guildId = interaction.guildId!;
    const target = user ?? interaction.user;

    if (!(await this.moduleSettings.isEnabled(guildId, xpModule.key))) {
      return interaction.reply({
        content: t.moduleDisabled,
        flags: MessageFlags.Ephemeral,
      });
    }

    const rank = await this.xp.getRank(guildId, target.id);
    if (!rank) {
      return interaction.reply({
        content: t.noXp({ user: target.username }),
        flags: MessageFlags.Ephemeral,
      });
    }

    const filled = Math.round(
      (rank.progress.current / rank.progress.needed) * 15,
    );
    const bar = '█'.repeat(filled) + '░'.repeat(15 - filled);

    const lines = [
      t.rankTitle({ user: target.username }),
      t.rankLevel({ level: rank.progress.level, rank: rank.rank }),
      t.rankProgress({
        bar,
        current: rank.progress.current.toLocaleString(locale),
        needed: rank.progress.needed.toLocaleString(locale),
      }),
      t.rankStats({
        messages: rank.entry.messageCount.toLocaleString(locale),
        minutes: rank.entry.voiceMinutes.toLocaleString(locale),
      }),
    ];

    return interaction.reply({ content: lines.join('\n') });
  }

  @SlashCommand({
    name: 'leaderboard',
    description: 'Show the top 10 members',
    descriptionLocalizations: {
      de: 'Zeigen die Top 10 Mitglieder',
    },
    contexts: [InteractionContextType.Guild],
  })
  public async onLeaderboard(@Context() [interaction]: SlashCommandContext) {
    const locale = resolveLocale(interaction.locale);
    const t = xpTranslations[locale];
    const guildId = interaction.guildId!;

    if (!(await this.moduleSettings.isEnabled(guildId, xpModule.key))) {
      return interaction.reply({
        content: t.moduleDisabled,
        flags: MessageFlags.Ephemeral,
      });
    }

    const entries = await this.xp.getLeaderboard(guildId);
    if (!entries.length) {
      return interaction.reply({
        content: t.leaderboardEmpty,
        flags: MessageFlags.Ephemeral,
      });
    }


    return interaction.reply({
      content: renderLeaderboard(entries, locale),
      allowedMentions: { parse: [] },
    });
  }
}
