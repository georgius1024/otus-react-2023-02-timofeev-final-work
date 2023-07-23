import { test, expect } from "@playwright/test";
import cleanup from "./cleanup";

test.beforeAll(async () => {
  await cleanup();
});

test("Long user jorney", async ({ page }) => {
  //#region utilities
  async function whenButtonIsVisible(name, nth = 0) {
    const locator = page.getByRole("button", { name }).nth(nth);
    await locator.waitFor();
    await expect(locator).toBeVisible();
  }

  async function clickButtonWithText(name, nth = 0) {
    const locator = page.getByRole("button", { name }).nth(nth);
    await locator.waitFor();
    await expect(locator).toBeVisible();
    await locator.click();
  }

  async function typeIntoPlaceholder(placeholder, text) {
    await page.getByPlaceholder(placeholder).click();
    await page.getByPlaceholder(placeholder).fill(text);
  }

  async function clickLinkWithText(name, nth = 0) {
    const locator = page.getByRole("link", { name }).nth(nth);
    await locator.waitFor();
    await expect(locator).toBeVisible();
    await locator.click();
  }

  async function checkButtonWithTextIsDisabled(name, nth = 0) {
    const locator = page.getByRole("button", { name }).nth(nth);
    await locator.waitFor();
    await expect(locator).toBeDisabled();
  }

  async function checkButtonWithTextIsEnabled(name, nth = 0) {
    const locator = page.getByRole("button", { name }).nth(nth);
    await locator.waitFor();
    await expect(locator).not.toBeDisabled();
  }

  async function whenTextIsVisible(text, nth = 0) {
    const locator = page.getByText(text).nth(nth);
    await locator.waitFor();
    await expect(locator).toBeVisible();
  }

  async function whenHeadingIsVisible(name, nth = 0) {
    const locator = page.getByRole("heading", { name }).nth(nth);
    await locator.waitFor();
    await expect(locator).toBeVisible();
  }
  async function continueActivity(name = "Continue") {
    const locator = page.getByRole("button", { name });
    await locator.waitFor();
    await expect(locator).toBeVisible();
    const disabled = await locator.isDisabled();
    if (disabled) {
      await page.waitForTimeout(1000);
    }
    await expect(locator).not.toBeDisabled();
    await locator.click();
  }
  //#endregion

  //#region Initial navigation
  await page.goto("/");
  expect(await page.title()).toBe("Chiroyli LMS");
  //#endregion

  //#region Switch to english
  await page.getByRole("menu").click();
  await page.getByRole("menuitem", { name: "🇺🇸" }).click();
  //#endregion

  //#region Login
  await clickLinkWithText("Login");
  await page.waitForURL("**/login");
  await typeIntoPlaceholder("name@example.com", process.env.TEST_USER_EMAIL);
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill(process.env.TEST_USER_PASSWORD);
  await clickButtonWithText("login");
  //#endregion
  //#region Fill profile
  await page.waitForURL("**/profile");
  await typeIntoPlaceholder("Enter your name here", process.env.TEST_USER_NAME);
  await clickButtonWithText("Save");
  await whenButtonIsVisible(process.env.TEST_USER_NAME);
  //#endregion

  //#region Back to home page
  await page.goto("/");
  await whenHeadingIsVisible("Home page");
  //#endregion

  //#region create Content
  // 1. Go to courses page
  await clickLinkWithText("Courses");
  await page.waitForURL("**/module");
  await whenHeadingIsVisible("Courses");

  //#region Create course

  // 2. Click create button
  await clickButtonWithText("Create course");

  // 3. Fill form
  await whenButtonIsVisible("Save");
  await typeIntoPlaceholder("enter course name here...", "Basic course name");
  await clickButtonWithText("Save");

  // 4. Navigate into course
  await clickButtonWithText("Basic course name");
  //#endregion

  //#region Create lesson
  // 5. Click create button
  await clickButtonWithText("Create lesson");

  // 6. Fill form
  await whenButtonIsVisible("Save");
  await typeIntoPlaceholder("enter lesson name here...", "General lesson name");
  await clickButtonWithText("Save");

  // 7. Navigate into lesson
  await clickButtonWithText("General lesson name");
  //#endregion

  //#region Create activities
  // 8. Create Intro slide
  await clickButtonWithText("Create slide activity");
  await whenButtonIsVisible("Save");
  await typeIntoPlaceholder("Enter header here...", "Intro slide");
  await typeIntoPlaceholder(
    "Enter slide here...",
    "* Topic 1\n* Topic 2\n* Topic 3"
  );
  await clickButtonWithText("Save");
  await whenButtonIsVisible('Slide "Intro slide"');

  // 9. Create word activity
  await clickButtonWithText("Create word activity");
  await whenButtonIsVisible("Save");
  await typeIntoPlaceholder("Enter foreign word here...", "word");
  await typeIntoPlaceholder("Enter translation here...", "word translation");
  await clickButtonWithText("Save");
  await whenButtonIsVisible('Word "word"');

  // 10. Create phrase activity
  await clickButtonWithText("Create phrase activity");
  await whenButtonIsVisible("Save");
  await typeIntoPlaceholder("Enter foreign phrase here...", "phrase");
  await typeIntoPlaceholder("Enter translation here...", "phrase translation");
  await clickButtonWithText("Save");
  await whenButtonIsVisible('Phrase "phrase"');
  //#endregion

  //#endregion

  //#region Back to home page
  await page.goto("/");
  await whenHeadingIsVisible("Home page");
  //#endregion
  //#region Learning page
  await clickLinkWithText("Learning");
  await page.waitForURL("**/learning");
  await whenHeadingIsVisible("Your courses");

  //#region Inspect buttons
  await whenButtonIsVisible("Basic course name");
  await checkButtonWithTextIsDisabled("Continue training");
  await checkButtonWithTextIsDisabled("Repeat words");
  await checkButtonWithTextIsEnabled("Add words to learn");
  //#endregion

  //#region add custom word to learn
  await clickButtonWithText("Add words to learn");
  await page.waitForURL("**/learning/repetition/add");
  await whenButtonIsVisible("Save");
  await typeIntoPlaceholder("Enter foreign word here...", "custom");
  await typeIntoPlaceholder("Enter translation here...", "custom translation");
  await clickButtonWithText("Save");
  await page.waitForURL("**/learning");
  //#endregion

  //#region Start the course
  await clickButtonWithText("Basic course name");
  await whenButtonIsVisible("Start course");
  await clickButtonWithText("Start course");
  await page.waitForURL("**/learning/course/**");
  await whenHeadingIsVisible("General lesson name");
  //#endregion

  //#region Return to learning and continue course
  await clickLinkWithText("Learning");
  await page.waitForURL("**/learning");
  await whenHeadingIsVisible("Your courses");
  await whenTextIsVisible("Basic course name");
  await whenTextIsVisible("in progress");
  await checkButtonWithTextIsEnabled("Continue training");
  await clickButtonWithText("Continue training");
  await page.waitForURL("**/learning/course/**");
  await whenTextIsVisible("in progress");
  await whenTextIsVisible("General lesson name");
  await checkButtonWithTextIsEnabled("Continue training");
  await clickButtonWithText("Continue training");
  await page.waitForURL("**/learning/course/**");
  await whenHeadingIsVisible("General lesson name");
  //#endregion

  //#region Learning activities
  await whenHeadingIsVisible("Intro slide");
  continueActivity(); // Slide
  await whenHeadingIsVisible("Please remember the word");
  continueActivity(); // Learn word
  await whenHeadingIsVisible("Please select translation for the word");
  await page.getByText("word translation", { exact: true }).click();
  continueActivity(); // Translate from foreign to local
  await whenHeadingIsVisible("Please select word for the translation");
  await page.getByText("word", { exact: true }).click();
  continueActivity(); // Translate from local to foreign
  await whenHeadingIsVisible("Please assemble word");
  await page.getByText("w", { exact: true }).click();
  await page.getByText("o", { exact: true }).click();
  await page.getByText("r", { exact: true }).click();
  await page.getByText("d", { exact: true }).click();
  continueActivity(); // Assemble
  await whenHeadingIsVisible("Please remember the phrase");
  continueActivity(); // Learn phrase
  await whenHeadingIsVisible("Please select translation for the phrase");
  await page.getByText("phrase translation", { exact: true }).click();
  continueActivity(); // Translate from foreign to local
  await whenHeadingIsVisible("Please select phrase for the translation");
  await page.getByText("phrase", { exact: true }).click();
  continueActivity(); // Translate from local to foreign
  await whenHeadingIsVisible("Please assemble phrase");
  await page.getByText("phrase", { exact: true }).click();
  continueActivity(); // Assemble
  //#endregion

  //#region Ending course
  await whenHeadingIsVisible("Congratulations");
  await clickButtonWithText("Exit lesson", 1);
  await whenHeadingIsVisible("Basic course name");
  await whenHeadingIsVisible("Congratulations");
  await clickButtonWithText("Exit course", 1);
  //#endregion

  //#region repeat words
  await page.waitForURL("**/learning");
  await whenHeadingIsVisible("Your courses");
  await whenTextIsVisible("Basic course name");
  await whenTextIsVisible("done");

  await checkButtonWithTextIsDisabled("Continue training");
  await checkButtonWithTextIsEnabled("Repeat words");
  await clickButtonWithText("Repeat words");

  await page.waitForURL("**/learning/repetition/**");
  await whenHeadingIsVisible("Repetition of words");

  await clickButtonWithText("I don't remember");
  await clickButtonWithText("I don't remember");
  await clickButtonWithText("I don't remember");
  await clickButtonWithText("I don't remember");
  await clickButtonWithText("I don't remember");
  await clickButtonWithText("I don't remember");
  await clickButtonWithText("I don't remember");
  await clickButtonWithText("I don't remember");
  await clickButtonWithText("I don't remember");
  await clickButtonWithText("I don't remember");
  await clickButtonWithText("I don't remember");
  await clickButtonWithText("I don't remember");
  await page.waitForURL("**/");
  await whenHeadingIsVisible("Home page");

  //#endregion

  //#endregion
  //#region Inspect students page
  await clickLinkWithText("Students");
  await page.waitForURL("**/students");
  await whenHeadingIsVisible("Students");
  await whenTextIsVisible(process.env.TEST_USER_NAME, 1);
  //#endregion

  //#region Inspect students page
  await clickButtonWithText(process.env.TEST_USER_NAME);
  await clickLinkWithText("Stats");
  await page.waitForURL("**/stats");
  await whenHeadingIsVisible("My Stats");
  await whenTextIsVisible("custom");
  await whenTextIsVisible("phrase");
  await whenTextIsVisible("word");
  //#endregion
});
