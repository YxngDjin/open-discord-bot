import { describe, expect, it } from 'vitest';
import { isLeaderboardDue } from './leaderboard.schedule.js';

const today = '2026-11-07';
const yesterday = '2026-11-06';

describe('isLeaderboardDue', () => {
  it('is not due before the set time', () => {
    expect(
      isLeaderboardDue({ date: today, time: '17:59' }, '18:00', yesterday),
    ).toBe(false);
  });

  it('is due exactly at the set time', () => {
    expect(
      isLeaderboardDue({ date: today, time: '18:00' }, '18:00', yesterday),
    ).toBe(true);
  });

  it('catches up later the same day if the exact minute was missed', () => {
    expect(
      isLeaderboardDue({ date: today, time: '18:07' }, '18:00', yesterday),
    ).toBe(true);
  });

  it('is not due again after it was posted today', () => {
    expect(
      isLeaderboardDue({ date: today, time: '18:01' }, '18:00', today),
    ).toBe(false);
  });

  it('is due when it was never posted', () => {
    expect(
      isLeaderboardDue({ date: today, time: '18:00' }, '18:00', null),
    ).toBe(true);
  });

  it('compares times correctly across hours', () => {
    // As plain text, "9:30" > "18:00" would be true, "09:30" is not
    expect(
      isLeaderboardDue({ date: today, time: '09:30' }, '18:00', yesterday),
    ).toBe(false);
  });

  it('works for midnight', () => {
    expect(
      isLeaderboardDue({ date: today, time: '00:00' }, '00:00', yesterday),
    ).toBe(true);
  });
});
