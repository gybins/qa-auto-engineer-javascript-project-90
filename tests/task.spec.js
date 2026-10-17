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

test("create task", async ({ page }, testInfo) => {
  const taskPage = new TaskPage(page);

  const title =
    `create-${testInfo.project.name}-${testInfo.workerIndex}-${Date.now()}`;

  await taskPage.goto();
  await taskPage.openCreateForm();

  await taskPage.createTask(
    "sarah@example.com",
    title,
    "Task created by Playwright",
    "To Review",
    "enhancement"
  );

  await expect(taskPage.successMessage).toBeVisible();
  await expect(taskPage.title).toHaveValue(title);
  await expect(taskPage.content).toHaveValue(
    "Task created by Playwright"
  );
});

test("task list", async ({ page }, testInfo) => {
  const taskPage = new TaskPage(page);

  const title =
    `list-${testInfo.project.name}-${testInfo.workerIndex}-${Date.now()}`;

  await taskPage.goto();
  await taskPage.openCreateForm();

  await taskPage.createTask(
    "sarah@example.com",
    title,
    "Task list test",
    "Draft",
    "task"
  );

  await taskPage.goto();

  await expect(taskPage.getTaskCard(title)).toBeVisible();
});

test("open edit task form", async ({ page }, testInfo) => {
  const taskPage = new TaskPage(page);

  const title =
    `edit-form-${testInfo.project.name}-${testInfo.workerIndex}-${Date.now()}`;

  await taskPage.goto();
  await taskPage.openCreateForm();

  await taskPage.createTask(
    "sarah@example.com",
    title,
    "Open edit form test",
    "Draft",
    "task"
  );

  const taskId = taskPage.getCurrentTaskId();

  expect(taskId).not.toBeNull();

  await taskPage.goto();
  await taskPage.openTaskEdit(taskId);

  await expect(taskPage.assignee).toBeVisible();
  await expect(taskPage.title).toBeVisible();
  await expect(taskPage.content).toBeVisible();
  await expect(taskPage.status).toBeVisible();
  await expect(taskPage.label).toBeVisible();
});

test("edit task", async ({ page }, testInfo) => {
  const taskPage = new TaskPage(page);

  const timestamp = Date.now();

  const oldTitle =
    `before-edit-${testInfo.project.name}-${testInfo.workerIndex}-${timestamp}`;

  const newTitle =
    `after-edit-${testInfo.project.name}-${testInfo.workerIndex}-${timestamp}`;

  await taskPage.goto();
  await taskPage.openCreateForm();

  await taskPage.createTask(
    "sarah@example.com",
    oldTitle,
    "Before update",
    "Draft",
    "task"
  );

  const taskId = taskPage.getCurrentTaskId();

  expect(taskId).not.toBeNull();

  await taskPage.goto();
  await taskPage.openTaskEdit(taskId);

  await taskPage.title.fill(newTitle);
  await taskPage.content.fill("Updated by Playwright");

  await taskPage.saveButton.click();

  await expect(page).toHaveURL(/\/#\/tasks$/);
  await expect(page.getByText("Element updated")).toBeVisible();

  await expect(taskPage.getTaskCard(newTitle)).toBeVisible();
});

test("filter tasks by label", async ({ page }, testInfo) => {
  const taskPage = new TaskPage(page);

  const title =
    `label-filter-${testInfo.project.name}-${testInfo.workerIndex}-${Date.now()}`;

  await taskPage.goto();
  await taskPage.openCreateForm();

  await taskPage.createTask(
    "sarah@example.com",
    title,
    "Label filter test",
    "Draft",
    "critical"
  );

  await taskPage.goto();
  await taskPage.filterByLabel("critical");

  await expect(taskPage.getTaskCard(title)).toBeVisible();
});

test("filter tasks by status", async ({ page }, testInfo) => {
  const taskPage = new TaskPage(page);

  const title =
    `status-filter-${testInfo.project.name}-${testInfo.workerIndex}-${Date.now()}`;

  await taskPage.goto();
  await taskPage.openCreateForm();

  await taskPage.createTask(
    "sarah@example.com",
    title,
    "Status filter test",
    "Published",
    "task"
  );

  await taskPage.goto();
  await taskPage.filterByStatus("Published");

  await expect(taskPage.getTaskCard(title)).toBeVisible();
});

test("filter tasks by assignee", async ({ page }, testInfo) => {
  const taskPage = new TaskPage(page);

  const title =
    `assignee-filter-${testInfo.project.name}-${testInfo.workerIndex}-${Date.now()}`;

  await taskPage.goto();
  await taskPage.openCreateForm();

  await taskPage.createTask(
    "john@google.com",
    title,
    "Assignee filter test",
    "Draft",
    "task"
  );

  await taskPage.goto();
  await taskPage.filterByAssignee("john@google.com");

  await expect(taskPage.getTaskCard(title)).toBeVisible();
});

test("delete task", async ({ page }, testInfo) => {
  const taskPage = new TaskPage(page);

  const title =
    `delete-${testInfo.project.name}-${testInfo.workerIndex}-${Date.now()}`;

  await taskPage.goto();
  await taskPage.openCreateForm();

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
  await expect(taskPage.getTaskCard(title)).toHaveCount(0);
});

test("move task between columns", async ({ page }, testInfo) => {
  const taskPage = new TaskPage(page);

  const title =
    `drag-${testInfo.project.name}-${testInfo.workerIndex}-${Date.now()}`;

  await taskPage.goto();
  await taskPage.openCreateForm();

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

  await expect(taskPage.getTaskCard(title)).toBeVisible();
});