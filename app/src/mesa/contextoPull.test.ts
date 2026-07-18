import { describe, expect, test } from "bun:test";
import { componerPull, elegirBase } from "./contextoPull";
import { exportarContextoSkill } from "../opl/contextoSkill";
import { hidratarModelo, exportarModelo } from "../serializacion/json";
import { crearModelo, crearProceso } from "../modelo/operaciones";

const NOW = new Date("2026-07-06T00:00:00.000Z");
const modelo = crearModelo("Demo");
const json = exportarModelo(modelo);

function crearProcesoPlaceholder() {
  const boceto = crearModelo("Boceto");
  const resultado = crearProceso(boceto, boceto.opdRaizId, { x: 0, y: 0 }, "Proceso");
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

describe("elegirBase", () => {
  test("autosave más nuevo que lo guardado → autosave", () => {
    const b = elegirBase({
      guardadoActualizadoEn: "2026-07-06T10:00:00.000Z",
      guardadoJson: json,
      guardadoRev: 3,
      autosave: { creadoEn: "2026-07-06T10:00:05.000Z", json },
    });
    expect(b.fuente).toEqual({
      clase: "autosave",
      creadoEn: "2026-07-06T10:00:05.000Z",
      guardadoRev: 3,
    });
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
  test("ordena offsets por instante y no por representación textual", () => {
    const autosavePosterior = elegirBase({
      guardadoActualizadoEn: "2026-07-06T12:00:00.000+02:00",
      guardadoJson: json,
      guardadoRev: 3,
      autosave: { creadoEn: "2026-07-06T10:00:00.001Z", json },
    });
    expect(autosavePosterior.fuente).toEqual({
      clase: "autosave",
      creadoEn: "2026-07-06T10:00:00.001Z",
      guardadoRev: 3,
    });

    const autosaveAnterior = elegirBase({
      guardadoActualizadoEn: "2026-07-06T09:30:00.000-02:00",
      guardadoJson: json,
      guardadoRev: 3,
      autosave: { creadoEn: "2026-07-06T11:00:00.000Z", json },
    });
    expect(autosaveAnterior.fuente).toEqual({ clase: "guardado", rev: 3 });
  });
});

describe("componerPull", () => {
  test("declara especie y fuente en el encabezado", () => {
    const out = componerPull({
      nombre: "Demo",
      especie: "apunte",
      base: {
        json,
        fuente: {
          clase: "autosave",
          creadoEn: "2026-07-06T10:00:05.000Z",
          guardadoRev: 3,
        },
      },
      baseWitness: "mesa-v1.testigo",
      now: NOW,
    });
    expect(out).toContain("Especie: apunte");
    expect(out).toContain("autosave no consolidado");
    expect(out).toContain("guardado rev 3");
    expect(out).toContain("Testigo-Base: mesa-v1.testigo");
  });
  test("especie apunte relaja R-ENT-2: el OPL del pull incluye el proceso placeholder", () => {
    const conProceso = crearProcesoPlaceholder();
    const jsonBoceto = exportarModelo(conProceso);

    const pullApunte = componerPull({
      nombre: "Boceto",
      especie: "apunte",
      base: { json: jsonBoceto, fuente: { clase: "guardado", rev: 1 } },
      now: NOW,
    });
    expect(pullApunte).toContain("*Proceso* es un proceso informacional y sistémico.");

    const pullModelo = componerPull({
      nombre: "Boceto",
      especie: "modelo",
      base: { json: jsonBoceto, fuente: { clase: "guardado", rev: 1 } },
      now: NOW,
    });
    expect(pullModelo).not.toContain("es un proceso informacional");
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
