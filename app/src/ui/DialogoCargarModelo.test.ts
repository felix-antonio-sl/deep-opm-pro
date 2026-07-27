import { describe, expect, test } from "bun:test";
import { accesoCatalogo } from "./DialogoCargarModelo";

describe("acceso semántico del catálogo", () => {
  test("Biblioteca se anuncia como solo lectura", () => {
    expect(accesoCatalogo({ esBiblioteca: true })).toBe("solo-lectura");
  });

  test("Apunte y Modelo de Trabajo se anuncian como editables", () => {
    expect(accesoCatalogo({ esApunte: true })).toBe("editable");
    expect(accesoCatalogo({})).toBe("editable");
  });
});
