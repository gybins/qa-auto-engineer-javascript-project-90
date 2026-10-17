import { test, expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage.js";

test("Successful login", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  const username = "user";
  const password = "password";

  await loginPage.login(username, password);

  await expect(loginPage.avatar).toBeVisible();
});

test("Successful logout", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  const username = "user";
  const password = "password";

  await loginPage.login(username, password);

  await expect(loginPage.avatar).toBeVisible();

  await loginPage.logout();

  await expect(loginPage.button).toBeVisible();
});