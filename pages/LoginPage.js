export default class LoginPage {
  constructor(page) {
    this.page = page;

    this.username = page.locator('input[name="username"]');
    this.password = page.locator('input[name="password"]');
    this.button = page.getByRole("button", { name: "Sign in" });

    this.avatar = page.getByRole("button", { name: "Profile" });
    this.buttonLogout = page.getByTestId("PowerSettingsNewIcon");
  }

  async goto() {
    await this.page.goto("#/login");
  }

  async login(username, password) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.button.click();
  }
  async logout() {
    await this.avatar.click();
    await this.buttonLogout.click();
  }
}
