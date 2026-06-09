// B-2 (solicitud upstream hd-opm 2026-06-06): una entidad declarada sin
// apariciones en ningún OPD NO se emite al OPL — es invisible en la capa
// textual. El checker la acusa (mejora) y admite una exención declarativa por
// glosa `[sin-aparicion-deliberada]` (desconexión transitoria intencional).
// El mecanismo general de waiver es B-5; esta exención local es el mínimo que
// pide el spec sin pre-construir B-5.

import { describe, expect, test } from "bun:test";
import { crearAutor } from "../autoria/index";
import { checkEntidadSinApariciones } from "./checkers";

describe("B-2 — entidad sin apariciones (invisible al OPL)", () => {
  test("acusa una entidad declarada que no aparece en ningún OPD", () => {
    const a = crearAutor({ id: "x", nombre: "X" });
    a.opd("sd0", "SD0", null);
    a.entidad("p", "proceso", "Procesar", "fisica", "sistemica");
    a.ver("sd0", "p", 0, 0);
    a.entidad("o", "objeto", "Cosa Huerfana", "fisica", "sistemica"); // sin ver()
    const avisos = checkEntidadSinApariciones(a.modelo);
    expect(avisos).toHaveLength(1);
    expect(avisos[0]?.codigo).toBe("ENTIDAD_SIN_APARICIONES");
    expect(avisos[0]?.mensaje).toContain("OPL");
  });

  test("NO acusa entidades que aparecen en algun OPD", () => {
    const a = crearAutor({ id: "y", nombre: "Y" });
    a.opd("sd0", "SD0", null);
    a.entidad("p", "proceso", "Procesar", "fisica", "sistemica");
    a.entidad("o", "objeto", "Cosa", "fisica", "sistemica");
    a.ver("sd0", "p", 0, 0);
    a.ver("sd0", "o", 200, 0);
    expect(checkEntidadSinApariciones(a.modelo)).toHaveLength(0);
  });

  test("respeta la whitelist declarativa [sin-aparicion-deliberada] en la glosa", () => {
    const a = crearAutor({ id: "z", nombre: "Z" });
    a.opd("sd0", "SD0", null);
    a.entidad("p", "proceso", "Procesar", "fisica", "sistemica");
    a.ver("sd0", "p", 0, 0);
    a.entidad("o", "objeto", "Desconexion transitoria", "fisica", "sistemica",
      "Aislada a proposito durante el re-modelado. [sin-aparicion-deliberada]");
    expect(checkEntidadSinApariciones(a.modelo)).toHaveLength(0);
  });
});
