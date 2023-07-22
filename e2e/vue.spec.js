import { test, expect } from '@playwright/test';

test('visits the app root url', async ({ page }) => {
  await page.goto('/');
  expect(await page.title()).toBe('My LMS');
})
