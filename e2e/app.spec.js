import { expect, test } from '@playwright/test';

/** Boot helper: goto + wait for the ~2s loader to finish. */
export async function boot(page, path = '/') {
  await page.goto(path);
  await expect(page.locator('#loader')).toBeHidden({ timeout: 15_000 });
}

test.describe('smoke', () => {
  test('all sections render after the loader', async ({ page }) => {
    await boot(page);
    for (const id of ['sobre-mi', 'stack', 'actividad', 'proyectos', 'roadmap', 'certificados', 'contacto']) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
    await expect(page.locator('h1')).toContainText(/alexis/i);
  });

  test('footer links open the legal routes and nav returns home', async ({ page }) => {
    await boot(page);
    await page.getByRole('link', { name: 'aviso legal' }).click();
    await expect(page.getByRole('heading', { name: 'Aviso Legal' })).toBeVisible();
    await page.getByRole('link', { name: 'privacidad' }).click();
    await expect(page.getByRole('heading', { name: 'Política de Privacidad' })).toBeVisible();
    await page.locator('nav').getByRole('link', { name: /04\./ }).click();
    await expect(page.locator('#proyectos')).toBeAttached();
  });

  test('mobile menu opens, navigates and closes', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await boot(page);
    await page.getByRole('button', { name: 'abrir menú' }).click();
    const dialog = page.getByRole('dialog', { name: 'menú de secciones' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('link', { name: /05\./ }).click();
    await expect(dialog).toBeHidden();
    await expect(page.locator('#roadmap')).toBeAttached();
  });
});

test.describe('theme', () => {
  test('day/night toggle persists across reloads', async ({ page }) => {
    await boot(page);
    const toggle = page.getByRole('switch', { name: /cambiar a modo/i });
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    expect(await page.evaluate(() => localStorage.getItem('alexdevos-theme'))).toBe('light');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.getByRole('switch', { name: /cambiar a modo/i }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});

test.describe('roadmap', () => {
  test('progress bar fills once to node 4 and is never scroll-scrubbed', async ({ page }) => {
    await boot(page);
    await page.locator('#roadmap').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2200); // fill animation (1.6s) + settle
    const scaleY = () => page.locator('.tl-progress').evaluate((el) => getComputedStyle(el).transform);
    const first = await scaleY();
    await page.locator('#contacto').scrollIntoViewIfNeeded();
    await page.locator('#roadmap').scrollIntoViewIfNeeded();
    const second = await scaleY();
    expect(second).toBe(first);
    const f = Number(second.split(',')[3]); // matrix(1,0,0,f,0,0)
    expect(f).toBeGreaterThan(0.5); // ends near node 4 of 5
  });
});

test.describe('certificates', () => {
  test('viewer opens, types the ledger, closes and returns focus', async ({ page }) => {
    await boot(page);
    // badges reveal on scroll — bring the section in first
    await page.evaluate(() => document.querySelector('#certificados').scrollIntoView());
    await page.waitForTimeout(1500);
    const badge = page.getByRole('button', { name: /ver certificado/ }).first();
    await badge.click();
    const dialog = page.getByRole('dialog', { name: 'visor de certificados' });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('.cert-pre')).toContainText('verify', { timeout: 8000 });
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(badge).toBeFocused();
  });
});

test.describe('terminal + doom', () => {
  test('boots, answers help, launches doom on desktop and closes it', async ({ page }) => {
    await boot(page);
    const input = page.getByLabel('entrada de comandos de la terminal');
    await expect(input).toBeVisible({ timeout: 20_000 });
    await input.fill('help');
    await input.press('Enter');
    await expect(page.getByTestId('terminal-body')).toContainText('doom', { timeout: 5000 });

    await input.fill('doom.exe');
    await input.press('Enter');
    const frame = page.locator('iframe[src*="doom1"]');
    await expect(frame).toBeVisible({ timeout: 15_000 });

    await page.getByRole('button', { name: 'cerrar doom' }).click();
    const quitYes = page.getByRole('button', { name: 'salir' });
    if (await quitYes.isVisible().catch(() => false)) await quitYes.click();
    await expect(frame).toBeHidden({ timeout: 10_000 });
  });

  test('whoami, ls and the stack readme window behave as designed', async ({ page }) => {
    await boot(page);
    const input = page.getByLabel('entrada de comandos de la terminal');
    await expect(input).toBeVisible({ timeout: 20_000 });
    const body = page.getByTestId('terminal-body');

    await input.fill('whoami');
    await input.press('Enter');
    await expect(body).toContainText('Alexis Hernández Camus');
    await expect(body).not.toContainText('futuro');

    await input.fill('ls');
    await input.press('Enter');
    await expect(body).toContainText('doom.exe*');

    await input.fill('stack');
    await input.press('Enter');
    const dialog = page.getByRole('dialog', { name: 'stack del sistema' });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('.cert-pre')).toContainText('AlexDev_OS', { timeout: 8000 });
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
});
