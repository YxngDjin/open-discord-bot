import { describe, expect, it } from 'vitest';
import { isValidTimezone, localDateTime, TIMEZONES } from './timezone.js';

describe('isValidTimezone', () => {
  it('accepts IANA time zones', () => {
    expect(isValidTimezone('Europe/Berlin')).toBe(true);
    expect(isValidTimezone('America/New_York')).toBe(true);
  });

  it('accepts UTC, our default, although it is not in the Intl list', () => {
    expect(isValidTimezone('UTC')).toBe(true);
  });

  it('ignores upper and lower case', () => {
    // Intl accepts this, so admins don't have to type it exactly
    expect(isValidTimezone('europe/berlin')).toBe(true);
  });

  it('rejects unknown time zones', () => {
    expect(isValidTimezone('Mars/Olympus')).toBe(false);
  });

  it('rejects an empty text', () => {
    expect(isValidTimezone('')).toBe(false);
  });
});

describe('TIMEZONES', () => {
  it('starts with UTC', () => {
    expect(TIMEZONES[0]).toBe('UTC');
  });

  it('contains UTC only once', () => {
    expect(TIMEZONES.filter((timezone) => timezone === 'UTC')).toHaveLength(1);
  });

  it('contains the common IANA time zones', () => {
    expect(TIMEZONES).toContain('Europe/Berlin');
    expect(TIMEZONES).toContain('America/New_York');
  });

  it('only contains valid time zones', () => {
    expect(TIMEZONES.every(isValidTimezone)).toBe(true);
  });
});

describe('localDateTime', () => {
  // 19:30 UTC on 7 November 2026 (winter time in Europe)
  const winter = new Date('2026-11-07T19:30:00Z');

  it('returns date and time in UTC', () => {
    expect(localDateTime(winter, 'UTC')).toEqual({
      date: '2026-11-07',
      time: '19:30',
    });
  });

  it('adds one hour for Berlin in winter', () => {
    expect(localDateTime(winter, 'Europe/Berlin')).toEqual({
      date: '2026-11-07',
      time: '20:30',
    });
  });

  it('adds two hours for Berlin in summer (daylight saving time)', () => {
    const summer = new Date('2026-07-07T19:30:00Z');
    expect(localDateTime(summer, 'Europe/Berlin')).toEqual({
      date: '2026-07-07',
      time: '21:30',
    });
  });

  it('subtracts hours for time zones west of UTC', () => {
    expect(localDateTime(winter, 'America/New_York')).toEqual({
      date: '2026-11-07',
      time: '14:30',
    });
  });

  it('switches to the next day after local midnight', () => {
    // Still the 7th in UTC, but already the 8th in Berlin
    const lateEvening = new Date('2026-11-07T23:30:00Z');
    expect(localDateTime(lateEvening, 'Europe/Berlin')).toEqual({
      date: '2026-11-08',
      time: '00:30',
    });
  });

  it('shows midnight as 00:00, not 24:00', () => {
    const midnightBerlin = new Date('2026-11-07T23:00:00Z');
    expect(localDateTime(midnightBerlin, 'Europe/Berlin').time).toBe('00:00');
  });

  it('pads single-digit months, days, hours and minutes', () => {
    expect(localDateTime(new Date('2026-01-02T03:04:00Z'), 'UTC')).toEqual({
      date: '2026-01-02',
      time: '03:04',
    });
  });
});
