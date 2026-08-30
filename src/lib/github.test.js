import { afterEach, describe, expect, it } from 'vitest';
import { githubSnapshot } from '../data/githubSnapshot';
import { fetchLive, readCache } from './github';

const PAYLOAD = {
  fetchedAt: '2026-08-30T12:00:00Z',
  stats: { publicRepos: 12, githubSince: '2025' },
  repos: [{ id: 1, name: 'alpha', url: 'https://github.com/AlexisHCD/alpha' }],
  commits: [{ repo: 'AlexisHCD/alpha', sha: 'abc123d', message: 'fix: x', date: '2026-08-30T10:00:00Z', url: null }],
};

const ok = (body) => ({ ok: true, status: 200, json: async () => body });
const fail = (status) => ({ ok: false, status, json: async () => ({}) });

/** Impl that answers /api/github from `functionBehavior` and GitHub direct calls from `directBehavior`. */
function makeImpl(functionBehavior, directBehavior) {
  return async (url) => {
    if (url === '/api/github') return functionBehavior(url);
    return directBehavior(url);
  };
}

describe('fetchLive fallback chain', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('layer 1 — a working /api/github wins and seeds the cache', async () => {
    const impl = makeImpl(async () => ok(PAYLOAD), async () => {
      throw new Error('direct must not be called when the function works');
    });
    const { data, source } = await fetchLive({ fetchImpl: impl });
    expect(source).toBe('live');
    expect(data).toEqual(PAYLOAD);
    expect(readCache()?.data).toEqual(PAYLOAD);
  });

  it('layer 2 — function down falls back to direct CORS fetch', async () => {
    const impl = makeImpl(
      async () => fail(503),
      async (url) => {
        if (url.includes('/users/AlexisHCD/events/public')) return ok([]);
        if (url.includes('/repos?')) return ok([]);
        if (url.endsWith('/users/AlexisHCD')) return ok({ public_repos: 7, created_at: '2025-01-01T00:00:00Z' });
        throw new Error(`unexpected url ${url}`);
      },
    );
    const { data, source } = await fetchLive({ fetchImpl: impl });
    expect(source).toBe('live');
    expect(data.stats).toEqual({ publicRepos: 7, githubSince: '2025' });
    expect(readCache()?.data.stats).toEqual({ publicRepos: 7, githubSince: '2025' });
  });

  it('layer 3 — everything offline serves the localStorage cache', async () => {
    localStorage.setItem(
      'alexdevos-github-cache',
      JSON.stringify({ savedAt: Date.now() - 99 * 60 * 1000, data: PAYLOAD }),
    );
    const impl = makeImpl(async () => fail(500), async () => fail(429));
    const { data, source } = await fetchLive({ fetchImpl: impl });
    expect(source).toBe('cache');
    expect(data).toEqual(PAYLOAD);
  });

  it('layer 4 — nothing available serves the committed snapshot', async () => {
    const impl = makeImpl(async () => fail(500), async () => fail(403));
    const { data, source } = await fetchLive({ fetchImpl: impl });
    expect(source).toBe('snapshot');
    expect(data).toEqual(githubSnapshot);
  });

  it('a corrupt cache entry does not crash the snapshot fallback', async () => {
    localStorage.setItem('alexdevos-github-cache', '{not json');
    const impl = makeImpl(async () => fail(500), async () => fail(500));
    const { source } = await fetchLive({ fetchImpl: impl });
    expect(source).toBe('snapshot');
  });
});
