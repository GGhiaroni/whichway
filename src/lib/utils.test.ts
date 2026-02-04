import { describe, expect, it } from "vitest";
import { calculateTripDays, removeAccentsForUnsplashQuery } from "./utils";

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
