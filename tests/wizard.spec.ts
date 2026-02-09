import { expect, test } from "@playwright/test";

test("fluxo completo: login + wizard + resumo", async ({ page }) => {
  await page.goto("http://localhost:3000/sign-in");

  await page
    .getByRole("textbox", { name: "Seu e-mail" })
    .fill("teste+clerk_test@whichway.com");
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByRole("textbox", { name: "Senha" }).fill("WhichWay_2026!");
  await page.getByRole("button", { name: "Continuar" }).click();

  try {
    const otpInput = page.getByRole("textbox", {
      name: "Enter verification code",
    });

    await otpInput.waitFor({ state: "visible", timeout: 5000 });
    await otpInput.fill("424242");

    const verifyBtn = page.getByRole("button", { name: /verificar|verify/i });
    if (await verifyBtn.isVisible()) {
      await verifyBtn.click();
    }
  } catch (e) {
    console.log("Login seguiu sem pedir código.");
  }

  await expect(page).not.toHaveURL(/sign-in/, { timeout: 15000 });

  await page.waitForLoadState("networkidle");

  await page.goto("http://localhost:3000/criar-roteiro?new=true");

  await expect(page.getByText(/Quando será a viagem/i)).toBeVisible({
    timeout: 15000,
  });

  const nextMonthBtn = page
    .getByRole("button", { name: /next|próximo|go to next/i })
    .first();
  if (await nextMonthBtn.isVisible()) {
    await nextMonthBtn.click();
  } else {
    const arrowRight = page
      .locator(".lucide-chevron-right, [data-lucide='chevron-right']")
      .first();
    if (await arrowRight.isVisible()) await arrowRight.click();
  }

  await page.getByRole("gridcell", { name: "10", exact: true }).first().click();
  await page.getByRole("gridcell", { name: "20", exact: true }).first().click();
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByText("🏛️História").click();
  await page.getByRole("img", { name: "Cultura local" }).click();
  await page.locator("div").filter({ hasText: /^📸$/ }).click();
  await page.locator("div").filter({ hasText: /^⛰️$/ }).click();
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByText("Hotéis 3 estrelas, algumas").click();
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByRole("button").nth(1).click();
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByText("Descansar é importante, mas").click();
  await page.getByRole("button", { name: "Continuar" }).click();

  await expect(
    page.getByText("Vamos definir seu destino!", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText("Analisando seu perfil...", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Descobrir destinos ideais/i }),
  ).toBeVisible();

  console.log("✅ Teste E2E do Wizard concluído com sucesso.");
});
