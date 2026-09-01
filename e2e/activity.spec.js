import { expect, test } from '@playwright/test';

/** Deterministic fixture for /api/github (per year) + network isolation. */
function fixture(year) {
  const start = Date.UTC(year, 0, 1);
  const end = year === new Date().getUTCFullYear() ? Date.now() : Date.UTC(year, 11, 31);
  const calendar = [];
  for (let t = start; t <= end; t += 86_400_000) {
    const i = Math.floor(t / 86_400_000);
    calendar.push({
      date: new Date(t).toISOString().slice(0, 10),
      count: i % 5 === 0 ? 4 : i % 3 === 0 ? 1 : 0,
    });
  }
  return {
    fetchedAt: new Date().toISOString(),
    stats: { publicRepos: 11, githubSince: '2025' },
    repos: [
      {
        id: 1,
        name: 'fixture-repo',
        url: 'https://github.com/AlexisHCD/fixture-repo',
        description: '',
        language: 'Rust',
        stars: 3,
        createdAt: `${year}-02-01T00:00:00Z`,
        pushedAt: `${year}-02-01T00:00:00Z`,
      },
    ],
    commits: [
      { repo: 'AlexisHCD/fixture-repo', sha: 'abc123d', message: 'feat: fixture commit', date: `${year}-03-01T12:00:00Z`, url: null },
    ],
    calendar,
    calendarYear: year,
    calendarTotal: calendar.reduce((s, d) => s + d.count, 0),
  };
}

export async function mockGithub(page) {
  // isolate from the real network — everything comes from the fixtures
  await page.route('**api.github.com/**', (route) => route.abort());
  const handler = (route) => {
    const url = new URL(route.request().url());
    const year = Number(url.searchParams.get('year')) || new Date().getFullYear();
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fixture(year)) });
  };
  await page.route('**/api/github?*', handler);
  await page.route('**/api/github', handler);
}

export async function boot(page, path = '/') {
  await page.goto(path);
  await expect(page.locator('#loader')).toBeHidden({ timeout: 15_000 });
}

test.describe('live activity', () => {
  test('renders the calendar, live badge and new-repos block from the fixture', async ({ page }) => {
    await mockGithub(page);
    await boot(page);
    await page.locator('#actividad').scrollIntoViewIfNeeded();
    await expect(page.getByText(/contribuciones · 2026/)).toBeVisible();
    await expect(page.getByText('● live').first()).toBeVisible();
    await expect(page.getByText('feat: fixture commit')).toBeVisible();
    await page.locator('#proyectos').scrollIntoViewIfNeeded();
    await expect(page.getByText('$ ls ~/repos --nuevas')).toBeVisible();
    const nuevas = page.locator('.panel', { hasText: '$ ls ~/repos --nuevas' });
    await expect(nuevas.getByRole('link', { name: /fixture-repo/ })).toHaveAttribute(
      'href',
      'https://github.com/AlexisHCD/fixture-repo',
    );
  });

  test('year switch refetches the other year', async ({ page }) => {
    await mockGithub(page);
    await boot(page);
    await page.locator('#actividad').scrollIntoViewIfNeeded();
    await expect(page.getByText(/contribuciones · 2026/)).toBeVisible();
    await page.getByRole('button', { name: '2025' }).click();
    await expect(page.getByText(/contribuciones · 2025/)).toBeVisible();
    await expect(page.getByText(/contribuciones · 2026/)).toBeHidden();
  });

  test('falls back to the honest snapshot when every layer fails', async ({ page }) => {
    await page.route('**/api.github*', (route) => route.fulfill({ status: 500, body: '{}' }));
    await page.route('**api.github.com/**', (route) => route.abort());
    await boot(page);
    await page.locator('#actividad').scrollIntoViewIfNeeded();
    await expect(page.getByText(/sin conexión con github/i)).toBeVisible();
    await expect(page.getByText('◌ local')).toBeVisible();
    // seed grid + no year selector + no new-repos block (no fake data)
    await expect(page.locator("[data-testid='hm-cell']").first()).toBeVisible();
    await expect(page.getByRole('button', { name: '2025' })).toHaveCount(0);
    await expect(page.getByText('$ ls ~/repos --nuevas')).toHaveCount(0);
  });
});
