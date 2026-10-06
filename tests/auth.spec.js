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
  const logoutPage = new LoginPage(page);

  await logoutPage.goto();

  const username = "user";
  const password = "password";

  await logoutPage.login(username, password);
  await expect(logoutPage.avatar).toBeVisible();

  await logoutPage.logout();
  await expect(logoutPage.button).toBeVisible();
});
