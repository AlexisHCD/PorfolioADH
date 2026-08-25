import { useEffect, useRef } from 'react';

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

/**
 * Listen for the Konami code on window and fire `onUnlock` when completed.
 *
 * Uses a rolling buffer with suffix matching: any run of recent keys whose
 * tail equals the full sequence unlocks, so overlapping starts (e.g. mashing
 * ArrowUp before entering the rest) never lose progress.
 *
 * @param {{ onUnlock: () => void }} handlers - Called once per completion.
 * @returns {void}
 */
export function useKonami({ onUnlock }) {
  const bufferRef = useRef([]);
  const cbRef = useRef(onUnlock);

  useEffect(() => {
    cbRef.current = onUnlock;
  }, [onUnlock]);

  useEffect(() => {
    const onKeyDown = (e) => {
      // ignore shortcuts with modifiers (avoid hijacking browser combos)
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

      const buffer = bufferRef.current;
      buffer.push(key);
      if (buffer.length > KONAMI.length) buffer.shift();

      const matches =
        buffer.length === KONAMI.length &&
        KONAMI.every((expected, i) => expected === buffer[i]);

      if (matches) {
        buffer.length = 0;
        cbRef.current?.();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
