import { expect, test } from "@playwright/test";

test("deve carregar a home page corretamente", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/localhost:3000/);

  await expect(page.locator("body")).toContainText(/WhichWay/i);
});
