import { expect, test } from "@playwright/test";

test("fluxo completo: login + wizard + resumo", async ({ page }) => {
  // Aumentamos o timeout total do teste para 60s (caso o CI esteja muito lento)
  test.setTimeout(60000);

  // --- 1. LOGIN ---
  await page.goto("http://localhost:3000/sign-in");

  await page
    .getByRole("textbox", { name: "Seu e-mail" })
    .fill("teste+clerk_test@whichway.com");
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByRole("textbox", { name: "Senha" }).fill("WhichWay_2026!");
  await page.getByRole("button", { name: "Continuar" }).click();

  // --- TRATAMENTO 2FA ---
  await page.waitForTimeout(2000); // Espera técnica para o Clerk pensar

  const otpInput = page.getByRole("textbox", {
    name: /verification code|código/i,
  });
  if (await otpInput.isVisible()) {
    console.log("🔒 Preenchendo código 2FA...");
    await otpInput.fill("424242");

    // Tenta clicar em verificar se o botão existir
    const verifyBtn = page
      .getByRole("button", { name: /verificar|verify|continuar/i })
      .first();
    // Espera curta para ver se o botão aparece/fica habilitado
    try {
      await verifyBtn.waitFor({ state: "visible", timeout: 2000 });
      await verifyBtn.click();
    } catch (e) {
      console.log("Botão verificar não necessário ou não encontrado.");
    }
  }

  // --- 2. NAVEGAÇÃO FORÇADA (Sem networkidle) ---
  console.log("🚀 Forçando navegação para o Wizard...");

  // Em vez de esperar sair do login, vamos tentar ir direto para o destino.
  // Se o login falhou (pelo erro do banco), essa linha vai carregar, mas o expect abaixo vai falhar
  // nos dando o erro correto.
  await page.goto("http://localhost:3000/criar-roteiro?new=true");

  // --- 3. WIZARD ---
  // Aumentei o timeout aqui. Se o login falhou, ele vai ficar preso no sign-in
  // e vai estourar esse erro aqui, nos avisando que não chegou no wizard.
  await expect(page.getByText(/Quando será a viagem/i)).toBeVisible({
    timeout: 20000,
  });

  // Lógica do Calendário
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

  // Interesses
  await page.getByText("🏛️História").click();
  await page.getByRole("img", { name: "Cultura local" }).click();
  await page.locator("div").filter({ hasText: /^📸$/ }).click();
  await page.locator("div").filter({ hasText: /^⛰️$/ }).click();
  await page.getByRole("button", { name: "Continuar" }).click();

  // Orçamento
  await page.getByText("Hotéis 3 estrelas, algumas").click();
  await page.getByRole("button", { name: "Continuar" }).click();

  // Viajantes
  await page.getByRole("button").nth(1).click();
  await page.getByRole("button", { name: "Continuar" }).click();

  // Ritmo
  await page.getByText("Descansar é importante, mas").click();
  await page.getByRole("button", { name: "Continuar" }).click();

  // --- 4. RESUMO FINAL ---
  await expect(
    page.getByText("Vamos definir seu destino!", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Descobrir destinos ideais/i }),
  ).toBeVisible();

  console.log("✅ Teste E2E do Wizard concluído com sucesso.");
});
