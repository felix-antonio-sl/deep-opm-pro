// F2 (solicitud upstream hd-opm e1-followups 2026-06-09): un OPD `generic-view`
// es una vista ad-hoc que NAVEGA/EXPLICA, no crea hechos (metodologia-forja
// §243, opm-visual V-114). Sus apariciones son re-apariciones de hechos que ya
// viven en sus OPDs de origen; re-emitirlas duplicaría oraciones. El emisor OPL
// debe saltar la vista → el conteo OPL es invariante a añadir una.

import { describe, expect, test } from "bun:test";
import { crearAutor } from "../autoria/index";
import { generarOpl } from "./generar";
import type { Modelo } from "../modelo/tipos";

function oplTotal(modelo: Modelo): number {
  return Object.keys(modelo.opds).reduce((n, opdId) => n + generarOpl(modelo, opdId).length, 0);
}

function autorBaseConHechos() {
  const a = crearAutor({ id: "x", nombre: "X" });
  a.entidad("p", "proceso", "Evaluacion de la solicitud", "fisica", "sistemica");
  a.entidad("o", "objeto", "Solicitud", "informacional", "sistemica");
  a.estados("o", ["recibida", "aceptada"], "recibida");
  a.opd("sd", "SD", null);
  a.ver("sd", "p", 0, 0);
  a.ver("sd", "o", 200, 0);
  const e = a.enlazar("sd", "p", "o", "efecto", { entrada: "recibida", salida: "aceptada" });
  if (!e) throw new Error("enlazar devolvió null");
  return { a, e };
}

describe("F2 — el emisor OPL salta los OPD generic-view", () => {
  test("un OPD generic-view con re-apariciones no emite ninguna oración OPL", () => {
    const { a, e } = autorBaseConHechos();
    const vistaId = a.opd("vista", "SD-Vista", null);
    a.vistaGenerica("vista");
    a.ver("vista", "p", 0, 0);
    a.ver("vista", "o", 200, 0);
    a.aparecerEnlacePorId("vista", e);
    expect(generarOpl(a.modelo, vistaId)).toEqual([]);
  });

  test("añadir una vista deja el conteo OPL total invariante", () => {
    const { a, e } = autorBaseConHechos();
    const antes = oplTotal(a.modelo);
    expect(antes).toBeGreaterThan(0);
    a.opd("vista", "SD-Vista", null);
    a.vistaGenerica("vista");
    a.ver("vista", "p", 0, 0);
    a.ver("vista", "o", 200, 0);
    a.aparecerEnlacePorId("vista", e);
    expect(oplTotal(a.modelo)).toBe(antes);
  });

  test("un OPD normal con las mismas apariciones SÍ emite (control)", () => {
    const { a } = autorBaseConHechos();
    // El SD de origen emite oraciones: confirma que el salto es por ser vista,
    // no porque las apariciones sean inertes.
    expect(generarOpl(a.modelo, a.modelo.opdRaizId).length).toBeGreaterThan(0);
  });
});
