import { expect } from "@playwright/test";

export default class LoginPage {
  constructor(page) {
    this.page = page;

    this.username = page.getByRole("textbox", {
      name: "Username",
    });

    this.password = page.getByLabel("Password");

    this.button = page.getByRole("button", {
      name: "Sign in",
    });

    this.avatar = page.getByText("Jane Doe", {
      exact: true,
    });

    this.profileButton = page.getByRole("button", {
      name: "Profile",
    });

    this.logoutButton = page.getByTestId(
      "PowerSettingsNewIcon"
    );
  }

  async goto() {
    await this.page.goto("/");
  }

  async login(username, password) {
    await this.username.waitFor({ state: "visible" });

    await this.username.fill(username);
    await expect(this.username).toHaveValue(username);

    await this.password.fill(password);
    await expect(this.password).toHaveValue(password);

    await this.button.click();
  }

  async logout() {
    await this.profileButton.click();
    await this.logoutButton.click();
  }
}