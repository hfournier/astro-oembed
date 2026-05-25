import { describe, it, expect } from 'vitest';
import { buildSizingStyle } from './sizing';

describe('buildSizingStyle', () => {
  it('uses aspect-ratio without max-width for landscape embeds', () => {
    expect(buildSizingStyle(1920, 1080, null, null)).toBe(
      'aspect-ratio: 1920 / 1080;'
    );
  });

  it('adds max-width for portrait embeds', () => {
    expect(buildSizingStyle(488, 594, null, null)).toBe(
      'aspect-ratio: 488 / 594; max-width: 488px;'
    );
  });

  it('uses height with 100% width when only embed height is numeric', () => {
    expect(buildSizingStyle(null, 450, null, null)).toBe(
      'height: 450px; width: 100%;'
    );
  });

  it('uses the string embed width when height is numeric and width is a string', () => {
    expect(buildSizingStyle('100%', 166, null, null)).toBe(
      'height: 166px; width: 100%;'
    );
  });

  it('uses thumbnail aspect-ratio with max-width when embed dims are non-numeric', () => {
    expect(buildSizingStyle('100%', '100%', 480, 270)).toBe(
      'aspect-ratio: 480 / 270; max-width: 480px;'
    );
  });

  it('falls back to 16/9 when all dimensions are null', () => {
    expect(buildSizingStyle(null, null, null, null)).toBe(
      'aspect-ratio: 16 / 9;'
    );
  });

  it('falls back to 16/9 when embed dims are non-numeric and no thumbnail dims', () => {
    expect(buildSizingStyle('100%', '100%', null, null)).toBe(
      'aspect-ratio: 16 / 9;'
    );
  });
});
