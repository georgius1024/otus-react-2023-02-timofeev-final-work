import { test, expect } from '@playwright/test';

// test('visits the app root url', async ({ page }) => {
//   await page.goto('/');
//   expect(await page.title()).toBe('My LMS');
// })


test('login', async ({ page }) => {
  await page.goto('/');
  expect(await page.title()).toBe('My LMS');
  await page.getByRole('menu').click();
  await page.getByRole('menuitem', {name: '🇺🇸'}).click()

  const loginLink = await page.getByRole('link', {name: 'Login'})

  await loginLink.click()

  await page.waitForURL('**/login');

  await page.getByPlaceholder('name@example.com').click();
  await page.getByPlaceholder('name@example.com').fill('georgius@ural.ru');

  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('2vAfi5dERDSxj7y');

  await page.getByRole('button', { name: 'Login' }).click();
  
  await page.waitForURL('**/');

  await page.getByText('Home page').waitFor()
  //await new Promise(() => {})
  expect(await page.getByText('Home page')).toBeVisible();

})
