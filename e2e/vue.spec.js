import { test, expect } from "@playwright/test";
import cleanup from "./cleanup";

test.beforeAll(async () => {
  await cleanup();
});

// import { fileURLToPath } from 'url'
// import { createServer } from 'vite'

// test('visits the app root url', async ({ page }) => {
//   await page.goto('/');
//   expect(await page.title()).toBe('My LMS');
// })

test("Craft some modules", async ({ page }) => {
  async function whenButtonIsVisible(name) {
    const locator = page.getByRole("button", { name });
    await locator.waitFor();
    expect(locator).toBeVisible();
  }
  async function clickButtonWithText(name) {
    const locator = page.getByRole("button", { name });
    await locator.waitFor();
    expect(locator).toBeVisible();
    await locator.click();
  }

  async function typeIntoPlaceholder(placeholder, text) {
    await page.getByPlaceholder(placeholder).click();
    await page.getByPlaceholder(placeholder).fill(text);
  }

  // const __dirname = fileURLToPath(new URL('.', import.meta.url))
  // const server = await createServer({
  //   root: __dirname,
  //   envFile: '.env.test.local',
  //   server: {
  //     port: 9000,
  //   },
  // })
  // await server.listen()

  // server.printUrls()

  await page.goto("/");
  expect(await page.title()).toBe("My LMS");

  // Switch to english
  await page.getByRole("menu").click();
  await page.getByRole("menuitem", { name: "🇺🇸" }).click();

  // Login
  const loginLink = await page.getByRole("link", { name: "Login" });
  await loginLink.click();
  await page.waitForURL("**/login");
  await typeIntoPlaceholder("name@example.com", process.env.TEST_USER_EMAIL);
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill(process.env.TEST_USER_PASSWORD);
  await clickButtonWithText("login");
  // Fill profile
  await page.waitForURL("**/profile");
  await typeIntoPlaceholder("Enter your name here", process.env.TEST_USER_NAME);
  await clickButtonWithText("Save");
  await whenButtonIsVisible(process.env.TEST_USER_NAME);

  // Back to home page
  await page.goto("/");
  const homePageLocator = page.getByText("Home page");
  expect(homePageLocator).toBeVisible();

  // Create course

  // 1. Go to courses page
  await page.getByRole("link", { name: "Courses" }).click();
  await page.waitForURL("**/module");

  // 2. Click create button
  await clickButtonWithText("Create course");

  // 3. Fill form
  await whenButtonIsVisible("Save");
  await typeIntoPlaceholder("enter course name here...", "Basic course name");
  await clickButtonWithText("Save");

  // 4. Navigate into course
  await clickButtonWithText("Basic course name");

  // 5. Click create button
  await clickButtonWithText("Create lesson");

  // 6. Fill form
  await whenButtonIsVisible("Save");
  await typeIntoPlaceholder("enter lesson name here...", "General lesson name");
  await clickButtonWithText("Save");

  // 7. Navigate into course
  await clickButtonWithText("General lesson name");

  // 8. Create Intro slide
  await clickButtonWithText("Create slide activity");
  await whenButtonIsVisible("Save");
  await typeIntoPlaceholder("Enter header here...", "Intro slide");
  await typeIntoPlaceholder(
    "Enter slide here...",
    "* Topic 1\n* Topic 2\n* Topic 3"
  );
  await clickButtonWithText("Save");
  await page.waitForTimeout(3000);

  // 9. Create word activity
  await clickButtonWithText("Create word activity");
  await whenButtonIsVisible("Save");
  await typeIntoPlaceholder("Enter foreign word here...", "word");
  await typeIntoPlaceholder("Enter translation here...", "word translation");
  await clickButtonWithText("Save");
  await page.waitForTimeout(1000);

  // 10. Create phrase activity
  await clickButtonWithText("Create phrase activity");
  await whenButtonIsVisible("Save");
  await typeIntoPlaceholder("Enter foreign phrase here...", "phrase");
  await typeIntoPlaceholder("Enter translation here...", "phrase translation");
  await clickButtonWithText("Save");
  await page.waitForTimeout(1000);

  await whenButtonIsVisible('Slide "Intro slide"');
  await whenButtonIsVisible('Word "word"');
  await whenButtonIsVisible('Phrase "phrase"');

  /*
  Word "word"
  edit
  Slide "Intro slide"
  edit
  Phrase "phrase"  
  */
  // // Lets learn a little
  // await page.getByRole('link', { name: 'Learning' }).click();
  // await page.getByRole('button', { name: 'Basic course name' }).click();
  // await page.getByRole('button', { name: 'Start course' }).click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByText('word', { exact: true }).click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByText('w', { exact: true }).click();
  // await page.getByText('o', { exact: true }).click();
  // await page.getByText('r', { exact: true }).click();
  // await page.getByText('d', { exact: true }).click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByText('translation', { exact: true }).click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByText('phrase', { exact: true }).click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByText('phrase', { exact: true }).click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByRole('button', { name: 'Exit lesson' }).nth(1).click();
  // await page.getByRole('button', { name: 'Exit course' }).nth(1).click();
  // await page.getByRole('button', { name: 'Add words to learn' }).click();
  // await page.getByPlaceholder('Enter foreign word here').click();
  // await page.getByPlaceholder('Enter foreign word here').fill('foreign');
  // await page.getByPlaceholder('Enter translation here').click();
  // await page.getByPlaceholder('Enter translation here').fill('translation here');
  // await page.getByLabel('Enabled').check();
  // await page.getByRole('button', { name: 'Save' }).click();
  // await page.getByRole('button', { name: 'Repeat words 3' }).click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByText('ContinueI don\'t remember').click();
  // await page.getByText('translation', { exact: true }).click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByText('translation', { exact: true }).click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByText('translation', { exact: true }).click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByText('translation here').click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByText('word', { exact: true }).click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByText('phrase', { exact: true }).click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByText('foreign').click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByText('w', { exact: true }).click();
  // await page.getByText('o', { exact: true }).click();
  // await page.getByText('r', { exact: true }).click();
  // await page.getByText('d', { exact: true }).click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByText('phrase', { exact: true }).click();
  // await page.getByRole('button', { name: 'Continue' }).click();
  // await page.getByText('f', { exact: true }).click();
  // await page.getByText('o', { exact: true }).click();
  // await page.getByText('r', { exact: true }).click();
  // await page.getByText('e', { exact: true }).click();
  // await page.getByText('i', { exact: true }).click();
  // await page.getByText('g', { exact: true }).click();
  // await page.getByText('n', { exact: true }).click();
  // await page.getByRole('button', { name: 'Continue' }).click();

  //await page.waitForURL('**/');

  //await new Promise(() => {});
});
