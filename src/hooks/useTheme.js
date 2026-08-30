import { useCallback, useEffect, useState } from 'react';
import { playThemeChime } from '../lib/sound';
import { prefersReducedMotion } from '../lib/motion';

const STORAGE_KEY = 'alexdevos-theme';

/** Read the persisted theme, defaulting to the ink night theme. */
function readStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? 'dark';
  } catch {
    /* storage unavailable (private mode) — fall through to default */
    return 'dark';
  }
}

/**
 * Central day/night theme state. Mirrors the value onto <html data-theme>
 * (the CSS token source) and persists it across visits.
 *
 * `toggle(originEl)` plays the mockup interaction: a View Transitions
 * circular reveal expanding from the switcher (lights flooding the room)
 * plus the synth chirp. Falls back to an instant swap when the API or
 * reduced motion is on.
 */
export function useTheme() {
  const [theme, setTheme] = useState(readStoredTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore persistence errors */
    }
  }, [theme]);

  const toggle = useCallback(
    (originEl) => {
      const next = theme === 'dark' ? 'light' : 'dark';
      playThemeChime(next === 'light');

      const mirrorDom = () => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch {
          /* ignore persistence errors */
        }
      };

      if (!document.startViewTransition || prefersReducedMotion()) {
        setTheme(next);
        return;
      }

      // The callback must flip the DOM synchronously so the "new" snapshot
      // captures the destination theme; React state follows right after and
      // its effect re-writes the same value (idempotent).
      let transition;
      try {
        transition = document.startViewTransition(mirrorDom);
      } catch {
        setTheme(next);
        return;
      }
      setTheme(next);

      if (originEl && transition.ready) {
        transition.ready
          .then(() => {
            const rect = originEl.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            const maxRadius = Math.hypot(
              Math.max(x, window.innerWidth - x),
              Math.max(y, window.innerHeight - y)
            );
            document.documentElement.animate(
              {
                clipPath: [
                  `circle(0px at ${x}px ${y}px)`,
                  `circle(${maxRadius}px at ${x}px ${y}px)`,
                ],
              },
              {
                duration: 650,
                easing: 'cubic-bezier(.4,0,.2,1)',
                pseudoElement: '::view-transition-new(root)',
              }
            );
          })
          .catch(() => {
            /* transition skipped — the swap is already applied */
          });
      }
    },
    [theme]
  );

  return { theme, toggle };
}
