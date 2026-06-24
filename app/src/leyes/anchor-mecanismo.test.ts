// LEY ANCHOR — eval-de-mecanismo del modo `anchor` (Stereotype real).
//
// Derivado del acta de consenso `docs/auditorias/2026-06-24-acta-alcance-anchor-gist.md`
// (criterio de cierre = eval con contrato de falsabilidad; gate DURO Template-adversarial)
// y del texto de derivación `gist-opm/docs/derivaciones/brecha-anclaje-referencial-opforja-
// 2026-06-23.md` (§6 comportamientos C1/C4/C8, §7 diseño aditivo).
//
// Este corte cubre el discriminador en su dimensión de MATERIALIZACIÓN: el anchor es
// una referencia viva (apunta a un tipo de biblioteca externa, NO copia), a diferencia
// del graft/Template de D6 que clona. La dimensión MUTACIONAL dura (C10: mutar la
// biblioteca propaga; Template no) y la resolución externa (C4/C5 drift) llegan en
// cortes siguientes, con el mecanismo. La forma OPL/visual (C6/C7) espera a (a) custodio-kora.
import { describe, expect, test } from "bun:test";
import { anclarAStereotype, crearModelo, crearObjeto } from "../modelo/operaciones";
import type { Entidad, Id, Modelo, Resultado, StereotypeLibraryRef } from "../modelo/tipos";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(`fixture: ${r.error}`);
  return r.value;
}
function entidadDe(m: Modelo, nombre: string): Entidad {
  const e = Object.values(m.entidades).find((x) => x.nombre === nombre);
  if (!e) throw new Error(`entidad no encontrada: ${nombre}`);
  return e;
}
function eid(m: Modelo, nombre: string): Id {
  return entidadDe(m, nombre).id;
}

// Biblioteca externa (la greda gist): un Modelo persistido aparte, NO el modelo del SD0.
const GREDA: StereotypeLibraryRef = {
  modeloId: "gist-opm-v0",
  nombre: "gist 14.1.0",
  frozenAtHash: "sha256:abc123",
};
const ENT_CATEGORY = "ent-Category" as Id;

describe("LEY ANCHOR — eval-de-mecanismo del modo anchor (Stereotype real)", () => {
  test("ANCHOR-0 (guarda): anclar una entidad inexistente falla y no corrompe el modelo", () => {
    const m = crearModelo("SD0-A");
    const r = anclarAStereotype(m, "no-existe" as Id, GREDA, ENT_CATEGORY);
    expect(r.ok).toBe(false);
  });

  test("ANCHOR-1 (C1 — anclar no copia): 0 entidades nuevas + referencia viva en la entidad", () => {
    let m = crearModelo("SD0-A");
    m = must(crearObjeto(m, m.opdRaizId, { x: 40, y: 80 }, "Disciplina"));
    const antes = Object.keys(m.entidades).length;

    m = must(anclarAStereotype(m, eid(m, "Disciplina"), GREDA, ENT_CATEGORY));

    expect(Object.keys(m.entidades).length).toBe(antes); // no materializó nada
    const ent = entidadDe(m, "Disciplina");
    expect(ent.estereotipoAnclaje?.stereotypeId).toBe(ENT_CATEGORY);
    expect(ent.estereotipoAnclaje?.libraryRef.modeloId).toBe("gist-opm-v0");
    expect(ent.estereotipoAnclaje?.libraryRef.frozenAtHash).toBe("sha256:abc123");
  });

  test("ANCHOR-2 (gate Template-adversarial + semilla C4): la referencia apunta FUERA del modelo y dos things comparten el MISMO id global", () => {
    let m = crearModelo("SD0-A");
    m = must(crearObjeto(m, m.opdRaizId, { x: 40, y: 80 }, "Disciplina"));
    m = must(crearObjeto(m, m.opdRaizId, { x: 240, y: 80 }, "Etiqueta"));
    m = must(anclarAStereotype(m, eid(m, "Disciplina"), GREDA, ENT_CATEGORY));
    m = must(anclarAStereotype(m, eid(m, "Etiqueta"), GREDA, ENT_CATEGORY));

    // Discriminador anti-Template: el stereotype NO es una entidad del modelo (vive en
    // la biblioteca externa). Si anclar degradara a copia, existiría como entidad local.
    expect(m.entidades[ENT_CATEGORY]).toBeUndefined();
    expect(GREDA.modeloId).not.toBe(m.id);

    // Objeto común por id global = semilla de componibilidad (C4): ambos resuelven al
    // mismo stereotypeId + biblioteca, sin inspeccionar subgrafos.
    const a = entidadDe(m, "Disciplina").estereotipoAnclaje;
    const b = entidadDe(m, "Etiqueta").estereotipoAnclaje;
    expect(a?.stereotypeId).toBe(b?.stereotypeId);
    expect(a?.libraryRef.modeloId).toBe(b?.libraryRef.modeloId);
  });

  test("ANCHOR-3 (C8 — graft intacto + aditividad): no toca el estereotipoId local ni las demás entidades", () => {
    let m = crearModelo("SD0-A");
    m = must(crearObjeto(m, m.opdRaizId, { x: 40, y: 80 }, "Disciplina"));
    m = must(crearObjeto(m, m.opdRaizId, { x: 240, y: 80 }, "Otra"));
    const otraAntes = entidadDe(m, "Otra");

    m = must(anclarAStereotype(m, eid(m, "Disciplina"), GREDA, ENT_CATEGORY));

    // estereotipoId (marker del graft D6) queda intacto: el anchor es un campo separado.
    expect(entidadDe(m, "Disciplina").estereotipoId).toBeUndefined();
    // Las demás entidades no cambian (aditivo).
    expect(entidadDe(m, "Otra")).toEqual(otraAntes);
  });
});
