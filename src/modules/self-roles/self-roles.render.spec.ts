import { ComponentType } from 'discord.js';
import { describe, expect, it } from 'vitest';
import { type PanelWithOptions, renderPanel } from './self-roles.render.js';

/** A panel as Prisma would return it, with `count` roles. */
const makePanel = (
  count: number,
  overrides: Partial<PanelWithOptions> = {},
): PanelWithOptions => ({
  id: 1,
  guildId: 'guild-1',
  channelId: 'channel-1',
  messageId: null,
  title: 'Pick your roles',
  description: 'Click a button',
  mode: 'BUTTONS',
  maxRoles: null,
  createdAt: new Date(0),
  updatedAt: new Date(0),
  options: Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    panelId: 1,
    roleId: `role-${index + 1}`,
    label: `Role ${index + 1}`,
    emoji: null,
    position: index,
  })),
  ...overrides,
});

/** The rendered components as plain JSON, like Discord receives them. */
const componentsOf = (panel: PanelWithOptions) =>
  renderPanel(panel).components.map((row) => row.toJSON());

describe('renderPanel', () => {
  it('puts title and description into the embed', () => {
    const [embed] = renderPanel(makePanel(1)).embeds;
    expect(embed.data.title).toBe('Pick your roles');
    expect(embed.data.description).toBe('Click a button');
  });

  describe('buttons', () => {
    it('puts at most 5 buttons in a row', () => {
      const rows = componentsOf(makePanel(7));
      expect(rows).toHaveLength(2);
      expect(rows[0].components).toHaveLength(5);
      expect(rows[1].components).toHaveLength(2);
    });

    it('fills 5 rows with the maximum of 25 roles', () => {
      const rows = componentsOf(makePanel(25));
      expect(rows).toHaveLength(5);
      expect(rows.every((row) => row.components.length === 5)).toBe(true);
    });

    it('puts panel and role id into the custom id', () => {
      const [row] = componentsOf(makePanel(1));
      expect(row.components[0]).toMatchObject({
        type: ComponentType.Button,
        custom_id: 'self-roles/1/role-1',
        label: 'Role 1',
      });
    });

    it('only sets an emoji when the option has one', () => {
      const panel = makePanel(2);
      panel.options[0].emoji = '🎮';
      const [row] = componentsOf(panel);
      expect(row.components[0]).toMatchObject({ emoji: { name: '🎮' } });
      // toJSON() keeps the key with undefined, so check the value instead
      expect(row.components[1]).not.toMatchObject({
        emoji: expect.anything(),
      });
    });

    it('renders no rows for a panel without roles', () => {
      expect(componentsOf(makePanel(0))).toEqual([]);
    });
  });

  describe('select menu', () => {
    const selectOf = (panel: PanelWithOptions) => {
      const rows = componentsOf({ ...panel, mode: 'SELECT' });
      expect(rows).toHaveLength(1);
      return rows[0].components[0];
    };

    it('renders one menu with only the panel id in the custom id', () => {
      expect(selectOf(makePanel(3))).toMatchObject({
        type: ComponentType.StringSelect,
        custom_id: 'self-roles/1',
        min_values: 0,
      });
    });

    it('uses the role ids as values', () => {
      const menu = selectOf(makePanel(2));
      expect(menu).toMatchObject({
        options: [
          { label: 'Role 1', value: 'role-1' },
          { label: 'Role 2', value: 'role-2' },
        ],
      });
    });

    it('allows all roles when maxRoles is not set', () => {
      expect(selectOf(makePanel(3))).toMatchObject({ max_values: 3 });
    });

    it('respects maxRoles', () => {
      expect(selectOf(makePanel(3, { maxRoles: 2 }))).toMatchObject({
        max_values: 2,
      });
    });

    it('never allows more choices than there are roles', () => {
      // Discord rejects max_values above the number of options
      expect(selectOf(makePanel(3, { maxRoles: 5 }))).toMatchObject({
        max_values: 3,
      });
    });

    it('renders no menu for a panel without roles', () => {
      // Discord rejects select menus without options
      expect(componentsOf(makePanel(0, { mode: 'SELECT' }))).toEqual([]);
    });
  });
});
