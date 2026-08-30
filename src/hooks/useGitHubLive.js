import { useEffect, useRef, useState } from 'react';
import { githubSnapshot } from '../data/githubSnapshot';
import { fetchLive, readCache } from '../lib/github';

const LOAD_THROTTLE_MS = 60 * 1000;

/**
 * Live GitHub data with the 4-layer fallback chain (function → direct →
 * cache → snapshot). Starts from the freshest local state so the UI never
 * flashes empty, then re-fetches on mount, tab re-focus (throttled) and a
 * slow idle interval. Never throws; always returns a usable payload.
 *
 * @param {object} [opts]
 * @param {number} [opts.refreshIntervalMs] - Idle re-fetch cadence (0 disables).
 * @returns {{data: object, source: 'live'|'cache'|'snapshot', updatedAt: number|null}}
 */
export function useGitHubLive({ refreshIntervalMs = 5 * 60 * 1000 } = {}) {
  const [state, setState] = useState(() => {
    const cached = typeof window === 'undefined' ? null : readCache();
    return cached
      ? { data: cached.data, source: 'cache', updatedAt: cached.savedAt }
      : { data: githubSnapshot, source: 'snapshot', updatedAt: null };
  });
  const lastLoad = useRef(0);

  useEffect(() => {
    let alive = true;
    let timer;

    const load = (force = false) => {
      const now = Date.now();
      if (!force && now - lastLoad.current < LOAD_THROTTLE_MS) return;
      lastLoad.current = now;
      fetchLive()
        .then((result) => {
          if (alive) setState({ ...result, updatedAt: Date.now() });
        })
        .catch(() => {
          // fetchLive resolves through the whole chain; only a hard crash
          // lands here — keep whatever local layer we already rendered.
        });
    };

    load(true);
    const onVisible = () => {
      if (document.visibilityState === 'visible') load();
    };
    document.addEventListener('visibilitychange', onVisible);
    if (refreshIntervalMs > 0) timer = setInterval(() => load(true), refreshIntervalMs);

    return () => {
      alive = false;
      document.removeEventListener('visibilitychange', onVisible);
      clearInterval(timer);
    };
  }, [refreshIntervalMs]);

  return state;
}
