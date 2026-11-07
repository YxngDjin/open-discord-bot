import { describe, expect, it } from 'vitest';
import { renderTemplate, type TemplateValues } from './welcome.template.js';

const values: TemplateValues = {
  user: '<@123>',
  username: 'Dennis',
  server: 'Test Server',
  memberCount: 42,
};

describe('renderTemplate', () => {
  it('replaces all placeholders', () => {
    expect(
      renderTemplate(
        'Welcome {user} ({username}) to {server}! You are member {memberCount}.',
        values,
      ),
    ).toBe('Welcome <@123> (Dennis) to Test Server! You are member 42.');
  });

  it('replaces a placeholder that appears more than once', () => {
    expect(renderTemplate('{username}, {username}!', values)).toBe(
      'Dennis, Dennis!',
    );
  });

  it('leaves text without placeholders unchanged', () => {
    expect(renderTemplate('Hello!', values)).toBe('Hello!');
  });

  it('leaves unknown placeholders unchanged', () => {
    expect(renderTemplate('Hi {nickname}', values)).toBe('Hi {nickname}');
  });

  it('inserts names with special replace patterns literally', () => {
    // "$&" means "the matched text" when a string is used as replacement
    expect(
      renderTemplate('Hi {username}', { ...values, username: 'Tom$&Jerry' }),
    ).toBe('Hi Tom$&Jerry');
  });
});
