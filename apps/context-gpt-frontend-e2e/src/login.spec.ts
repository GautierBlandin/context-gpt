import { expect, test } from '@playwright/test';

test('login page', async ({ page }) => {
  // Navigate to the login page
  await page.goto('/login');

  // Check if the string "Access Token" is present somewhere on the page
  const pageContent = await page.textContent('body');
  expect(pageContent).toContain('Log in');
});
