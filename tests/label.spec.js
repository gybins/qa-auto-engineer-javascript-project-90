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

test("create label", async ({ page }) => {
  const labelPage = new LabelPage(page);

  await labelPage.goto();
  await labelPage.openCreateForm();

  const name = "automation";

  await labelPage.createLabel(name);

  await expect(labelPage.successMessage).toBeVisible();
  await expect(labelPage.name).toHaveValue(name);
});

test("label list", async ({ page }) => {
  const labelPage = new LabelPage(page);

  await labelPage.goto();

  await expect(labelPage.nameHeader).toBeVisible();

  const labelRow = labelPage.getLabelRow("bug");

  await expect(labelRow).toBeVisible();
  await expect(labelRow).toContainText("bug");
});

test("open edit label form", async ({ page }) => {
  const labelPage = new LabelPage(page);

  await labelPage.goto();

  await labelPage.openLabel("bug");

  await expect(labelPage.name).toBeVisible();
  await expect(labelPage.name).toHaveValue("bug");
});

test("edit label", async ({ page }) => {
  const labelPage = new LabelPage(page);

  await labelPage.goto();

  const oldName = "bug";
  const newName = "bug updated";

  await labelPage.openLabel(oldName);

  await labelPage.name.fill(newName);
  await labelPage.saveButton.click();

  await expect(page).toHaveURL(/\/#\/labels$/);
  await expect(labelPage.updateMessage).toBeVisible();

  const labelRow = labelPage.getLabelRow(newName);

  await expect(labelRow).toBeVisible();
  await expect(labelRow).toContainText(newName);
 
});

test("delete label", async ({ page }) => {
  const labelPage = new LabelPage(page);

  await labelPage.goto();

  const labelName = "bug";

  await labelPage.getLabelCheckbox(labelName).check();
  await labelPage.deleteButton.click();

  await expect(labelPage.deleteMessage).toBeVisible();

  await expect(
    labelPage.getLabelRow(labelName)
  ).toHaveCount(0);
});

test("delete all labels", async ({ page }) => {
  const labelPage = new LabelPage(page);

  await labelPage.goto();

  await labelPage.selectAllCheckbox.check();

  await expect(labelPage.selectAllCheckbox).toBeChecked();

  await labelPage.deleteButton.click();

  await expect(labelPage.bulkDeleteMessage).toBeVisible();
  await expect(labelPage.emptyLabelsMessage).toBeVisible();
});