import { Injectable, Logger } from '@nestjs/common';
import { GuildMember, PartialGuildMember } from 'discord.js';
import { ModuleSettingsService } from '../../core/module-registry/module-settings.service.js';
import { I18nService } from '../../core/i18n/i18n.service.js';
import { welcomeModule } from './welcome.definition.js';
import { welcomeModuleTranslations } from './i18n/index.js';
import { renderTemplate, TemplateValues } from './welcome.template.js';

type AnyMember = GuildMember | PartialGuildMember;

@Injectable()
export class WelcomeService {
  private readonly logger = new Logger(WelcomeService.name);

  constructor(
    private readonly moduleSettings: ModuleSettingsService,
    private readonly i18n: I18nService,
  ) {}

  async handleJoin(member: GuildMember) {
    this.logger.debug(
      `handleJoin: ${member.user.username} joined ${member.guild.name}`,
    );
    const guildId = member.guild.id;

    if (!(await this.moduleSettings.isEnabled(guildId, welcomeModule.key)))
      return;

    const settings = await this.moduleSettings.getSettings(
      guildId,
      welcomeModule,
    );

    if (settings.channelId) {
      const t =
        welcomeModuleTranslations[await this.i18n.getGuildLocale(guildId)];
      const text = renderTemplate(
        settings.message ?? t.defaultWelcome,
        this.getValues(member),
      );
      await this.sendToChannel(member, settings.channelId, text);
    }

    if (settings.autoRoleIds.length > 0) {
      setTimeout(() => {
        void this.assignRoles(member, settings.autoRoleIds);
      }, settings.autoRoleDelaySeconds * 1000);
    }
  }

  async handleLeave(member: AnyMember) {
    const guildId = member.guild.id;
    if (!(await this.moduleSettings.isEnabled(guildId, welcomeModule.key)))
      return;

    const settings = await this.moduleSettings.getSettings(
      guildId,
      welcomeModule,
    );
    if (!settings.goodbyeEnabled || !settings.channelId) return;

    const t =
      welcomeModuleTranslations[await this.i18n.getGuildLocale(guildId)];
    const text = renderTemplate(
      settings.goodbyeMessage ?? t.defaultGoodbye,
      this.getValues(member),
    );
    await this.sendToChannel(member, settings.channelId, text);
  }

  private getValues(member: AnyMember): TemplateValues {
    return {
      user: member.toString(),
      username: member.user.username,
      server: member.guild.name,
      memberCount: member.guild.memberCount,
    };
  }

  private async sendToChannel(
    member: AnyMember,
    channelId: string,
    text: string,
  ) {
    const channel = member.guild.channels.cache.get(channelId);
    if (!channel?.isTextBased()) {
      this.logger.warn(
        `Channel ${channelId} not found or not a text channel (guild ${member.guild.id})`,
      );
      return;
    }

    try {
      await channel.send(text);
    } catch (error) {
      this.logger.warn(
        `Could not send message in guild ${member.guild.id}: ${String(error)}`,
      );
    }
  }

  private async assignRoles(member: GuildMember, roleIds: string[]) {
    try {
      await member.roles.add(roleIds);
    } catch (error) {
      this.logger.warn(
        `Could not assign auto roles in guild ${member.guild.id}: ${String(error)}`,
      );
    }
  }
}
