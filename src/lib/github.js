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

const API = 'https://api.github.com';

const cacheKey = (year) => `alexdevos-github-cache${year ? `:${year}` : ''}`;
const CACHE_TTL_MS = 15 * 60 * 1000;

/** Shared in-flight requests keyed by year so hooks don't multiply calls. */
const inflight = new Map();

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
export function readCache(year) {
  try {
    const raw = localStorage.getItem(cacheKey(year));
    if (!raw) return null;
    const { savedAt, data } = JSON.parse(raw);
    // shape check: a malformed/stale cache (e.g. written by an older build)
    // must fall through to the snapshot instead of crashing consumers
    if (!data || !data.stats || !Array.isArray(data.commits)) return null;
    return { data, savedAt, fresh: Date.now() - savedAt < CACHE_TTL_MS };
  } catch {
    return null;
  }
}

function writeCache(data, year) {
  try {
    localStorage.setItem(cacheKey(year), JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // private mode / quota — cache is best-effort only
  }
}

async function fetchFromFunction(doFetch, year) {
  const res = await doFetch(year ? `/api/github?year=${year}` : '/api/github');
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
    feedRepos.map((full) => getJson(`${API}/repos/${full}/commits?per_page=30`, doFetch)),
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
 * request per year so concurrent hook instances don't multiply network calls.
 */
export async function fetchLive({ fetchImpl, year } = {}) {
  const run = async () => {
    const doFetch = fetchImpl ?? defaultFetch;
    try {
      const data = await fetchFromFunction(doFetch, year);
      writeCache(data, year);
      return { data, source: 'live' };
    } catch {
      // function unavailable (dev server, cold start, 5xx) — try direct CORS
    }
    try {
      const data = await fetchDirect(doFetch);
      writeCache(data, year);
      return { data, source: 'live' };
    } catch {
      // offline or rate-limited — fall through to local layers
    }
    const cached = readCache(year);
    if (cached) return { data: cached.data, source: 'cache' };
    return { data: githubSnapshot, source: 'snapshot' };
  };

  const key = year ?? 'default';
  if (fetchImpl) return run();
  if (!inflight.has(key)) {
    inflight.set(
      key,
      run().finally(() => {
        inflight.delete(key);
      }),
    );
  }
  return inflight.get(key);
}
