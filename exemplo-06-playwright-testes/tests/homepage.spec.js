const { test, expect } = require('@playwright/test');

test('homepage renders the gallery headings', async ({ page }) => {
  await page.goto('https://erickwendel.github.io/vanilla-js-web-app-example/', {
    waitUntil: 'domcontentloaded'
  });

  await expect(page.getByLabel('Image Title')).toBeVisible();
  await expect(page.getByLabel('Image URL')).toBeVisible();
  await expect(page.getByLabel('Submit Form')).toBeVisible();

  await expect(page.getByRole('heading', { name: 'AI Alien' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Predator Night Vision' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'ET Bilu' })).toBeVisible();
});
