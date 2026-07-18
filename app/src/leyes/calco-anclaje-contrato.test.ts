// CONTRATO OPERATIVO — Calco y Anclaje son dos modos distintos de reutilización.
//
// Verifica que el graft de D6 (`injertarEstereotipo`) materializa una copia
// desacoplada y que `anclaje` mantiene una referencia viva sin materializar
// entidades. Estas propiedades falsables no constituyen por sí solas una
// adjunción ni otra estructura categorial.
//
// Falsable: si el graft dejara de copiar, una cosa calcada naciera con `anclaje`
// o anclar materializara entidades, estas pruebas fallarían.
import { describe, expect, test } from "bun:test";
import {
  anclarAPieza,
  crearEstereotipoDesdeSeleccion,
  crearModelo,
  crearObjeto,
  crearProceso,
  injertarEstereotipo,
} from "../modelo/operaciones";
import type { BibliotecaRef, Id, Modelo, Resultado } from "../modelo/tipos";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(`fixture: ${r.error}`);
  return r.value;
}

const GREDA: BibliotecaRef = { modeloId: "gist-opm-v0", nombre: "gist 14.1.0", frozenAtHash: "sha256:abc" };
const ENT_CATEGORY = "ent-Category" as Id;

/** Modelo con un subgrafo (objeto→proceso) capturado como estereotipo con plantilla (la fuente de Calco). */
function modeloConEstereotipo(): { modelo: Modelo; estereotipoId: Id } {
  let m = crearModelo("Origen");
  m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Documento"));
  m = must(crearProceso(m, m.opdRaizId, { x: 200, y: 0 }, "Tramitar"));
  const ids = Object.keys(m.entidades);
  return must(crearEstereotipoDesdeSeleccion(m, m.opdRaizId, ids, "Trámite"));
}

describe("CONTRATO — Calco y Anclaje tienen semánticas de identidad distintas", () => {
  test("Calcar CREA entidades; Anclar NO crea ninguna", () => {
    const { modelo, estereotipoId } = modeloConEstereotipo();
    const n = Object.keys(modelo.entidades).length;

    // Calco: clona el subgrafo → entidades NUEVAS con ids frescos.
    const calco = must(injertarEstereotipo(modelo, estereotipoId, modelo.opdRaizId, { x: 400, y: 0 }));
    expect(calco.entidadesCreadas.length).toBeGreaterThan(0);
    expect(Object.keys(calco.modelo.entidades).length).toBe(n + calco.entidadesCreadas.length);

    // Anclaje: referencia viva → 0 entidades nuevas.
    const algunaId = Object.keys(modelo.entidades)[0] as Id;
    const anclado = must(anclarAPieza(modelo, algunaId, GREDA, ENT_CATEGORY));
    expect(Object.keys(anclado.entidades).length).toBe(n);
  });

  test("las cosas calcadas NO llevan `anclaje`", () => {
    const { modelo, estereotipoId } = modeloConEstereotipo();
    const calco = must(injertarEstereotipo(modelo, estereotipoId, modelo.opdRaizId, { x: 400, y: 0 }));
    for (const id of calco.entidadesCreadas) {
      expect(calco.modelo.entidades[id]?.anclaje).toBeUndefined();
    }
  });

  test("solo el Anclaje conserva una referencia externa", () => {
    const { modelo } = modeloConEstereotipo();
    const algunaId = Object.keys(modelo.entidades)[0] as Id;
    const anclado = must(anclarAPieza(modelo, algunaId, GREDA, ENT_CATEGORY));
    expect(anclado.entidades[algunaId]?.anclaje?.biblioteca.modeloId).toBe("gist-opm-v0");
    expect(anclado.entidades[algunaId]?.anclaje?.biblioteca.modeloId).not.toBe(modelo.id);
  });

  test("Calco no reconstruye el vínculo vivo de procedencia", () => {
    const { modelo, estereotipoId } = modeloConEstereotipo();
    const calco = must(injertarEstereotipo(modelo, estereotipoId, modelo.opdRaizId, { x: 400, y: 0 }));
    // Las cosas calcadas son objetos libres: ningún gesto reconstruye un `anclaje` a su estereotipo-origen.
    for (const id of calco.entidadesCreadas) {
      expect(calco.modelo.entidades[id]?.anclaje).toBeUndefined();
    }
    // El único modo de que una cosa calcada tenga `anclaje` es anclarla a una Pieza externa (no es reversión del Calco).
    const anclaId = (calco.anclaId ?? calco.entidadesCreadas[0]) as Id;
    const reanclado = must(anclarAPieza(calco.modelo, anclaId, GREDA, ENT_CATEGORY));
    expect(reanclado.entidades[anclaId]?.anclaje?.biblioteca.modeloId).toBe("gist-opm-v0");
  });
});
