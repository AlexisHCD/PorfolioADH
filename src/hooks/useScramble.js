import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../lib/motion';

/**
 * Scramble-text effect. Animates the displayed string from random glyphs into
 * the final `text` over `duration` ms, re-running whenever `runKey` changes.
 * Returns the current `display` string (a hook, not a callable).
 */
export function useScramble({
  text = '',
  duration = 1100,
  runKey = 0,
  glyphs = '!<>-_\\/[]{}=+*^?#',
} = {}) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(text);
      return undefined;
    }

    const len = text.length;
    const start = (typeof performance !== 'undefined' ? performance : Date).now();
    let raf;

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const revealed = Math.floor(p * len);
      let out = '';
      for (let i = 0; i < len; i += 1) {
        if (i < revealed) out += text[i];
        else if (text[i] === ' ') out += ' ';
        else out += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      setDisplay(out);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(text);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, duration, runKey, glyphs]);

  return display;
}
