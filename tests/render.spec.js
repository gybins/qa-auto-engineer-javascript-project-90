import { test, expect } from "@playwright/test";

test('check render', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveURL(/\/#\/login$/)
})