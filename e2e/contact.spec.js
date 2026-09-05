import { expect, test } from '@playwright/test';

async function boot(page) {
  await page.goto('/');
  await expect(page.locator('#loader')).toBeHidden({ timeout: 15_000 });
  await page.locator('#contacto').scrollIntoViewIfNeeded();
}

test.describe('contact form', () => {
  test('client validation blocks an empty submit before any request', async ({ page }) => {
    const calls = [];
    await page.route('**api.web3forms.com/**', (route) => {
      calls.push(route.request().url());
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
    });
    await boot(page);
    await page.getByRole('button', { name: '$ enviar' }).click();
    await expect(page.getByText(/cuéntame tu nombre/i)).toBeVisible();
    await expect(page.getByText(/correo inválido/i)).toBeVisible();
    await expect(page.getByText(/entre 4 y 2000 caracteres/i)).toBeVisible();
    expect(calls).toHaveLength(0);
  });

  test('successful submit reaches web3forms and shows the success state', async ({ page }) => {
    const bodies = [];
    await page.route('**api.web3forms.com/**', async (route) => {
      bodies.push(route.request().postDataJSON());
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
    });
    await boot(page);
    await page.locator("#cf-name").fill('Ada');
    await page.locator("#cf-email").fill('ada@lovelace.cl');
    await page.locator("#cf-message").fill('hola, vi tu portafolio');
    await page.getByRole('button', { name: '$ enviar' }).click();
    const dialog = page.getByRole('dialog', { name: 'mensaje enviado' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/mensaje enviado — te respondo pronto/)).toBeVisible();
    await dialog.getByRole('button', { name: 'OK' }).click();
    await expect(dialog).toBeHidden();
    expect(bodies[0]).toMatchObject({ name: 'Ada', email: 'ada@lovelace.cl' });
    // honeypot present for bots
    expect(await page.locator('input[name="botcheck"]').count()).toBe(1);
  });

  test('failure shows the inline error + copy-email, never a mailto', async ({ page }) => {
    await page.route('**api.web3forms.com/**', (route) => route.abort());
    await boot(page);
    await page.locator("#cf-name").fill('Ada');
    await page.locator("#cf-email").fill('ada@lovelace.cl');
    await page.locator("#cf-message").fill('hola desde e2e');
    await page.getByRole('button', { name: '$ enviar' }).click();
    await expect(page.getByText(/✗ no se pudo enviar/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /copia mi correo/i })).toBeVisible();
    expect(await page.locator('a[href^="mailto:"]').count()).toBe(0);
  });
});
