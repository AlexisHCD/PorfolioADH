import { useCallback, useEffect, useState } from 'react';

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

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggle };
}
