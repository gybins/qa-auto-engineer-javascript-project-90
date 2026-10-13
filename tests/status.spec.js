import { test, expect } from "@playwright/test";
import StatusPage from "../pages/StatusPage.js";
import LoginPage from "../pages/LoginPage.js";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("user", "password");

  await expect(loginPage.avatar).toBeVisible();
});

test("check status create form", async ({ page }) => {
  const statusPage = new StatusPage(page);

  await statusPage.goto();
  await statusPage.openCreateForm();

  await expect(page).toHaveURL(/\/#\/task_statuses\/create$/);

  await expect(statusPage.name).toBeVisible();
  await expect(statusPage.slug).toBeVisible();
  await expect(statusPage.saveButton).toBeVisible();
});

test("create status", async ({ page }) => {
  const statusPage = new StatusPage(page);

  await statusPage.goto();
  await statusPage.openCreateForm();

  const name = "In progress";
  const slug = "in_progress";

  await statusPage.createStatus(name, slug);

  await expect(statusPage.successStatusCreate).toBeVisible();

  await expect(statusPage.name).toHaveValue(name);
  await expect(statusPage.slug).toHaveValue(slug);
});

test("status list", async ({ page }) => {
  const statusPage = new StatusPage(page);

  await statusPage.goto();

  await expect(statusPage.nameHeader).toBeVisible();
  await expect(statusPage.slugHeader).toBeVisible();

  const statusRow = page.getByRole("row").filter({ hasText: "Draft" });

  await expect(statusRow).toBeVisible();
  await expect(statusRow).toContainText("draft");
});

test("open edit status form", async ({ page }) => {
  const statusPage = new StatusPage(page);

  await statusPage.goto();

  const statusName = "Draft";

  await statusPage.openStatus(statusName);

  await expect(statusPage.name).toBeVisible();
  await expect(statusPage.slug).toBeVisible();
});

test('edit status form', async ({ page }) => {
    const statusPage = new StatusPage(page)

    await statusPage.goto()

    const statusName = 'Draft'

    await statusPage.openStatus(statusName)

    const oldName = await statusPage.name.inputValue()
    const newName = 'Ready'

    const newSlug = 'ready'

    await statusPage.name.fill(newName)
    await statusPage.slug.fill(newSlug)

    await statusPage.saveButton.click()

    await expect(page).toHaveURL(/\/#\/task_statuses$/)

    await expect(statusPage.updateMessage).toBeVisible()

    const statusRow = statusPage.getStatusRow(newName)

    await expect(statusRow).toBeVisible()
    await expect(statusRow).not.toContainText(oldName)
})

test("delete status", async ({ page }) => {
  const statusPage = new StatusPage(page);

  await statusPage.goto();

  const statusName = "Draft";

  await statusPage.getStatusCheckbox(statusName).check();

  await statusPage.deleteButton.click();

  await expect(statusPage.deleteMessage).toBeVisible();

  await expect(
    statusPage.getStatusRow(statusName)
  ).toHaveCount(0);
});

test("delete all statuses", async ({ page }) => {
  const statusPage = new StatusPage(page);

  await statusPage.goto();

  await statusPage.selectAllCheckBox.check();

  await expect(statusPage.selectAllCheckBox).toBeChecked();

  await statusPage.deleteButton.click();

  await expect(statusPage.bulkDeleteMessage).toBeVisible();
  await expect(statusPage.emptyStatusesMessage).toBeVisible();
});