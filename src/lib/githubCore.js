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
 * Flatten GitHub contribution-calendar weeks (GraphQL) into a chronological
 * [{ date: 'YYYY-MM-DD', count }] array sorted oldest → newest.
 */
export function flattenCalendar(weeks = []) {
  const out = [];
  for (const week of Array.isArray(weeks) ? weeks : []) {
    for (const day of week?.contributionDays ?? []) {
      out.push({
        date: String(day.date ?? '').slice(0, 10),
        count: day.contributionCount ?? 0,
      });
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Build a GitHub-style calendar grid from a chronological [{ date, count }]
 * array. Returns column-major cells (Sunday-start weeks, phantom head cells
 * at level 0), month marks per column and the column count — everything the
 * real profile heatmap shows.
 *
 * @param {Array<{date: string, count: number}>} calendar
 * @param {{start: Date, end: Date}} range - Inclusive UTC date range.
 */
export function calendarGrid(calendar, { start, end }) {
  const byDate = new Map(calendar.map((d) => [d.date, d.count]));
  const level = (count) => (count <= 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 7 ? 3 : 4);
  const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const cells = [];
  const monthMarks = [];
  const head = start.getUTCDay(); // pad so column 0 starts on a Sunday
  for (let i = 0; i < head; i += 1) cells.push({ level: 0, date: null, count: null });

  let lastMonth = -1;
  let column = 0;
  const cursor = new Date(start.getTime());
  while (cursor.getTime() <= end.getTime()) {
    const m = cursor.getUTCMonth();
    if (cursor.getUTCDate() === 1 && m !== lastMonth) {
      // mark the month at the column that contains its 1st day (GitHub-style)
      monthMarks.push({ column, label: MONTHS[m] });
      lastMonth = m;
    }
    if (cursor.getUTCDay() === 0) column += 1;
    const key = cursor.toISOString().slice(0, 10);
    const count = byDate.get(key) ?? 0;
    cells.push({ level: level(count), date: key, count });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return { cells, monthMarks, columns: column + 1 };
}

/**
 * Map the trailing 182 calendar days to heatmap levels 0-4, column-major
 * (Sunday-start weeks) so they render straight into the grid-flow-col grid.
 * Days missing from the calendar count as 0.
 */
export function calendarHeatmapLevels(calendar = [], now = new Date()) {
  const DAYS = 182;
  const byDate = new Map(calendar.map((d) => [d.date, d.count]));
  const level = (count) => (count <= 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 7 ? 3 : 4);

  const days = [];
  for (let i = DAYS - 1; i >= 0; i -= 1) {
    const d = new Date(now.getTime() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    days.push(level(byDate.get(key) ?? 0));
  }
  // pad the head so the first date lands on its real weekday row (the grid
  // fills column-major, Sunday-start weeks — phantom cells stay at level 0)
  const firstDow = new Date(now.getTime() - (DAYS - 1) * 86400000).getUTCDay();
  return { levels: [...new Array(firstDow).fill(0), ...days] };
}

/**
 * Weekly sums over `entries` ({ date, count? }) — commit rows count as 1 per
 * entry, calendar days add their contribution count. Oldest bucket first,
 * matching the "actividad --6-meses" chart window.
 */
export function weeklyCounts(entries = [], now = new Date(), weeks = CHART_WEEKS) {
  const counts = new Array(weeks).fill(0);
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  for (const entry of entries) {
    if (!entry?.date) continue;
    const t = new Date(entry.date).getTime();
    if (!Number.isFinite(t)) continue;
    const ago = now.getTime() - t;
    if (ago < 0) continue;
    const idx = weeks - 1 - Math.floor(ago / weekMs);
    if (idx >= 0 && idx < weeks) counts[idx] += entry.count ?? 1;
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
export function reducePayload({
  user,
  repos,
  events,
  repoFeeds,
  calendarWeeks,
  calendarYear = null,
}) {
  const calendar = flattenCalendar(calendarWeeks);
  return {
    fetchedAt: new Date().toISOString(),
    stats: {
      publicRepos: user?.public_repos ?? null,
      githubSince: user?.created_at ? String(user.created_at).slice(0, 4) : null,
    },
    repos: reduceRepos(repos),
    commits: dedupeCommits([...collectCommits(events), ...collectRepoFeeds(repoFeeds, 100)]).sort(
      (a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')),
    ),
    // real contribution calendar — only present when the server-side token
    // belongs to @AlexisHCD (GraphQL viewer/user contributionsCollection)
    calendar,
    calendarYear: calendar.length > 0 ? calendarYear : null,
    calendarTotal: calendar.reduce((sum, d) => sum + d.count, 0),
  };
}
