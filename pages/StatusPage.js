export default class StatusPage {
  constructor(page) {
    this.page = page;

    this.createButton = page.locator('a[href="#/task_statuses/create"]');
    this.name = page.locator('input[name="name"]');
    this.slug = page.locator('input[name="slug"]');
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.successStatusCreate = page.getByText("Element created");
    this.nameHeader = page.getByRole("columnheader", {
      name: /Name/i,
    });

    this.slugHeader = page.getByRole("columnheader", {
      name: /Slug/i,
    });

    this.updateMessage = page.getByText("Element updated");
    this.deleteButton = page.getByRole("button", { name: "Delete" });
    this.deleteMessage = page.getByText("Element deleted");

    this.selectAllCheckBox = page.getByRole("checkbox", {
      name: "Select all",
    });

    this.bulkDeleteMessage = page.getByText(/elements deleted/);

    this.emptyStatusesMessage = page.getByText("No Task statuses yet.", {
      exact: true,
    });
  }

  async goto() {
    await this.page.goto("/#/task_statuses");
  }

  async openCreateForm() {
    await this.createButton.click();
  }

  async createStatus(name, slug) {
    await this.name.fill(name);
    await this.slug.fill(slug);
    await this.saveButton.click();
  }

  getStatusRow(name) {
    return this.page.getByRole("row").filter({
      hasText: name,
    });
  }

  async openStatus(name) {
    await this.getStatusRow(name).click();
  }

  getStatusCheckbox(name) {
    return this.getStatusRow(name).locator('input[type="checkbox"]');
  }
}
