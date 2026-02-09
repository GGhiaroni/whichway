import { expect, test } from "@playwright/test";

test("fluxo completo: login + wizard + resumo", async ({ page }) => {
  // --- 1. LOGIN ---
  await page.goto("http://localhost:3000/sign-in");

  // Preenche Email
  await page
    .getByRole("textbox", { name: "Seu e-mail" })
    .fill("teste+clerk_test@whichway.com");
  await page.getByRole("button", { name: "Continuar" }).click();

  // Preenche Senha
  await page.getByRole("textbox", { name: "Senha" }).fill("WhichWay_2026!");
  await page.getByRole("button", { name: "Continuar" }).click();

  // --- TRATAMENTO DO CÓDIGO 2FA (FACTOR TWO) ---
  // O Clerk pode pedir o código num modal OU redirecionar para /sign-in/factor-two
  // Vamos esperar um pouco para ver como a página reage
  await page.waitForTimeout(2000);

  // Procura pelo campo de código (funciona tanto no Modal quanto na página Factor-Two)
  const otpInput = page.getByRole("textbox", {
    name: /verification code|código/i,
  });

  if (await otpInput.isVisible()) {
    console.log("🔒 Pediu código OTP (Modal ou Factor-Two). Preenchendo...");
    await otpInput.fill("424242");

    // Às vezes o Clerk submete sozinho, às vezes precisa clicar
    // Vamos esperar um pouco e ver se o botão ainda está lá
    await page.waitForTimeout(1000);
    const verifyBtn = page
      .getByRole("button", { name: /verificar|verify|continuar/i })
      .first();
    if (await verifyBtn.isVisible()) {
      await verifyBtn.click();
    }
  } else {
    console.log("🔓 Login passou direto sem pedir código.");
  }

  // --- 2. NAVEGAÇÃO EXPLÍCITA ---
  // Agora esperamos sair de QUALQUER página de login (incluindo factor-two)
  // Aumentamos o timeout para 30s pois o redirect pós-MFA pode ser lento
  await expect(page).not.toHaveURL(/sign-in/, { timeout: 30000 });

  await page.waitForLoadState("networkidle");

  // Força ida para o wizard limpo
  await page.goto("http://localhost:3000/criar-roteiro?new=true");

  // --- 3. WIZARD (O resto continua igual) ---

  // Verificação inicial tolerante
  await expect(page.getByText(/Quando será a viagem/i)).toBeVisible({
    timeout: 15000,
  });

  // Calendário
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
    page.getByText("Analisando seu perfil...", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Descobrir destinos ideais/i }),
  ).toBeVisible();

  console.log("✅ Teste E2E do Wizard concluído com sucesso.");
});
