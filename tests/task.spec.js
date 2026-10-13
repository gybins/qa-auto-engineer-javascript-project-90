import { test, expect } from "@playwright/test";
import TaskPage from "../pages/TaskPage.js";
import LoginPage from "../pages/LoginPage.js";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("user", "password");

  await expect(loginPage.avatar).toBeVisible();
});

test("check task create form", async ({ page }) => {
  const taskPage = new TaskPage(page);

  await taskPage.goto();
  await taskPage.openCreateForm();

  await expect(page).toHaveURL(/\/#\/tasks\/create$/);

  await expect(taskPage.assignee).toBeVisible();
  await expect(taskPage.title).toBeVisible();
  await expect(taskPage.content).toBeVisible();
  await expect(taskPage.status).toBeVisible();
  await expect(taskPage.label).toBeVisible();
  await expect(taskPage.saveButton).toBeVisible();
});

test("create task", async ({ page }) => {
  const taskPage = new TaskPage(page);

  await taskPage.goto();
  await taskPage.openCreateForm();

  const assignee = "sarah@example.com";
  const title = "Automation task";
  const content = "Task created by Playwright";
  const status = "To Review";
  const label = "enhancement";

  await taskPage.createTask(assignee, title, content, status, label);

  await expect(taskPage.successMessage).toBeVisible();

  await expect(taskPage.title).toHaveValue(title);
  await expect(taskPage.content).toHaveValue(content);
});
test("task list", async ({ page }) => {
  const taskPage = new TaskPage(page);

  await taskPage.goto();

  const taskCard = taskPage.getTaskCard("Task 15");

  await expect(taskCard).toBeVisible();
});

test("open edit task form", async ({ page }) => {
  const taskPage = new TaskPage(page);

  await taskPage.goto();

  await taskPage.openTaskEdit(15);

  await expect(taskPage.assignee).toBeVisible();
  await expect(taskPage.title).toBeVisible();
  await expect(taskPage.content).toBeVisible();
  await expect(taskPage.status).toBeVisible();
  await expect(taskPage.label).toBeVisible();
});

test("edit task", async ({ page }) => {
  const taskPage = new TaskPage(page);

  await taskPage.goto();

  await taskPage.openTaskEdit(15);

  const newTitle = "Task 15 updated";
  const newContent = "Updated by Playwright";

  await taskPage.title.fill(newTitle);
  await taskPage.content.fill(newContent);

  await taskPage.saveButton.click();

  await expect(page).toHaveURL(/\/#\/tasks$/);

  await expect(page.getByText("Element updated")).toBeVisible();

  await expect(taskPage.getTaskCard(newTitle)).toBeVisible();
});

test("filter tasks by label", async ({ page }) => {
  const taskPage = new TaskPage(page);

  await taskPage.goto();

  await taskPage.filterByLabel("critical");

  await expect(taskPage.getTaskCard("Task 15")).toBeVisible();
});

test("filter tasks by status", async ({ page }) => {
  const taskPage = new TaskPage(page);

  await taskPage.goto();

  await taskPage.filterByStatus("Published");

  await expect(
    taskPage.getTaskCard("Task 15")
  ).toBeVisible();
});

test("filter tasks by assignee", async ({ page }) => {
  const taskPage = new TaskPage(page);

  await taskPage.goto();

  await taskPage.filterByAssignee("john@google.com");

  await expect(
    taskPage.getTaskCard("Task 15")
  ).toBeVisible();
});

test("delete task", async ({ page }) => {
  const taskPage = new TaskPage(page);

  await taskPage.goto();
  await taskPage.openCreateForm();

  const title = "Task for delete";

  await taskPage.createTask(
    "sarah@example.com",
    title,
    "Task will be deleted",
    "Draft",
    "task"
  );

  await expect(taskPage.successMessage).toBeVisible();

  await taskPage.deleteButton.click();

  await expect(page.getByText("Element deleted")).toBeVisible();

  await expect(
    taskPage.getTaskCard(title)
  ).not.toBeVisible();
});

test("move task between columns", async ({ page }) => {
  const taskPage = new TaskPage(page);

  await taskPage.goto();
  await taskPage.openCreateForm();

  const title = "Task for drag";

  await taskPage.createTask(
    "sarah@example.com",
    title,
    "Drag and drop test",
    "Draft",
    "task"
  );

  await expect(taskPage.successMessage).toBeVisible();

  await taskPage.goto();

  await expect(taskPage.getTaskCard(title)).toBeVisible();

  await taskPage.moveTask(title, "To Review");

  await taskPage.filterByStatus("To Review");

  await expect(
    taskPage.getTaskCard(title)
  ).toBeVisible();
});