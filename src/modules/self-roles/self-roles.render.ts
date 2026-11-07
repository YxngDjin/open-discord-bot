import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js';
import type { SelfRolePanelGetPayload } from '../../generated/prisma/models.js';

export type PanelWithOptions = SelfRolePanelGetPayload<{
  include: { options: true };
}>;

export const renderPanel = (panel: PanelWithOptions) => {
  const embed = new EmbedBuilder()
    .setTitle(panel.title)
    .setDescription(panel.description)
    .setColor(Colors.Blurple);

  return {
    embeds: [embed],
    components:
      panel.mode === 'BUTTONS' ? buildButtons(panel) : buildSelectMenu(panel),
  };
};

const buildButtons = (panel: PanelWithOptions) => {
  const buttons = panel.options.map((option) => {
    const button = new ButtonBuilder()
      .setLabel(option.label)
      .setCustomId(`self-roles/${panel.id}/${option.roleId}`)
      .setStyle(ButtonStyle.Secondary);

    if (option.emoji) button.setEmoji(option.emoji);

    return button;
  });

  const rows: ActionRowBuilder<ButtonBuilder>[] = [];

  for (let i = 0; i < buttons.length; i += 5) {
    const chunk = buttons.slice(i, i + 5);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(...chunk);
    rows.push(row);
  }

  return rows;
};

const buildSelectMenu = (panel: PanelWithOptions) => {
  if (panel.options.length === 0) return [];
  const maxValues = Math.min(
    panel.maxRoles ?? panel.options.length,
    panel.options.length,
  );

  // Eine Zeile pro Rolle
  const entries = panel.options.map((option) => {
    const entry = new StringSelectMenuOptionBuilder()
      .setLabel(option.label)
      .setValue(option.roleId);

    if (option.emoji) entry.setEmoji(option.emoji);

    return entry;
  });

  // Das eine Menü, mit allen Einträgen
  const menu = new StringSelectMenuBuilder()
    .setCustomId(`self-roles/${panel.id}`)
    .setMinValues(0)
    .setMaxValues(maxValues)
    .addOptions(...entries);

  // Das Menü braucht wie die Buttons eine Zeile
  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    menu,
  );

  return [row];
};
