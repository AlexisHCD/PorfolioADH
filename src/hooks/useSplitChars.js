/**
 * Split a string into render-ready character descriptors.
 * Spaces become non-breaking spaces so they keep their width in layout.
 * Returns `[{ ch, key }]` with a stable index key.
 */
export function useSplitChars(text = '') {
  return Array.from(text).map((ch, i) => ({
    ch: ch === ' ' ? ' ' : ch,
    key: i,
  }));
}
