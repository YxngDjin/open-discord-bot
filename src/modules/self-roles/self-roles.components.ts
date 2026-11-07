import { Injectable } from '@nestjs/common';
import { MessageFlags } from 'discord.js';
import {
  Button,
  type ButtonContext,
  ComponentParam,
  Context,
  SelectedStrings,
  StringSelect,
  type StringSelectContext,
} from 'necord';
import { resolveLocale } from '../../core/i18n/locales.js';
import { selfRolesTranslations } from './i18n/index.js';
import { SelfRolesService } from './self-roles.service.js';

@Injectable()
export class SelfRolesComponents {
  constructor(private readonly selfRolesService: SelfRolesService) {}

  @Button('self-roles/:panelId/:roleId')
  async onButton(
    @Context() [interaction]: ButtonContext,
    @ComponentParam('panelId') panelId: string,
    @ComponentParam('roleId') roleId: string,
  ) {
    if (!interaction.inCachedGuild()) return;

    const member = interaction.member;
    const id = Number(panelId);

    const result = await this.selfRolesService.toggleRole(member, id, roleId);

    // Answers go only to the clicking member, so use their Discord language.
    const t = selfRolesTranslations[resolveLocale(interaction.locale)].clicks;

    return interaction.reply({
      content: t[result]({ role: `<@&${roleId}>` }),
      flags: MessageFlags.Ephemeral,
    });
  }

  @StringSelect('self-roles/:panelId')
  async onSelect(
    @Context() [interaction]: StringSelectContext,
    @ComponentParam('panelId') panelId: string,
    @SelectedStrings() selected: string[],
  ) {
    if (!interaction.inCachedGuild()) return;

    const result = await this.selfRolesService.syncRoles(
      interaction.member,
      Number(panelId),
      selected,
    );

    // Answers go only to the clicking member, so use their Discord language.
    const t = selfRolesTranslations[resolveLocale(interaction.locale)].sync;

    return interaction.reply({
      content: t[result],
      flags: MessageFlags.Ephemeral,
    });
  }
}
