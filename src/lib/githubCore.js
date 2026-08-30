/**
 * githubCore — pure GitHub payload normalization shared by the Vercel
 * function (api/github.js) and the browser client (lib/github.js).
 * No fetch, no window: trivially unit-testable.
 */

export const GITHUB_USER = 'AlexisHCD';
export const CHART_WEEKS = 26;

const round2 = (n) => Math.round(n * 100) / 100;

/** Map raw repo records to the compact shape the UI consumes (newest first). */
export function reduceRepos(repos = []) {
  return (Array.isArray(repos) ? repos : [])
    .filter((r) => r && !r.fork && !r.private)
    .map((r) => ({
      id: r.id,
      name: r.name ?? '',
      url: r.html_url ?? '',
      description: r.description ?? '',
      language: r.language ?? null,
      stars: r.stargazers_count ?? 0,
      createdAt: r.created_at ?? null,
      pushedAt: r.pushed_at ?? null,
    }))
    .sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')));
}

/** Flatten PushEvents into commit rows (newest first), capped at `limit`. */
export function collectCommits(events = [], limit = 8) {
  const out = [];
  for (const ev of Array.isArray(events) ? events : []) {
    if (ev?.type !== 'PushEvent') continue;
    for (const c of ev.payload?.commits ?? []) {
      const repo = ev.repo?.name ?? '';
      out.push({
        repo,
        sha: String(c.sha ?? '').slice(0, 7),
        message: String(c.message ?? '').split('\n')[0],
        date: ev.created_at ?? null,
        url: c.sha && repo ? `https://github.com/${repo}/commit/${c.sha}` : null,
      });
    }
    if (out.length >= limit * 3) break;
  }
  return out.slice(0, limit);
}

/**
 * Flatten /repos/{owner}/{repo}/commits feeds into commit rows. The Events
 * API no longer includes payload.commits on PushEvents, so repo feeds are the
 * reliable source for commit messages — the function and the direct fallback
 * both fetch the top-N recently-pushed repos and hand the responses here.
 */
export function collectRepoFeeds(repoFeeds = [], limit = 8) {
  const out = [];
  for (const feed of Array.isArray(repoFeeds) ? repoFeeds : []) {
    for (const c of feed?.commits ?? []) {
      out.push({
        repo: feed.repo ?? '',
        sha: String(c.sha ?? '').slice(0, 7),
        message: String(c.commit?.message ?? '').split('\n')[0],
        date: c.commit?.author?.date ?? null,
        url: c.html_url ?? null,
      });
    }
  }
  return out
    .sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')))
    .slice(0, limit);
}

/** Dedupe commit rows by repo@sha keeping the newest date first. */
function dedupeCommits(rows) {
  const byKey = new Map();
  for (const row of rows) {
    const key = `${row.repo}@${row.sha}`;
    if (!byKey.has(key)) byKey.set(key, row);
  }
  return [...byKey.values()];
}

/** Pick the most recently pushed non-fork public repos for commit feeds. */
export function pickFeedRepos(repos = [], limit = 5) {
  return (Array.isArray(repos) ? repos : [])
    .filter((r) => r && !r.fork && !r.private)
    .sort((a, b) => String(b.pushed_at ?? '').localeCompare(String(a.pushed_at ?? '')))
    .slice(0, limit)
    .map((r) => r.full_name);
}

/**
 * Weekly commit counts over the last `weeks` buckets (oldest → newest),
 * matching the "actividad --6-meses" chart window.
 */
export function weeklyCounts(commits = [], now = new Date(), weeks = CHART_WEEKS) {
  const counts = new Array(weeks).fill(0);
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  for (const c of commits) {
    if (!c?.date) continue;
    const t = new Date(c.date).getTime();
    if (!Number.isFinite(t)) continue;
    const ago = now.getTime() - t;
    if (ago < 0) continue;
    const idx = weeks - 1 - Math.floor(ago / weekMs);
    if (idx >= 0 && idx < weeks) counts[idx] += 1;
  }
  return counts;
}

/** Catmull-Rom smoothed SVG path through `points` (mockup-style soft curve). */
function smoothPath(points) {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${round2(points[0].x)} ${round2(points[0].y)}`;
  let d = `M ${round2(points[0].x)} ${round2(points[0].y)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${round2(c1x)} ${round2(c1y)}, ${round2(c2x)} ${round2(c2y)}, ${round2(p2.x)} ${round2(p2.y)}`;
  }
  return d;
}

/** Build the mono-chart line/area paths + end point from weekly counts. */
export function chartPath(counts = [], { width = 600, height = 220 } = {}) {
  const PAD = 6;
  const TOP = 16;
  const BOTTOM = 16;
  const innerW = width - PAD * 2;
  const innerH = height - TOP - BOTTOM;
  if (!counts.length) return { line: '', area: '', end: { x: width - PAD, y: TOP + innerH } };
  const max = Math.max(...counts, 1);
  const pts = counts.map((v, i) => ({
    x: PAD + (i * innerW) / Math.max(counts.length - 1, 1),
    y: TOP + innerH - (v / max) * innerH,
  }));
  const line = smoothPath(pts);
  const end = pts[pts.length - 1];
  const area = `${line} L ${round2(end.x)} ${height - 4} L ${round2(pts[0].x)} ${height - 4} Z`;
  return { line, area, end };
}

/** Repo count per language, descending, nulls skipped. */
export function topLanguages(repos = [], limit = 5) {
  const byName = new Map();
  for (const r of repos) {
    if (!r?.language) continue;
    byName.set(r.language, (byName.get(r.language) ?? 0) + 1);
  }
  return [...byName.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

/** Compact Spanish relative time for commit rows. */
export function timeAgo(iso, now = new Date()) {
  const t = new Date(iso ?? '').getTime();
  if (!Number.isFinite(t)) return '';
  const ms = Math.max(now.getTime() - t, 0);
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return 'recién';
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(ms / 3600000);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(ms / 86400000);
  if (days < 30) return `hace ${days}d`;
  return new Date(iso).toISOString().slice(0, 10);
}

/** Reduce raw GitHub API responses into the single payload the app consumes. */
export function reducePayload({ user, repos, events, repoFeeds }, now = new Date()) {
  return {
    fetchedAt: now.toISOString(),
    stats: {
      publicRepos: user?.public_repos ?? null,
      githubSince: user?.created_at ? String(user.created_at).slice(0, 4) : null,
    },
    repos: reduceRepos(repos),
    commits: dedupeCommits([...collectCommits(events), ...collectRepoFeeds(repoFeeds)]).sort(
      (a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')),
    ),
  };
}
