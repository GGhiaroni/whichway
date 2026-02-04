import { describe, expect, it } from "vitest";
import { removeAccentsForUnsplashQuery } from "./utils";

describe("Utils: removeAccentsForUnsplashQuery", () => {
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
