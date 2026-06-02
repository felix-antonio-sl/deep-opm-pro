import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "../operaciones";
import type { Modelo, Resultado } from "../tipos";
import { componerModelos } from "./componer";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function unObjeto(nombre: string): Modelo {
  let m = crearModelo();
  m = must(crearObjeto(m, m.opdRaizId, { x: 100, y: 100 }, nombre));
  return m;
}

describe("composicion/componer", () => {
  test("union disjunta (compartidas vacio) conserva entidades de ambos", () => {
    const compuesto = must(componerModelos(unObjeto("A"), unObjeto("B"), {}));
    const nombres = Object.values(compuesto.entidades)
      .map((e) => e.nombre)
      .sort();
    expect(nombres).toEqual(["A", "B"]);
  });

  test("law-composicion-unidad: componer con modelo vacio preserva entidades", () => {
    const a = unObjeto("A");
    const vacio = crearModelo();
    const compuesto = must(componerModelos(a, vacio, {}));
    const objetosA = Object.values(a.entidades).length;
    const objetosC = Object.values(compuesto.entidades).length;
    expect(objetosC).toBe(objetosA);
  });

  test("law-composicion-no-duplica: una entidad compartida aparece una sola vez", () => {
    const a = unObjeto("Comun");
    const b = unObjeto("Comun");
    const idComunA = Object.values(a.entidades)[0]!.id;
    const idComunB = Object.values(b.entidades)[0]!.id;
    const compuesto = must(componerModelos(a, b, { [idComunB]: idComunA }));
    const comunes = Object.values(compuesto.entidades).filter(
      (e) => e.nombre === "Comun"
    );
    expect(comunes).toHaveLength(1);
    // C1: la entidad compartida tampoco se duplica en las apariencias del OPD
    // raíz. No basta deduplicar `entidades`: el merge del raíz creaba DOS
    // apariencias del objeto compartido (la de A + la de B remapeada a idComunA).
    const root = compuesto.opds[compuesto.opdRaizId]!;
    const aparicionesComun = Object.values(root.apariencias).filter(
      (ap) => ap.entidadId === idComunA
    );
    expect(aparicionesComun).toHaveLength(1);
  });

  test("law-composicion-sin-refs-colgantes: enlacesPadreIds del contexto de refinamiento se remapean", () => {
    const a = unObjeto("A");
    // B trae una apariencia cuyo contexto de refinamiento HEREDA un enlace padre
    // (`enlacesPadreIds`). Al namespacear B, ese id debe seguir al enlace renombrado.
    const b: Modelo = {
      id: "b",
      nombre: "b",
      opdRaizId: "rb",
      nextSeq: 50,
      entidades: {
        pb: { id: "pb", tipo: "proceso", nombre: "Pb", esencia: "informacional", afiliacion: "sistemica" },
        ob: { id: "ob", tipo: "objeto", nombre: "Ob", esencia: "informacional", afiliacion: "sistemica" },
      },
      estados: {},
      enlaces: {
        eb: { id: "eb", tipo: "resultado", origenId: { kind: "entidad", id: "pb" }, destinoId: { kind: "entidad", id: "ob" }, etiqueta: "eb" },
      },
      opds: {
        rb: {
          id: "rb",
          nombre: "SDb",
          padreId: null,
          apariencias: {
            apb: {
              id: "apb",
              entidadId: "pb",
              opdId: "rb",
              x: 0,
              y: 0,
              width: 100,
              height: 50,
              contextoRefinamiento: { tipo: "descomposicion", refinableEntidadId: "pb", rol: "contorno", enlacesPadreIds: ["eb"] },
            },
          },
          enlaces: {
            aeb: { id: "aeb", enlaceId: "eb", opdId: "rb", vertices: [] },
          },
        },
      },
    };
    const compuesto = must(componerModelos(a, b, {}));
    let ctx: { enlacesPadreIds?: string[] } | undefined;
    for (const opd of Object.values(compuesto.opds)) {
      for (const ap of Object.values(opd.apariencias)) {
        if (ap.contextoRefinamiento?.enlacesPadreIds) ctx = ap.contextoRefinamiento;
      }
    }
    expect(ctx).toBeDefined();
    // cada enlacePadreId remapeado debe existir como enlace del compuesto (no colgar).
    for (const id of ctx!.enlacesPadreIds!) {
      expect(compuesto.enlaces[id]).toBeDefined();
    }
  });

  test("no hay colision de IDs tras componer (todos los ids son unicos)", () => {
    const compuesto = must(componerModelos(unObjeto("A"), unObjeto("B"), {}));
    const ids = Object.keys(compuesto.entidades);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("componerModelos es puro: no muta los modelos de entrada", () => {
    const a = unObjeto("A");
    const b = unObjeto("B");
    const antesA = JSON.stringify(a);
    const antesB = JSON.stringify(b);
    componerModelos(a, b, {});
    expect(JSON.stringify(a)).toBe(antesA);
    expect(JSON.stringify(b)).toBe(antesB);
  });

  test("rechaza compartidas con clave inexistente en B", () => {
    const a = unObjeto("A");
    const b = unObjeto("B");
    const r = componerModelos(a, b, { "id-inexistente": "id-inexistente-a" });
    expect(r.ok).toBe(false);
  });

  test("rechaza compartidas con valor inexistente en A", () => {
    const a = unObjeto("A");
    const b = unObjeto("B");
    const idComunB = Object.values(b.entidades)[0]!.id;
    const r = componerModelos(a, b, { [idComunB]: "id-inexistente-a" });
    expect(r.ok).toBe(false);
  });

  test("el compuesto tiene su propio nextSeq independiente", () => {
    const a = unObjeto("A");
    const b = unObjeto("B");
    const compuesto = must(componerModelos(a, b, {}));
    expect(compuesto.nextSeq).toBeGreaterThan(
      Math.max(a.nextSeq, b.nextSeq)
    );
  });

  test("las apariencias de A se preservan en el OPD raiz del compuesto", () => {
    const a = unObjeto("A");
    const b = unObjeto("B");
    const compuesto = must(componerModelos(a, b, {}));
    const rootOpd = compuesto.opds[compuesto.opdRaizId];
    expect(rootOpd).toBeDefined();
    const idsA = Object.keys(a.entidades);
    const visibles = Object.values(rootOpd!.apariencias).map((ap) => ap.entidadId);
    for (const id of idsA) {
      expect(visibles).toContain(id);
    }
  });

  test("las apariencias de B namespaceadas aparecen en el OPD raiz del compuesto", () => {
    const a = unObjeto("A");
    const b = unObjeto("B");
    const compuesto = must(componerModelos(a, b, {}));
    const rootOpd = compuesto.opds[compuesto.opdRaizId];
    const nombresVisibles = Object.values(rootOpd!.apariencias)
      .map((ap) => compuesto.entidades[ap.entidadId]?.nombre)
      .filter(Boolean)
      .sort();
    expect(nombresVisibles).toContain("A");
    expect(nombresVisibles).toContain("B");
  });

  test("los IDs namespaceados de B son predecibles y no colisionan con los de A", () => {
    const a = unObjeto("A");
    const b = unObjeto("B");
    const compuesto = must(componerModelos(a, b, {}));
    const idsA = new Set(Object.keys(a.entidades));
    for (const id of Object.keys(compuesto.entidades)) {
      if (!idsA.has(id)) {
        expect(id).toMatch(/c\d+$/);
      }
    }
  });
});
