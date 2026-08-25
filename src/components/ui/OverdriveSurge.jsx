import { useEffect } from 'react';

const SURGE_MS = 6000;

/**
 * Konami overdrive surge: full-screen phosphor vignette that flashes in,
 * breathes and fades (CSS animation), plus a global --beam-speed variable
 * ramped 1 -> 6 -> 1 via requestAnimationFrame so every rotating ring
 * accelerates together. Adds body.overdrive for glow pulsing styles.
 *
 * @param {object} props
 * @param {boolean} props.active - Surge is currently running.
 * @param {() => void} props.onDone - Called when the surge finished (~6s).
 */
export default function OverdriveSurge({ active, onDone }) {
  useEffect(() => {
    if (!active) return undefined;

    document.body.classList.add('overdrive');
    const root = document.documentElement;
    const start = performance.now();

    // beam speed envelope: quick spin-up, hold, smooth decay
    let raf;
    const tick = (now) => {
      const t = (now - start) / SURGE_MS;
      let speed;
      if (t < 0.15) speed = 1 + (t / 0.15) * 5;
      else if (t < 0.58) speed = 6;
      else if (t < 1) speed = 6 - ((t - 0.58) / 0.42) * 5;
      else speed = 1;
      root.style.setProperty('--beam-speed', speed.toFixed(3));
      if (t < 1) raf = requestAnimationFrame(tick);
      else root.style.setProperty('--beam-speed', '1');
    };
    raf = requestAnimationFrame(tick);

    const doneTimer = setTimeout(() => onDone?.(), SURGE_MS + 200);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(doneTimer);
      document.body.classList.remove('overdrive');
      root.style.setProperty('--beam-speed', '1');
    };
  }, [active, onDone]);

  if (!active) return null;
  return (
    <div
      aria-hidden="true"
      className="od-flash pointer-events-none fixed inset-0 z-[9490]"
    />
  );
}
