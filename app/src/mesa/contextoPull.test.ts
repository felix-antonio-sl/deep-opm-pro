import { describe, expect, test } from "bun:test";
import { componerPull, elegirBase } from "./contextoPull";
import { exportarContextoSkill } from "../opl/contextoSkill";
import { hidratarModelo, exportarModelo } from "../serializacion/json";
import { crearModelo } from "../modelo/operaciones";

const NOW = new Date("2026-07-06T00:00:00.000Z");
const modelo = crearModelo("Demo");
const json = exportarModelo(modelo);

describe("elegirBase", () => {
  test("autosave más nuevo que lo guardado → autosave", () => {
    const b = elegirBase({
      guardadoActualizadoEn: "2026-07-06T10:00:00.000Z",
      guardadoJson: json,
      guardadoRev: 3,
      autosave: { creadoEn: "2026-07-06T10:00:05.000Z", json },
    });
    expect(b.fuente).toEqual({ clase: "autosave", creadoEn: "2026-07-06T10:00:05.000Z" });
  });
  test("autosave más viejo → guardado", () => {
    const b = elegirBase({
      guardadoActualizadoEn: "2026-07-06T10:00:00.000Z",
      guardadoJson: json,
      guardadoRev: 3,
      autosave: { creadoEn: "2026-07-06T09:59:00.000Z", json },
    });
    expect(b.fuente).toEqual({ clase: "guardado", rev: 3 });
  });
  test("sin autosave → guardado", () => {
    const b = elegirBase({ guardadoActualizadoEn: "2026-07-06T10:00:00.000Z", guardadoJson: json, guardadoRev: 3 });
    expect(b.fuente).toEqual({ clase: "guardado", rev: 3 });
  });
  test("autosave con MISMA marca temporal → guardado (empate no gana; > estricto)", () => {
    const b = elegirBase({
      guardadoActualizadoEn: "2026-07-06T10:00:00.000Z",
      guardadoJson: json,
      guardadoRev: 3,
      autosave: { creadoEn: "2026-07-06T10:00:00.000Z", json },
    });
    expect(b.fuente).toEqual({ clase: "guardado", rev: 3 });
  });
});

describe("componerPull", () => {
  test("declara especie y fuente en el encabezado", () => {
    const out = componerPull({
      nombre: "Demo",
      especie: "apunte",
      base: { json, fuente: { clase: "autosave", creadoEn: "2026-07-06T10:00:05.000Z" } },
      now: NOW,
    });
    expect(out).toContain("Especie: apunte");
    expect(out).toContain("autosave no consolidado");
  });
  // LEY DE DETERMINISMO DEL GENERADOR: el cuerpo del pull, quitando el
  // encabezado de la mesa, es byte-igual a exportarContextoSkill sobre el
  // MISMO modelo-fuente. Un generador, dos consumidores.
  test("el cuerpo es byte-igual a exportarContextoSkill del mismo modelo", () => {
    const m = hidratarModelo(json);
    if (!m.ok) throw new Error("fixture inválido");
    const esperado = exportarContextoSkill(m.value, NOW);
    const out = componerPull({
      nombre: "Demo",
      especie: "modelo",
      base: { json, fuente: { clase: "guardado", rev: 1 } },
      now: NOW,
    });
    expect(out.endsWith(esperado)).toBe(true);
  });
});
