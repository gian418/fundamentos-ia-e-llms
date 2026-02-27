import { test, expect } from '@playwright/test';

const APP_URL = 'https://erickwendel.github.io/vanilla-js-web-app-example/';
const STORAGE_KEY = 'tdd-ew-db';

async function resetAppState(page: import('@playwright/test').Page) {
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
  await page.reload({ waitUntil: 'domcontentloaded' });
}

test.describe('Vanilla JS web app example', () => {
  test('submitting a valid form appends a new card', async ({ page }) => {
    await resetAppState(page);

    const cards = page.getByRole('heading', { level: 4 });
    const initialCount = await cards.count();

    const title = `Playwright ${Date.now()}`;
    const imageUrl = 'https://erickwendel.github.io/vanilla-js-web-app-example/img/ai-alien.jpeg';

    await page.getByLabel('Image Title').fill(title);
    await page.getByLabel('Image URL').fill(imageUrl);

    await page.getByRole('button', { name: 'Submit Form' }).click();

    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    await expect(page.getByAltText(`Image of an ${title}`)).toBeVisible();

    await expect(cards).toHaveCount(initialCount + 1);

    await expect(page.getByLabel('Image Title')).toHaveValue('');
    await expect(page.getByLabel('Image URL')).toHaveValue('');

    await expect(page.locator('form.needs-validation')).not.toHaveClass(/was-validated/);
  });

  test('form validation blocks submission when fields are empty', async ({ page }) => {
    await resetAppState(page);

    const cards = page.getByRole('heading', { level: 4 });
    const initialCount = await cards.count();

    await page.getByRole('button', { name: 'Submit Form' }).click();

    await expect(page.locator('form.needs-validation')).toHaveClass(/was-validated/);
    await expect(page.getByText('Please type a title for the image.')).toBeVisible();
    await expect(page.getByText('Please type a valid URL')).toBeVisible();

    await expect(page.getByLabel('Image Title')).toBeFocused();
    await expect(cards).toHaveCount(initialCount);
  });

  test('form validation blocks submission for invalid URL', async ({ page }) => {
    await resetAppState(page);

    const cards = page.getByRole('heading', { level: 4 });
    const initialCount = await cards.count();

    await page.getByLabel('Image Title').fill('Some title');
    await page.getByLabel('Image URL').fill('not-a-url');

    await page.getByRole('button', { name: 'Submit Form' }).click();

    await expect(page.locator('form.needs-validation')).toHaveClass(/was-validated/);
    await expect(page.getByText('Please type a valid URL')).toBeVisible();
    await expect(page.getByLabel('Image URL')).toBeFocused();

    await expect(cards).toHaveCount(initialCount);
  });
});
