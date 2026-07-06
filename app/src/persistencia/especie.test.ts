import { describe, expect, test } from "bun:test";
import { especieDe } from "./especie";

describe("especieDe", () => {
  test("sin flags → modelo", () => {
    expect(especieDe({})).toBe("modelo");
  });
  test("esApunte → apunte", () => {
    expect(especieDe({ esApunte: true })).toBe("apunte");
  });
  test("esBiblioteca → biblioteca", () => {
    expect(especieDe({ esBiblioteca: true })).toBe("biblioteca");
  });
  test("flags en false → modelo", () => {
    expect(especieDe({ esApunte: false, esBiblioteca: false })).toBe("modelo");
  });
  // Contrato de exclusión: el invariante lo sella workspace.ts; aquí definimos
  // la desambiguación defensiva si un record ilegal llegara (apunte gana, es
  // el estado más laxo → nunca trata un borrador como fuente gobernada).
  test("ambos flags (ilegal) → apunte (desambiguación segura)", () => {
    expect(especieDe({ esApunte: true, esBiblioteca: true })).toBe("apunte");
  });
});
