import { describe, expect, it } from 'vitest';
import { nullToUndefined } from './null-to-undefined.js';

describe('nullToUndefined', () => {
  it('turns null into undefined', () => {
    expect(nullToUndefined({ text: null })).toEqual({ text: undefined });
    expect(nullToUndefined({ text: null })).toHaveProperty('text', undefined);
  });

  it('keeps falsy values that are not null', () => {
    const input = { a: 0, b: false, c: '', d: [] };
    expect(nullToUndefined(input)).toEqual(input);
  });

  it('keeps normal values', () => {
    expect(nullToUndefined({ text: 'hi', count: 5 })).toEqual({
      text: 'hi',
      count: 5,
    });
  });

  it('does not change the original object', () => {
    const input = { text: null };
    nullToUndefined(input);
    expect(input.text).toBeNull();
  });

  it('handles an empty object', () => {
    expect(nullToUndefined({})).toEqual({});
  });
});
