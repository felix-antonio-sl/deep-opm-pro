import { describe, expect, test } from "bun:test";
import {
  agruparSubprocesosParalelos,
  aplicarOrdenInzoomDerivado,
  derivarOrdenInzoomDeGeometria,
} from "./helpers";
import type { Apariencia, Id, Modelo } from "../../tipos";

describe("helpers refinamiento", () => {
  test("agrupa subprocesos con Y similar dentro de tolerancia", () => {
    const grupos = agruparSubprocesosParalelos([
      ap("a-3", 260, 220),
      ap("a-1", 200, 100),
      ap("a-2", 120, 103),
      ap("a-4", 120, 228),
    ]);

    expect(grupos.map((grupo) => grupo.map((apariencia) => apariencia.id))).toEqual([
      ["a-2", "a-1"],
      ["a-3"],
      ["a-4"],
    ]);
  });

  test("separa grupos cuando exceden tolerancia", () => {
    const grupos = agruparSubprocesosParalelos([
      ap("a-1", 120, 100),
      ap("a-2", 120, 105),
    ], 4);

    expect(grupos).toHaveLength(2);
  });
});

function ap(id: string, x: number, y: number): Apariencia {
  return {
    id,
    entidadId: `p-${id}`,
    opdId: "opd-1",
    x,
    y,
    width: 135,
    height: 60,
  };
}

/**
 * Builder de in-zoom de proceso: contorno envolvente + subprocesos internos
 * colocados por geometria (x,y) dentro del contorno. Replica la estructura real
 * que ve el forward OPL (`aparienciasInternasDeRefinamiento`: contorno como
 * apariencia + internos por `dentroDe`). `subs` = [id, x, y]; el width/height es
 * fijo (135x60), el contorno los envuelve con holgura.
 */
function inzoom(opdId: Id, subs: Array<[Id, number, number]>, ordenInzoom?: Id[][]): Modelo {
  const contornoEntidadId = "p-contorno";
  const entidades: Modelo["entidades"] = {
    [contornoEntidadId]: {
      id: contornoEntidadId,
      tipo: "proceso",
      nombre: "Contorno",
      esencia: "informacional",
      afiliacion: "sistemica",
      refinamientos: { descomposicion: { opdId } },
    },
  };
  const apariencias: Record<Id, Apariencia> = {
    "ac-contorno": { id: "ac-contorno", entidadId: contornoEntidadId, opdId, x: 0, y: 0, width: 2000, height: 2000 },
  };
  for (const [id, x, y] of subs) {
    entidades[id] = { id, tipo: "proceso", nombre: `Sub ${id}`, esencia: "informacional", afiliacion: "sistemica" };
    apariencias[`a-${id}`] = { id: `a-${id}`, entidadId: id, opdId, x, y, width: 135, height: 60 };
  }
  const opdHijo: Modelo["opds"][string] = {
    id: opdId,
    nombre: "SD1",
    padreId: "opd-raiz",
    apariencias,
    enlaces: {},
    ...(ordenInzoom ? { ordenInzoom } : {}),
  };
  return {
    id: "m",
    nombre: "test",
    opdRaizId: "opd-raiz",
    opds: {
      "opd-raiz": { id: "opd-raiz", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} },
      [opdId]: opdHijo,
    },
    entidades,
    estados: {},
    enlaces: {},
    nextSeq: 100,
  };
}

describe("derivarOrdenInzoomDeGeometria (U8.1 · cociente geometria→campo)", () => {
  test("secuencia pura: tres subprocesos a distintas Y → una banda por Y, ordenadas por Y", () => {
    const modelo = inzoom("opd-h", [["a", 100, 100], ["b", 100, 400], ["c", 100, 700]]);
    expect(derivarOrdenInzoomDeGeometria(modelo, "opd-h")).toEqual([["a"], ["b"], ["c"]]);
  });

  test("paralelo dentro de secuencia: misma Y (±4px) colapsa en una banda, ordenada por X", () => {
    const modelo = inzoom("opd-h", [["b", 300, 100], ["a", 100, 102], ["c", 100, 400]]);
    expect(derivarOrdenInzoomDeGeometria(modelo, "opd-h")).toEqual([["a", "b"], ["c"]]);
  });

  test("forma normal: todo paralelo (1 banda) ⇒ undefined (objeto inicial canonico)", () => {
    const modelo = inzoom("opd-h", [["a", 100, 100], ["b", 300, 102]]);
    expect(derivarOrdenInzoomDeGeometria(modelo, "opd-h")).toBeUndefined();
  });

  test("forma normal: un solo subproceso ⇒ undefined", () => {
    const modelo = inzoom("opd-h", [["a", 100, 100]]);
    expect(derivarOrdenInzoomDeGeometria(modelo, "opd-h")).toBeUndefined();
  });

  test("OPD sin descomposicion de proceso (sin contorno) ⇒ undefined", () => {
    const modelo = inzoom("opd-h", [["a", 100, 100], ["b", 100, 400]]);
    delete modelo.entidades["p-contorno"]!.refinamientos;
    expect(derivarOrdenInzoomDeGeometria(modelo, "opd-h")).toBeUndefined();
  });

  test("excluye objetos internos: solo procesos forman las bandas", () => {
    const modelo = inzoom("opd-h", [["a", 100, 100], ["b", 100, 400]]);
    // Un objeto interno a la misma Y que `a` NO debe contar como subproceso.
    modelo.entidades["o-x"] = { id: "o-x", tipo: "objeto", nombre: "Obj", esencia: "informacional", afiliacion: "sistemica" };
    modelo.opds["opd-h"]!.apariencias["a-o-x"] = { id: "a-o-x", entidadId: "o-x", opdId: "opd-h", x: 500, y: 100, width: 135, height: 60 };
    expect(derivarOrdenInzoomDeGeometria(modelo, "opd-h")).toEqual([["a"], ["b"]]);
  });

  test("excluye externos (rol=externo) aunque caigan dentro del contorno", () => {
    const modelo = inzoom("opd-h", [["a", 100, 100], ["b", 100, 400]]);
    modelo.entidades["p-ext"] = { id: "p-ext", tipo: "proceso", nombre: "Ext", esencia: "informacional", afiliacion: "sistemica" };
    modelo.opds["opd-h"]!.apariencias["a-ext"] = {
      id: "a-ext", entidadId: "p-ext", opdId: "opd-h", x: 700, y: 100, width: 135, height: 60,
      contextoRefinamiento: { tipo: "descomposicion", refinableEntidadId: "p-contorno", rol: "externo", contenedorAparienciaId: "ac-contorno" },
    };
    expect(derivarOrdenInzoomDeGeometria(modelo, "opd-h")).toEqual([["a"], ["b"]]);
  });
});

