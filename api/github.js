/**
 * Vercel Function: GET /api/github
 *
 * Live GitHub snapshot for @AlexisHCD, reduced to a single small payload by
 * the shared reducer in src/lib/githubCore.js. The GITHUB_TOKEN never reaches
 * the browser — it lives in Vercel env vars (Settings → Environment Variables;
 * a fine-grained PAT with public-repo read access, no scopes, is enough).
 *
 * The response is edge-cached for 15 minutes and served stale while
 * revalidating for up to a day, so GitHub sees roughly one request per
 * 15 minutes REGARDLESS of visitor traffic, and the first visitor of an
 * expired window is served instantly from the stale copy.
 *
 * On upstream failure it answers 503 (not cached) and the client falls back
 * to its own cache/snapshot chain.
 */
import { GITHUB_USER, pickFeedRepos, reducePayload } from '../src/lib/githubCore.js';

const API = 'https://api.github.com';

async function getJson(url, token) {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`github ${url} → ${res.status}`);
  return res.json();
}

export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN || '';
  // optional ?year=YYYY — a specific contribution year (GraphQL from/to);
  // without it the API returns the rolling last 365 days
  const year = Number(req.query?.year);
  const hasYear = Number.isInteger(year) && year >= 2005 && year <= new Date().getUTCFullYear() + 1;
  try {
    // sort=pushed so the freshest repos are also the commit-feed candidates
    const [user, repos, events] = await Promise.all([
      getJson(`${API}/users/${GITHUB_USER}`, token),
      getJson(`${API}/users/${GITHUB_USER}/repos?sort=pushed&per_page=100`, token),
      getJson(`${API}/users/${GITHUB_USER}/events/public?per_page=30`, token),
    ]);
    // the Events API strips payload.commits from PushEvents — read commit
    // messages from the top recently-pushed repos' feeds instead
    const feedRepos = pickFeedRepos(repos);
    const feedResponses = await Promise.allSettled(
      feedRepos.map((full) => getJson(`${API}/repos/${full}/commits?per_page=30`, token)),
    );
    const repoFeeds = feedResponses.map((r, i) => ({
      repo: feedRepos[i],
      commits: r.status === 'fulfilled' ? r.value : [],
    }));

    // real contribution calendar (the profile heatmap data) — only when the
    // token belongs to @AlexisHCD; otherwise the client falls back to its
    // approximation layers
    let calendarWeeks = null;
    try {
      const now = new Date();
      const vars = { login: GITHUB_USER };
      if (hasYear) {
        vars.from = `${year}-01-01T00:00:00Z`;
        // cap the range at "now" for the current year
        vars.to = year < now.getUTCFullYear() ? `${year}-12-31T23:59:59Z` : now.toISOString();
      }
      const gql = await fetch(`${API}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          query: `query($login: String!, $from: DateTime, $to: DateTime) {
            user(login: $login) {
              login
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays { date contributionCount }
                  }
                }
              }
            }
          }`,
          variables: vars,
        }),
      });
      const json = await gql.json();
      const viewer = json?.data?.user;
      if (gql.ok && viewer?.login === GITHUB_USER) {
        calendarWeeks = viewer.contributionsCollection?.contributionCalendar?.weeks ?? null;
      }
    } catch {
      // calendar is optional — REST layers already provide a payload
    }

    const payload = reducePayload({ user, repos, events, repoFeeds, calendarWeeks, calendarYear: hasYear ? year : null });
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=86400');
    res.status(200).json(payload);
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    res.status(503).json({ error: 'github upstream unavailable' });
  }
}
