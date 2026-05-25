/**
 * Build the size portion of the lite-oembed inline style.
 * - Both numeric → aspect-ratio. capToEmbedWidth also adds max-width (used for
 *   script-based embeds whose widgets render at a fixed size, unlike responsive iframes).
 * - Only height numeric (e.g. SoundCloud "100%" width) → explicit height + width.
 * - Width numeric, height null (e.g. Bluesky) → max-width only; height determined by content.
 * - Neither numeric but thumbnail dims available (e.g. TikTok "100%"/"100%") →
 *   thumbnail aspect-ratio with max-width so portrait placeholders don't stretch.
 * - Fallback → 16/9.
 */
export function buildSizingStyle(
  embedWidth: number | string | null,
  embedHeight: number | string | null,
  thumbWidth: number | null,
  thumbHeight: number | null,
  capToEmbedWidth = false
): string {
  if (typeof embedWidth === 'number' && typeof embedHeight === 'number') {
    const maxWidth =
      capToEmbedWidth || embedHeight > embedWidth
        ? ` max-width: ${embedWidth}px;`
        : '';
    return `aspect-ratio: ${embedWidth} / ${embedHeight};${maxWidth}`;
  }
  if (typeof embedHeight === 'number') {
    return `height: ${embedHeight}px; width: ${typeof embedWidth === 'string' ? embedWidth : '100%'};`;
  }
  if (typeof embedWidth === 'number') {
    return `max-width: ${embedWidth}px;`;
  }
  if (typeof thumbWidth === 'number' && typeof thumbHeight === 'number') {
    return `aspect-ratio: ${thumbWidth} / ${thumbHeight}; max-width: ${thumbWidth}px;`;
  }
  return 'aspect-ratio: 16 / 9;';
}
