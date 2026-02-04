import { describe, expect, it } from "vitest";
import {
  BUDGET_OPTIONS,
  calculateTripDays,
  cleanAIJSON,
  getPriceBadgeConfig,
  removeAccentsForUnsplashQuery,
} from "./utils";

describe("Utils: removeAccentsForUnsplashQuery'", () => {
  it("deve remover acentos básicos", () => {
    expect(removeAccentsForUnsplashQuery("São Paulo")).toBe("Sao Paulo");
    expect(removeAccentsForUnsplashQuery("Às vezes")).toBe("As vezes");
    expect(removeAccentsForUnsplashQuery("Vovô")).toBe("Vovo");
    expect(removeAccentsForUnsplashQuery("Tártaro")).toBe("Tartaro");
  });

  it("deve lidar com caracteres especiais", () => {
    expect(removeAccentsForUnsplashQuery("Maçã")).toBe("Maca");
  });

  it("não deve alterar texto sem acentos", () => {
    expect(removeAccentsForUnsplashQuery("New York")).toBe("New York");
  });

  it("deve lidar com string vazia", () => {
    expect(removeAccentsForUnsplashQuery("")).toBe("");
  });
});

describe("Utils: calculateTripDays", () => {
  it("deve calcular corretamente uma viagem de 3 dias", () => {
    const inicio = new Date("2024-01-01");
    const fim = new Date("2024-01-03");

    expect(calculateTripDays(inicio, fim)).toBe(3);
  });

  it("deve retornar 1 dia se a data de início e fim forem iguais", () => {
    const data = new Date("2024-05-20");

    expect(calculateTripDays(data, data)).toBe(1);
  });

  it("deve calcular corretamente entre meses diferentes (bissexto)", () => {
    const inicio = new Date("2024-02-28");
    const fim = new Date("2024-03-01");

    expect(calculateTripDays(inicio, fim)).toBe(3);
  });
});

describe("Utils: cleanAIJSON", () => {
  it("deve remover blocos de código markdown (```json)", () => {
    const entradaSuja = '```json\n[{"cidade": "Paris"}]\n```';

    const resultado = cleanAIJSON(entradaSuja);

    expect(resultado).toBe('[{"cidade": "Paris"}]');
  });

  it("deve remover apenas os crases (```) sem o json escrito", () => {
    const entradaSuja = '```\n[{"cidade": "Tokyo"}]\n```';

    const resultado = cleanAIJSON(entradaSuja);

    expect(resultado).toBe('[{"cidade": "Tokyo"}]');
  });

  it("não deve estragar um JSON que já venha limpo", () => {
    const entradaLimpa = '[{"cidade": "London"}]';

    const resultado = cleanAIJSON(entradaLimpa);

    expect(resultado).toBe(entradaLimpa);
  });
});

describe("Utils: getPriceBadgeConfig", () => {
  it("deve retornar a configuração correta para preço Alto", () => {
    const config = getPriceBadgeConfig("Alto");
    expect(config.label).toBe("Alto");
    expect(config.emoji).toBe("💰💰💰");
  });

  it("deve retornar a configuração correta para preço Médio", () => {
    const config = getPriceBadgeConfig("Médio");
    expect(config.label).toBe("Médio");
    expect(config.emoji).toBe("💰💰");
  });

  it("deve retornar a configuração correta para preço Baixo", () => {
    const config = getPriceBadgeConfig("Baixo");
    expect(config.label).toBe("Baixo");
    expect(config.emoji).toBe("💰");
  });

  it("deve lidar com espaços em branco extras", () => {
    const config = getPriceBadgeConfig("  Baixo  ");
    expect(config.label).toBe("Baixo");
  });

  it("deve retornar Sob Consulta para valores desconhecidos", () => {
    const config = getPriceBadgeConfig("Desconhecido");
    expect(config.label).toBe("Sob Consulta");
  });
});

describe("Configurações de orçamento no StepBudget", () => {
  it("deve conter exatamente as 4 opções padrão", () => {
    expect(BUDGET_OPTIONS).toHaveLength(4);
  });

  it("deve possuir IDs válidos para procesar", () => {
    const ids = BUDGET_OPTIONS.map((opt) => opt.id);
    expect(ids).toContain("econômico");
    expect(ids).toContain("moderado");
    expect(ids).toContain("confortável");
    expect(ids).toContain("luxo");
  });

  it("todas as opções devem ter ícones e descrições preenchidas", () => {
    BUDGET_OPTIONS.forEach((option) => {
      expect(option.icon).not.toBe("");
      expect(option.desc.length).toBeGreaterThan(10);
    });
  });
});
