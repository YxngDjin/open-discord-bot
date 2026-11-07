import { describe, expect, it } from 'vitest';
import { levelFromXp, progressInLevel, xpForNextLevel } from './xp.formula.js';

// Expected values are calculated by hand with 5 × level² + 50 × level + 100,
// not copied from the code, so the tests really check the formula.

describe('xpForNextLevel', () => {
  it('needs 100 XP to go from level 0 to level 1', () => {
    expect(xpForNextLevel(0)).toBe(100);
  });

  it('needs 155 XP to go from level 1 to level 2', () => {
    expect(xpForNextLevel(1)).toBe(155);
  });

  it('needs 220 XP to go from level 2 to level 3', () => {
    expect(xpForNextLevel(2)).toBe(220);
  });

  it('grows quadratically for higher levels', () => {
    expect(xpForNextLevel(10)).toBe(1100);
  });
});

describe('progressInLevel', () => {
  it('starts at level 0 with no XP', () => {
    expect(progressInLevel(0)).toEqual({ level: 0, current: 0, needed: 100 });
  });

  it('stays at level 0 one XP before the level up', () => {
    expect(progressInLevel(99)).toEqual({ level: 0, current: 99, needed: 100 });
  });

  it('reaches level 1 at exactly 100 XP', () => {
    expect(progressInLevel(100)).toEqual({ level: 1, current: 0, needed: 155 });
  });

  it('stays at level 1 one XP before level 2', () => {
    // 100 + 155 = 255 XP for level 2
    expect(progressInLevel(254)).toEqual({
      level: 1,
      current: 154,
      needed: 155,
    });
  });

  it('reaches level 2 at exactly 255 XP', () => {
    expect(progressInLevel(255)).toEqual({ level: 2, current: 0, needed: 220 });
  });

  it('keeps the rest as progress in the current level', () => {
    expect(progressInLevel(300)).toEqual({
      level: 2,
      current: 45,
      needed: 220,
    });
  });
});

describe('levelFromXp', () => {
  it('returns the same level as progressInLevel', () => {
    for (const xp of [0, 99, 100, 254, 255, 300, 10_000]) {
      expect(levelFromXp(xp)).toBe(progressInLevel(xp).level);
    }
  });
});
