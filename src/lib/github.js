import { githubSnapshot } from '../data/githubSnapshot';
import { GITHUB_USER, pickFeedRepos, reducePayload } from './githubCore';

/**
 * github — client side of the live GitHub feature.
 *
 * Resolution order (site never breaks):
 *   1. /api/github  — Vercel Function, edge-cached 15 min (token lives there)
 *   2. direct fetch — api.github.com CORS, unauthenticated (dev / function down)
 *   3. localStorage — last known payload, even if stale
 *   4. snapshot     — committed offline data (src/data/githubSnapshot.js)
 *
 * The returned `source` is 'live' (fresh from 1 or 2), 'cache' or 'snapshot'.
 */

const CACHE_KEY = 'alexdevos-github-cache';
const CACHE_TTL_MS = 15 * 60 * 1000;
const API = 'https://api.github.com';

/** Shared in-flight request so concurrent hook instances don't multiply calls. */
let inflight = null;

const offlineInTests = () => import.meta.env?.MODE === 'test';

function defaultFetch(...args) {
  if (offlineInTests()) {
    return Promise.reject(new Error('network disabled under test'));
  }
  return fetch(...args);
}

async function getJson(url, doFetch) {
  const res = await doFetch(url);
  if (!res.ok) throw new Error(`github ${url} → ${res.status}`);
  return res.json();
}

/** Read the localStorage payload (with freshness flag). Never throws. */
export function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { savedAt, data } = JSON.parse(raw);
    if (!data) return null;
    return { data, savedAt, fresh: Date.now() - savedAt < CACHE_TTL_MS };
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // private mode / quota — cache is best-effort only
  }
}

async function fetchFromFunction(doFetch) {
  const res = await doFetch('/api/github');
  if (!res.ok) throw new Error(`/api/github → ${res.status}`);
  return res.json();
}

async function fetchDirect(doFetch) {
  const [user, repos, events] = await Promise.all([
    getJson(`${API}/users/${GITHUB_USER}`, doFetch),
    getJson(`${API}/users/${GITHUB_USER}/repos?sort=pushed&per_page=100`, doFetch),
    getJson(`${API}/users/${GITHUB_USER}/events/public?per_page=30`, doFetch),
  ]);
  // Events API strips payload.commits — mirror the function's repo-feed fetch
  const feedRepos = pickFeedRepos(repos);
  const feedResponses = await Promise.allSettled(
    feedRepos.map((full) => getJson(`${API}/repos/${full}/commits?per_page=8`, doFetch)),
  );
  const repoFeeds = feedResponses.map((r, i) => ({
    repo: feedRepos[i],
    commits: r.status === 'fulfilled' ? r.value : [],
  }));
  return reducePayload({ user, repos, events, repoFeeds });
}

/**
 * Resolve the freshest GitHub payload available.
 * `fetchImpl` is injectable for tests; callers without it share one in-flight
 * request so concurrent hook instances don't multiply network calls.
 */
export async function fetchLive({ fetchImpl } = {}) {
  const run = async () => {
    const doFetch = fetchImpl ?? defaultFetch;
    try {
      const data = await fetchFromFunction(doFetch);
      writeCache(data);
      return { data, source: 'live' };
    } catch {
      // function unavailable (dev server, cold start, 5xx) — try direct CORS
    }
    try {
      const data = await fetchDirect(doFetch);
      writeCache(data);
      return { data, source: 'live' };
    } catch {
      // offline or rate-limited — fall through to local layers
    }
    const cached = readCache();
    if (cached) return { data: cached.data, source: 'cache' };
    return { data: githubSnapshot, source: 'snapshot' };
  };

  if (fetchImpl) return run();
  if (!inflight) {
    inflight = run().finally(() => {
      inflight = null;
    });
  }
  return inflight;
}
