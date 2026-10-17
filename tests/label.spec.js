import { test, expect } from "@playwright/test";
import LabelPage from "../pages/LabelPage.js";
import LoginPage from "../pages/LoginPage.js";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("user", "password");

  await expect(loginPage.avatar).toBeVisible();
});

test("check label create form", async ({ page }) => {
  const labelPage = new LabelPage(page);

  await labelPage.goto();
  await labelPage.openCreateForm();

  await expect(page).toHaveURL(/\/#\/labels\/create$/);
  await expect(labelPage.name).toBeVisible();
  await expect(labelPage.saveButton).toBeVisible();
});

test("create label", async ({ page }, testInfo) => {
  const labelPage = new LabelPage(page);

  const name = `automation-${testInfo.project.name}-${Date.now()}`;

  await labelPage.goto();
  await labelPage.openCreateForm();
  await labelPage.createLabel(name);

  await expect(labelPage.successMessage).toBeVisible();
  await expect(labelPage.name).toHaveValue(name);
});

test("label list", async ({ page }, testInfo) => {
  const labelPage = new LabelPage(page);

  const name = `list-${testInfo.project.name}-${Date.now()}`;

  await labelPage.goto();
  await labelPage.openCreateForm();
  await labelPage.createLabel(name);

  await labelPage.goto();

  await expect(labelPage.nameHeader).toBeVisible();

  const labelRow = labelPage.getLabelRow(name);

  await expect(labelRow).toBeVisible();
  await expect(labelRow).toContainText(name);
});

test("open edit label form", async ({ page }, testInfo) => {
  const labelPage = new LabelPage(page);

  const name = `edit-form-${testInfo.project.name}-${Date.now()}`;

  await labelPage.goto();
  await labelPage.openCreateForm();
  await labelPage.createLabel(name);

  await labelPage.goto();
  await labelPage.openLabel(name);

  await expect(labelPage.name).toBeVisible();
  await expect(labelPage.name).toHaveValue(name);
});

test("edit label", async ({ page }, testInfo) => {
  const labelPage = new LabelPage(page);

  const oldName = `before-edit-${testInfo.project.name}-${Date.now()}`;
  const newName = `after-edit-${testInfo.project.name}-${Date.now()}`;

  await labelPage.goto();
  await labelPage.openCreateForm();
  await labelPage.createLabel(oldName);

  await labelPage.goto();
  await labelPage.openLabel(oldName);

  await labelPage.name.fill(newName);
  await labelPage.saveButton.click();

  await expect(page).toHaveURL(/\/#\/labels$/);
  await expect(labelPage.updateMessage).toBeVisible();

  const labelRow = labelPage.getLabelRow(newName);

  await expect(labelRow).toBeVisible();
  await expect(labelRow).toContainText(newName);
  await expect(labelPage.getLabelRow(oldName)).toHaveCount(0);
});

test("delete label", async ({ page }, testInfo) => {
  const labelPage = new LabelPage(page);

  const name = `delete-${testInfo.project.name}-${Date.now()}`;

  await labelPage.goto();
  await labelPage.openCreateForm();
  await labelPage.createLabel(name);

  await labelPage.goto();

  await labelPage.getLabelCheckbox(name).check();
  await labelPage.deleteButton.click();

  await expect(labelPage.deleteMessage).toBeVisible();
  await expect(labelPage.getLabelRow(name)).toHaveCount(0);
});

test("delete several labels", async ({ page }, testInfo) => {
  const labelPage = new LabelPage(page);

  const timestamp = Date.now();
  const firstLabel = `bulk-1-${testInfo.project.name}-${timestamp}`;
  const secondLabel = `bulk-2-${testInfo.project.name}-${timestamp}`;

  await labelPage.goto();
  await labelPage.openCreateForm();
  await labelPage.createLabel(firstLabel);

  await labelPage.goto();
  await labelPage.openCreateForm();
  await labelPage.createLabel(secondLabel);

  await labelPage.goto();

  await labelPage.getLabelCheckbox(firstLabel).check();
  await labelPage.getLabelCheckbox(secondLabel).check();

  await labelPage.deleteButton.click();

  await expect(labelPage.bulkDeleteMessage).toBeVisible();

  await expect(labelPage.getLabelRow(firstLabel)).toHaveCount(0);
  await expect(labelPage.getLabelRow(secondLabel)).toHaveCount(0);
});