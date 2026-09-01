import { defineConfig } from '@playwright/test';

/**
 * E2E config — production preview (built dist) on :4173.
 * Viewport matrix from the QA policy: 1440x900 default; 390x844 / 768x1024
 * set per-test where the scenario needs them.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
