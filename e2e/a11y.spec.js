import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = ['/', '/aviso-legal', '/politica-de-privacidad'];
const VIEWPORTS = [
  [1440, 900],
  [768, 1024],
  [390, 844],
];

for (const [width, height] of VIEWPORTS) {
  for (const path of PAGES) {
    test(`axe ${path} @ ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto(path);
      await expect(page.locator('#loader')).toBeHidden({ timeout: 15_000 });
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      const blocking = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      );
      if (blocking.length > 0) {
        console.log(
          `axe ${path} ${width}x${height}:`,
          JSON.stringify(blocking.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }))),
        );
      }
      expect(blocking).toEqual([]);
    });
  }
}
