import { describe, expect, it } from 'vitest';
import { generateToken, hashToken } from './session-token.js';

describe('generateToken', () => {
  it('returns a different value every time', () => {
    expect(generateToken()).not.toBe(generateToken());
  });

  it('is 43 characters long (32 random bytes in base64url)', () => {
    expect(generateToken()).toHaveLength(43);
  });

  it('only uses characters that are safe in cookies and URLs', () => {
    expect(generateToken()).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});

describe('hashToken', () => {
  it('returns the same hash for the same token', () => {
    expect(hashToken('some-token')).toBe(hashToken('some-token'));
  });

  it('returns different hashes for different tokens', () => {
    expect(hashToken('token-a')).not.toBe(hashToken('token-b'));
  });

  it('returns the SHA-256 hash as hex (official test vector)', () => {
    expect(hashToken('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
  });

  it('does not contain the original token', () => {
    const token = generateToken();
    expect(hashToken(token)).not.toContain(token);
  });
});
