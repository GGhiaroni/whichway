import { describe, expect, it } from "vitest";
import { removeAccentsForUnsplashQuery } from "./utils";

describe("Utils: removeAccents", () => {
  it("deve remover acentos de palavras comuns", () => {
    expect(removeAccentsForUnsplashQuery("São Paulo")).toBe("Sao Paulo");
  });

  it("deve lidar com crases, cedilha, til e acentos circunflexos", () => {
    expect(removeAccentsForUnsplashQuery("Às vezes")).toBe("As vezes");
    expect(removeAccentsForUnsplashQuery("Vovô")).toBe("Vovo");
    expect(removeAccentsForUnsplashQuery("Maçã")).toBe("Maca");
  });

  it("não deve alterar texto sem acentos", () => {
    expect(removeAccentsForUnsplashQuery("New York")).toBe("New York");
  });

  it("deve lidar com string vazia", () => {
    expect(removeAccentsForUnsplashQuery("")).toBe("");
  });
});
