import { describe, expect, test } from "bun:test";
import { modificadorOfrecido } from "./SeccionMultiplicidad";

describe("modificadorOfrecido — restriccion SSOT canonica", () => {
  // SSOT-OPL §7 canoniza c/e en input-side (consumo, instrumento, agente,
  // efecto). No hay plantilla CT/CS para resultado, asi que el UI no los
  // ofrece como nueva eleccion sobre resultado.
  test("oculta condicion en enlaces de resultado", () => {
    expect(modificadorOfrecido("resultado", undefined, "condicion")).toBe(false);
  });

  test("oculta evento en enlaces de resultado", () => {
    expect(modificadorOfrecido("resultado", undefined, "evento")).toBe(false);
  });

  test("preserva opcion para edicion si modelo legacy ya tiene el modificador", () => {
    // Backward compat: un modelo cargado con resultado+c sigue siendo editable
    // (se puede ver y quitar el modificador desde el inspector).
    expect(modificadorOfrecido("resultado", "condicion", "condicion")).toBe(true);
    expect(modificadorOfrecido("resultado", "evento", "evento")).toBe(true);
  });

  test("permite c/e en input-side procedurales", () => {
    for (const tipo of ["consumo", "instrumento", "agente", "efecto"] as const) {
      expect(modificadorOfrecido(tipo, undefined, "condicion")).toBe(true);
      expect(modificadorOfrecido(tipo, undefined, "evento")).toBe(true);
    }
  });
});