describe("aplicarOrdenInzoomDerivado (U8.2 · guard de idempotencia, ajuste D2)", () => {
  test("nudge dentro de tolerancia que NO cambia el campo ⇒ modelo intacto (misma referencia)", () => {
    // Campo declarado [[a,b],[c]]; b se nudgea 3px (sigue en banda de a) → derivado IDENTICO.
    const modelo = inzoom("opd-h", [["a", 100, 100], ["b", 303, 103], ["c", 100, 400]], [["a", "b"], ["c"]]);
    const out = aplicarOrdenInzoomDerivado(modelo, "opd-h");
    expect(out).toBe(modelo); // no-op: no churn en undo/reproducibilidad
  });

  test("cruzar una banda reescribe el campo (eso ES reordenar)", () => {
    // c estaba en banda 2; ahora c sube a la Y de a,b → derivado [[a,b,c]] → undefined (1 banda)…
    // usamos un caso donde el cruce sigue dejando ≥2 bandas: c baja a la Y de una nueva banda final
    // y b sube a banda de a. Partimos de [[a],[b],[c]] y movemos b a la Y de a → [[a,b],[c]].
    const modelo = inzoom("opd-h", [["a", 100, 100], ["b", 300, 100], ["c", 100, 400]], [["a"], ["b"], ["c"]]);
    const out = aplicarOrdenInzoomDerivado(modelo, "opd-h");
    expect(out).not.toBe(modelo);
    expect(out.opds["opd-h"]?.ordenInzoom).toEqual([["a", "b"], ["c"]]);
  });

  test("colapso a paralelo borra el campo declarado (derivar=undefined)", () => {
    // Campo [[a],[b]]; ambos quedan a la misma Y → 1 banda → forma normal undefined → se BORRA.
    const modelo = inzoom("opd-h", [["a", 100, 100], ["b", 300, 102]], [["a"], ["b"]]);
    const out = aplicarOrdenInzoomDerivado(modelo, "opd-h");
    expect(out).not.toBe(modelo);
    expect(out.opds["opd-h"]?.ordenInzoom).toBeUndefined();
  });

  test("sin campo previo y geometria sin orden (1 banda) ⇒ modelo intacto", () => {
    const modelo = inzoom("opd-h", [["a", 100, 100], ["b", 300, 102]]);
    expect(aplicarOrdenInzoomDerivado(modelo, "opd-h")).toBe(modelo);
  });

  test("sin campo previo y geometria con orden ⇒ escribe el campo", () => {
    const modelo = inzoom("opd-h", [["a", 100, 100], ["b", 100, 400]]);
    const out = aplicarOrdenInzoomDerivado(modelo, "opd-h");
    expect(out.opds["opd-h"]?.ordenInzoom).toEqual([["a"], ["b"]]);
  });

  test("campo de 1 banda (paralelo declarado por OPL) + drag cosmético ⇒ no-op (equivale a undefined)", () => {
    // `[[a,b]]` (1 banda) es semánticamente «todo paralelo» = el objeto inicial del
    // cociente, igual que `undefined`. Un toque que NO cruza banda no debe borrar el
    // campo declarado por OPL (riesgo §6: pérdida silenciosa). La forma normal trata
    // `≤1 banda` y `undefined` como el MISMO representante → no-op (misma referencia).
    const modelo = inzoom("opd-h", [["a", 100, 100], ["b", 300, 102]], [["a", "b"]]);
    expect(aplicarOrdenInzoomDerivado(modelo, "opd-h")).toBe(modelo);
  });
});
