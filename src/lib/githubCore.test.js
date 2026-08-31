import { describe, expect, it } from 'vitest';
import {
  calendarGrid,
  chartPath,
  collectCommits,
  collectRepoFeeds,
  calendarHeatmapLevels,
  flattenCalendar,
  reducePayload,
  reduceRepos,
  timeAgo,
  topLanguages,
  weeklyCounts,
} from './githubCore';

const NOW = new Date('2026-08-30T12:00:00Z');

const USER = { public_repos: 12, created_at: '2025-03-01T00:00:00Z' };

const REPOS = [
  {
    id: 1,
    name: 'alpha',
    html_url: 'https://github.com/AlexisHCD/alpha',
    description: 'first',
    language: 'Python',
    stargazers_count: 2,
    created_at: '2026-07-01T00:00:00Z',
    fork: false,
    private: false,
  },
  { id: 2, name: 'forked', fork: true, private: false, language: 'C#' },
  { id: 3, name: 'secret', fork: false, private: true, language: 'C#' },
  { id: 4, name: 'noLang', fork: false, private: false, language: null },
  {
    id: 5,
    name: 'beta',
    html_url: 'https://github.com/AlexisHCD/beta',
    language: 'Python',
    created_at: '2026-08-01T00:00:00Z',
    fork: false,
    private: false,
  },
];

const EVENTS = [
  {
    type: 'PushEvent',
    created_at: '2026-08-30T10:00:00Z',
    repo: { name: 'AlexisHCD/alpha' },
    payload: { commits: [{ sha: 'abc123def456', message: 'fix: core loop\n\nlonger body' }] },
  },
  {
    type: 'CreateEvent',
    created_at: '2026-08-30T11:00:00Z',
    repo: { name: 'AlexisHCD/alpha' },
    payload: {},
  },
  {
    type: 'PushEvent',
    created_at: '2026-08-29T09:00:00Z',
    repo: { name: 'AlexisHCD/beta' },
    payload: { commits: [{ sha: 'def456abc789', message: 'feat: thing' }] },
  },
];

