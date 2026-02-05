import { describe, expect, it } from "vitest";
import {
  BUDGET_OPTIONS,
  calculateTripDays,
  cleanAIJSON,
  formatCPF,
  formatFullAddress,
  getPriceBadgeConfig,
  isAdult,
  removeAccentsForUnsplashQuery,
  validateTravelers,
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

describe("Lógica de Datas e Idade", () => {
  it("deve calcular duração da viagem incluindo o dia inicial", () => {
    const d1 = new Date("2026-01-01");
    const d2 = new Date("2026-01-05");
    expect(calculateTripDays(d1, d2)).toBe(5);
  });

  it("deve validar se é maior de idade (18 anos)", () => {
    const dezoitoAnosAtras = new Date();
    dezoitoAnosAtras.setFullYear(dezoitoAnosAtras.getFullYear() - 18);
    expect(isAdult(dezoitoAnosAtras)).toBe(true);

    const crianca = new Date();
    crianca.setFullYear(crianca.getFullYear() - 10);
    expect(isAdult(crianca)).toBe(false);
  });
});

describe("Formatadores de Perfil", () => {
  it("deve formatar CPF com pontos e traço", () => {
    expect(formatCPF("12345678901")).toBe("123.456.789-01");
  });

  it("deve retornar endereço formatado ou fallback", () => {
    const user = {
      street: "Av Paulista",
      number: "1000",
      neighborhood: "Bela Vista",
      city: "SP",
      state: "SP",
    };
    expect(formatFullAddress(user)).toContain("Av Paulista, 1000");
    expect(formatFullAddress({})).toBe("Endereço não cadastrado");
  });

  describe("Regras de Viajantes", () => {
    it("não deve permitir viagem sem adultos", () => {
      expect(validateTravelers(0, 2)).toBe(false);
      expect(validateTravelers(1, 1)).toBe(true);
    });
  });
});
