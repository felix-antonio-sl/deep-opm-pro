import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { accesoCatalogo } from "./DialogoCargarModelo";

describe("acceso semántico del catálogo", () => {
  test("la carpeta virtual raíz se nombra Raíz y no promete mostrar todas", () => {
    const source = readFileSync(new URL("./DialogoCargarModelo.tsx", import.meta.url), "utf8");
    expect(source).toMatch(/>\s*Raíz\s*</);
    expect(source).not.toMatch(/>\s*Todas\s*</);
  });

  test("Biblioteca se anuncia como solo lectura", () => {
    expect(accesoCatalogo({ esBiblioteca: true })).toBe("solo-lectura");
  });

  test("Apunte y Modelo de Trabajo se anuncian como editables", () => {
    expect(accesoCatalogo({ esApunte: true })).toBe("editable");
    expect(accesoCatalogo({})).toBe("editable");
  });
});
