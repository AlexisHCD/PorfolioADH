/**
 * Committed offline snapshot — the LAST layer of the GitHub fallback chain
 * (edge cache → function → localStorage → this file).
 *
 * Stats mirror the mockup's curated numbers; repos and commits stay empty on
 * purpose so live-only UI blocks (commits --live, repos --nuevas) hide
 * themselves when there is no real data instead of showing fake activity.
 */
export const githubSnapshot = {
  fetchedAt: null,
  stats: { publicRepos: 9, githubSince: '2025' },
  repos: [],
  commits: [],
};
