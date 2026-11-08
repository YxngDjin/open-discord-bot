import { describe, expect, it } from 'vitest';
import { chunkLines } from './chunk-lines.js';

describe('chunkLines', () => {
  it('puts everything into one block when it fits', () => {
    expect(chunkLines(['a', 'b', 'c'], 100)).toEqual(['a\nb\nc']);
  });

  it('starts a new block when the limit would be exceeded', () => {
    // "aaa\nbbb" is 7 characters, adding "\nccc" would make it 11
    expect(chunkLines(['aaa', 'bbb', 'ccc'], 8)).toEqual(['aaa\nbbb', 'ccc']);
  });

  it('allows a block of exactly the limit', () => {
    expect(chunkLines(['aaa', 'bbb'], 7)).toEqual(['aaa\nbbb']);
  });

  it('never returns a block longer than the limit', () => {
    const items = Array.from({ length: 50 }, (_, i) => `line number ${i}`);
    const chunks = chunkLines(items, 100);

    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(100);
    }
  });

  it('never cuts an item in half', () => {
    const items = Array.from({ length: 50 }, (_, i) => `line number ${i}`);
    const chunks = chunkLines(items, 100);

    expect(chunks.flatMap((chunk) => chunk.split('\n'))).toEqual(items);
  });

  it('uses a custom separator', () => {
    expect(chunkLines(['a', 'b', 'c'], 3, ' ')).toEqual(['a b', 'c']);
  });

  it('returns no blocks for no items', () => {
    expect(chunkLines([], 100)).toEqual([]);
  });

  it('shortens a single item that is longer than the limit', () => {
    expect(chunkLines(['short', 'x'.repeat(20)], 10)).toEqual([
      'short',
      'x'.repeat(10),
    ]);
  });
});
