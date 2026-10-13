export default class TaskPage {
  constructor(page) {
    this.page = page;

    this.createButton = page.locator('a[href="#/tasks/create"]');

    this.assignee = page.getByRole("combobox", {
      name: /Assignee/i,
    });

    this.title = page.locator('input[name="title"]');
    this.content = page.locator('textarea[name="content"]');

    this.status = page.getByRole("combobox", {
      name: /Status/i,
    });

    this.label = page.getByRole("combobox", {
      name: /Label/i,
    });

    this.saveButton = page.getByRole("button", {
      name: "Save",
    });

    this.successMessage = page.getByText("Element created");

    this.assigneeFilter = page.getByRole("combobox", {
      name: /Assignee/i,
    });

    this.statusFilter = page.getByRole("combobox", {
      name: /Status/i,
    });

    this.labelFilter = page.getByRole("combobox", {
      name: /Label/i,
    });
    this.deleteButton = page.getByRole("button", {
      name: /Delete/i,
    });
  }

  async goto() {
    await this.page.goto("/#/tasks");
  }

  async openCreateForm() {
    await this.createButton.click();
  }

  async createTask(assignee, title, content, status, label) {
    await this.assignee.click();
    await this.page.getByRole("option", { name: assignee }).click();

    await this.title.fill(title);
    await this.content.fill(content);

    await this.status.click();
    await this.page.getByRole("option", { name: status }).click();

    await this.label.click();
    await this.page.getByRole("option", { name: label }).click();

    await this.page.keyboard.press("Escape");

    await this.saveButton.click();
  }

  getTaskEditButton(taskId) {
    return this.page.locator(`a[href="#/tasks/${taskId}"]`);
  }

  async openTaskEdit(taskId) {
    await this.getTaskEditButton(taskId).click();
  }

  async filterByAssignee(assignee) {
    await this.assigneeFilter.click();
    await this.page.getByRole("option", { name: assignee }).click();
  }

  async filterByStatus(status) {
    await this.statusFilter.click();
    await this.page.getByRole("option", { name: status }).click();
  }

  async filterByLabel(label) {
    await this.labelFilter.click();
    await this.page.getByRole("option", { name: label }).click();
    await this.page.keyboard.press("Escape");
  }

  getTaskCard(title) {
    return this.page.getByText(title, { exact: true });
  }

  async moveTask(title, targetStatus) {
    const task = this.page.getByText(title, { exact: true });

    const targetColumn = this.page.getByText(targetStatus, {
      exact: true,
    });

    await task.dragTo(targetColumn);
  }
}