describe('githubCore', () => {
  const REPO_FEEDS = [
    {
      repo: 'AlexisHCD/alpha',
      commits: [
        {
          sha: 'feed999aaa',
          commit: { message: 'feat: from feed', author: { date: '2026-08-30T11:30:00Z' } },
          html_url: 'https://github.com/AlexisHCD/alpha/commit/feed999aaa',
        },
        {
          // same repo@sha as the PushEvent commit — must dedupe (event wins)
          sha: 'abc123def456',
          commit: { message: 'fix: core loop dup', author: { date: '2026-08-30T10:00:00Z' } },
        },
      ],
    },
    {
      repo: 'AlexisHCD/beta',
      commits: [
        {
          sha: 'old111bbb',
          commit: { message: 'chore: old', author: { date: '2026-07-15T00:00:00Z' } },
        },
      ],
    },
  ];

  it('collectRepoFeeds flattens commit feeds, sorts by date and caps', () => {
    const rows = collectRepoFeeds(REPO_FEEDS, 2);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      repo: 'AlexisHCD/alpha',
      sha: 'feed999',
      message: 'feat: from feed',
      date: '2026-08-30T11:30:00Z',
    });
    expect(rows[1].sha).toBe('abc123d');
  });

  it('reducePayload merges events + feeds, dedupes by repo@sha and sorts desc', () => {
    const payload = reducePayload(
      { user: USER, repos: REPOS, events: EVENTS, repoFeeds: REPO_FEEDS },
      NOW,
    );
    expect(payload.commits.map((c) => c.sha)).toEqual([
      'feed999', // feed, 11:30
      'abc123d', // push event, 10:00 (feed dup deduped away)
      'def456a', // push event, 08-29
      'old111b', // feed, 07-15
    ]);
    expect(payload.commits).toHaveLength(4);
  });

  it('calendarGrid builds Sunday-aligned columns with month marks', () => {
    // Aug 2026: Aug 1 is a Saturday (6 phantom head cells), Aug 31 a Monday
    const calendar = [
      { date: '2026-08-03', count: 3 },
      { date: '2026-08-16', count: 8 },
    ];
    const grid = calendarGrid(calendar, {
      start: new Date('2026-08-01T00:00:00Z'),
      end: new Date('2026-08-31T00:00:00Z'),
    });
    expect(grid.cells[0]).toEqual({ level: 0, date: null, count: null });
    expect(grid.cells).toHaveLength(37); // 6 pad + 31 days
    expect(grid.columns).toBe(6);
    expect(grid.monthMarks).toEqual([{ column: 0, label: 'Ago' }]);
    // Aug 16 (Sunday) → level 4; find it: pad 6 + day 16 = index 21
    expect(grid.cells[21]).toMatchObject({ level: 4, date: '2026-08-16', count: 8 });
  });

  it('flattenCalendar flattens GraphQL weeks chronologically', () => {
    const weeks = [
      { contributionDays: [{ date: '2026-08-24', contributionCount: 3 }, { date: '2026-08-25', contributionCount: 0 }] },
      { contributionDays: [{ date: '2026-08-30', contributionCount: 7 }] },
    ];
    expect(flattenCalendar(weeks)).toEqual([
      { date: '2026-08-24', count: 3 },
      { date: '2026-08-25', count: 0 },
      { date: '2026-08-30', count: 7 },
    ]);
  });

  it('calendarHeatmapLevels maps counts to 5 buckets and pads to weekday', () => {
    // 2026-08-30 is a Sunday; build a calendar that ends there
    const calendar = [
      { date: '2026-08-30', count: 3 }, // level 2
      { date: '2026-08-29', count: 9 }, // level 4
      { date: '2026-08-28', count: 0 }, // level 0
    ];
    const { levels } = calendarHeatmapLevels(calendar, NOW);
    expect(levels.length).toBeGreaterThanOrEqual(182);
    expect(levels.at(-3)).toBe(0); // 08-28
    expect(levels.at(-2)).toBe(4); // 08-29
    expect(levels.at(-1)).toBe(2); // 08-30 (today)
  });

  it('weeklyCounts weights calendar days by their contribution count', () => {
    const counts = weeklyCounts(
      [
        { date: NOW.toISOString(), count: 5 },
        { date: NOW.toISOString(), count: 2 },
      ],
      NOW,
      26,
    );
    expect(counts[25]).toBe(7);
    // commit rows (no count) still weigh 1 each
    const one = weeklyCounts([{ date: NOW.toISOString() }], NOW, 26);
    expect(one[25]).toBe(1);
  });

  it('reducePayload maps stats, repos and commits', () => {
    const payload = reducePayload({ user: USER, repos: REPOS, events: EVENTS }, NOW);
    expect(payload.stats).toEqual({ publicRepos: 12, githubSince: '2025' });
    expect(payload.repos.map((r) => r.name)).toEqual(['beta', 'alpha', 'noLang']);
    expect(payload.commits).toHaveLength(2);
    expect(payload.commits[0]).toMatchObject({
      repo: 'AlexisHCD/alpha',
      sha: 'abc123d',
      message: 'fix: core loop',
      url: 'https://github.com/AlexisHCD/alpha/commit/abc123def456',
    });
  });

  it('collectCommits respects the limit and skips non-push events', () => {
    const many = Array.from({ length: 20 }, (_, i) => ({
      type: 'PushEvent',
      created_at: '2026-08-30T10:00:00Z',
      repo: { name: `r${i}` },
      payload: { commits: [{ sha: `sha${i}`, message: `m${i}` }] },
    }));
    expect(collectCommits(many, 8)).toHaveLength(8);
    expect(collectCommits(EVENTS, 8)).toHaveLength(2);
  });

  it('weeklyCounts buckets commits into the last N weeks', () => {
    const threeWeeksAgo = new Date(NOW.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString();
    const counts = weeklyCounts(
      [{ date: threeWeeksAgo }, { date: NOW.toISOString() }, { date: 'not-a-date' }],
      NOW,
      26,
    );
    expect(counts).toHaveLength(26);
    expect(counts[25]).toBe(1); // now
    expect(counts[22]).toBe(1); // 21 days ago → bucket index 26-1-3
    expect(counts.reduce((a, b) => a + b, 0)).toBe(2);
  });

  it('chartPath builds a smooth path with area and end point', () => {
    const { line, area, end } = chartPath([0, 1, 3, 2]);
    expect(line.startsWith('M ')).toBe(true);
    expect(area.endsWith(' Z')).toBe(true);
    expect(area).toContain(line);
    expect(end.x).toBe(594); // width 600 - PAD 6
  });

  it('chartPath handles an empty series', () => {
    const { line, area, end } = chartPath([]);
    expect(line).toBe('');
    expect(area).toBe('');
    expect(end.x).toBeGreaterThan(0);
  });

  it('topLanguages counts, sorts and skips nulls (on filtered repos)', () => {
    // mirrors real usage: repos arrive pre-filtered via reduceRepos (no forks/private)
    const langs = topLanguages(reduceRepos(REPOS), 5);
    expect(langs[0]).toEqual({ name: 'Python', count: 2 });
    expect(langs.find((l) => l.name === 'C#')).toBeUndefined();
  });

  it('timeAgo renders compact spanish units', () => {
    expect(timeAgo(NOW.toISOString(), NOW)).toBe('recién');
    expect(timeAgo(new Date(NOW - 5 * 60000).toISOString(), NOW)).toBe('hace 5 min');
    expect(timeAgo(new Date(NOW - 3 * 3600000).toISOString(), NOW)).toBe('hace 3h');
    expect(timeAgo(new Date(NOW - 4 * 86400000).toISOString(), NOW)).toBe('hace 4d');
    expect(timeAgo('nope', NOW)).toBe('');
  });
});
