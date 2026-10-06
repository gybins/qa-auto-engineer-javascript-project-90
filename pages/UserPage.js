export default class userPage {
  constructor(page) {
    this.page = page;
    this.createButton = page.getByRole("link", {
      name: "Create",
    });
    this.email = page.locator('input[name="email"]');
    this.firstName = page.locator('input[name="firstName"]');
    this.lastName = page.locator('input[name="lastName"]');
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.successMessage = page.getByText("Element created");
    this.redEyeIcon = page.getByTestId("RemoveRedEyeIcon");
    this.userEmail = page.getByRole("columnheader", { name: /Email/i });
    this.userFirstName = page.getByRole("columnheader", {
      name: /First name/i,
    });
    this.userLastName = page.getByRole("columnheader", { name: /Last name/i });
    this.updateMessage = page.getByText("Element updated");
    this.emailError = page.getByText("Incorrect email format");
    this.formErrorEmailMessage = page.getByText(
      "The form is not valid. Please check for errors",
    );
    this.deleteButton = page.getByRole("button", { name: "Delete" });
    this.deleteMessage = page.getByText("Element deleted");
    this.selectAllCheckBox = page.getByRole("checkbox", { name: "Select all" });
    this.emptyUsersMessage = page.getByText("No Users yet.", { exact: true });
    this.bulkDeleteMessage = page.getByText(/elements deleted/);
  }

  async goto() {
    await this.page.goto("/#/users");
  }

  async openCreateForm() {
    await this.createButton.click();
  }

  async createUser(email, firstName, lastName) {
    await this.email.fill(email);
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.saveButton.click();
  }

  getUserRow(email) {
    return this.page.getByRole("row").filter({
      hasText: email,
    });
  }

  async openUser(email) {
    await this.getUserRow(email).click();
  }

  getUserCheckBox(email) {
    return this.getUserRow(email).locator("input[type='checkbox']");
  }
}
