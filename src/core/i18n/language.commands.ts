import { Injectable } from '@nestjs/common';
import {
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
} from 'discord.js';
import {
  Context,
  Options,
  SlashCommand,
  type SlashCommandContext,
  StringOption,
} from 'necord';
import { I18nService } from './i18n.service.js';
import { LOCALE_NAMES, resolveLocale, SUPPORTED_LOCALES } from './locales.js';
import { languageCommandsTranslations } from './translations/index.js';

export class LanguageDto {
  @StringOption({
    name: 'language',
    description: 'The new server language',
    description_localizations: { de: 'Die neue Server-Sprache' },
    required: false,
    choices: SUPPORTED_LOCALES.map((locale) => ({
      name: LOCALE_NAMES[locale],
      value: locale,
    })),
  })
  language?: string;
}

@Injectable()
export class LanguageCommands {
  constructor(private readonly i18n: I18nService) {}

  @SlashCommand({
    name: 'language',
    description: 'Show or change the server language',
    descriptionLocalizations: { de: 'Zeige oder ändere die Server-Sprache' },
    defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
    contexts: [InteractionContextType.Guild],
  })
  public async onLanguage(
    @Context() [interaction]: SlashCommandContext,
    @Options() { language }: LanguageDto,
  ) {
    const t = languageCommandsTranslations[resolveLocale(interaction.locale)];
    const guildId = interaction.guildId!;

    if (!language) {
      const currentLanguage = await this.i18n.getGuildLocale(guildId);
      return interaction.reply({
        content: t.current({ language: LOCALE_NAMES[currentLanguage] }),
        flags: MessageFlags.Ephemeral,
      });
    }
    const newLocale = resolveLocale(language);
    await this.i18n.setGuildLocale(guildId, newLocale);
    return interaction.reply({
      content: t.changed({ language: LOCALE_NAMES[newLocale] }),
      flags: MessageFlags.Ephemeral,
    });
  }
}
