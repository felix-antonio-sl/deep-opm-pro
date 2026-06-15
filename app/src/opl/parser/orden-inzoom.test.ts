import { describe, expect, test } from "bun:test";
import type { Modelo, Opd } from "../../modelo/tipos";
import { generarOpl } from "../generar";
import { aplicarPatchesOpl, planificarEdicionOplLibre } from "../parser";
import { parsearParrafoOpl } from "./parsear";

/**
 * Fase 1·U4 — OPL reverse del orden de descomposición (GAP-CX-PARSER).
 *
 * El forward (U3) emite «… se descompone en paralelo A, B y C, D, en esa
 * secuencia». El token «y» tiene doble rol: conector intra-banda (listarOpl) y
 * delimitador de secuencia entre las dos últimas bandas (listarSecuenciaTemporal).
 * El reverse reconstruye las bandas y setea `opd.ordenInzoom` del refinamiento
 * EXISTENTE (no crea ni borra refinamientos).
 */

describe("U4 · parser de bandas de orden (contexto descomposición)", () => {
  test("CX-mixta: paralelo dentro de secuencia → bandas con cardinalidad", () => {
    const ast = bandasDe("Atender se descompone en paralelo A, B y C, D y E, en esa secuencia.");
    expect(ast).toEqual([["A", "B", "C"], ["D"], ["E"]]);
  });

  test("CX1: pura secuencia de tres singletons", () => {
    const ast = bandasDe("Atender se descompone en A, B y C en esa secuencia.");
    expect(ast).toEqual([["A"], ["B"], ["C"]]);
  });

  test("CX1: pura secuencia de dos singletons (sep ', ' sin 'y')", () => {
    const ast = bandasDe("Atender se descompone en B, A en esa secuencia.");
    expect(ast).toEqual([["B"], ["A"]]);
  });

  test("CX2: puro paralelo, una sola banda", () => {
    const ast = bandasDe("Atender se descompone en paralelo A, B y C.");
    expect(ast).toEqual([["A", "B", "C"]]);
  });

  test("CX2: puro paralelo de dos", () => {
    const ast = bandasDe("Atender se descompone en paralelo A y B.");
    expect(ast).toEqual([["A", "B"]]);
  });

  test("mixta con banda paralela final precedida por 'y' de secuencia", () => {
    const ast = bandasDe("Atender se descompone en P, Q y paralelo A y B, en esa secuencia.");
    expect(ast).toEqual([["P"], ["Q"], ["A", "B"]]);
  });

  test("dos bandas paralelas consecutivas", () => {
    const ast = bandasDe("Atender se descompone en paralelo A y B, paralelo C y D, en esa secuencia.");
    expect(ast).toEqual([["A", "B"], ["C", "D"]]);
  });

  test("la cola 'así como <objetos>' no contamina las bandas", () => {
    const ast = bandasDe("Atender se descompone en paralelo A y B, C, en esa secuencia, así como Datos y Registro.");
    expect(ast).toEqual([["A", "B"], ["C"]]);
  });

  test("legacy: sin 'paralelo' ni 'en esa secuencia' ⇒ sin bandas (no hay orden declarado)", () => {
    const ast = bandasDe("Atender se descompone en Revisar y Cerrar.");
    expect(ast).toBeUndefined();
  });
});

describe("U4 · reverse end-to-end (planificar + aplicar) sobre refinamiento existente", () => {
  test("recupera ordenInzoom de la oración forward (CX-mixta)", () => {
    const conCampo = modeloInzoom([["evaluar", "registrar"], ["cerrar"]]);
    const opl = generarOpl(conCampo);

    const sinCampo = clonarSinOrden(conCampo);
    const preview = planificarEdicionOplLibre(sinCampo, opl.join("\n"), { opdActivoId: sinCampo.opdRaizId });

    expect(preview.diagnosticos.filter((d) => d.severidad === "error")).toEqual([]);
    expect(preview.patches).toContainEqual(expect.objectContaining({
      tipo: "set-orden-inzoom",
      opdId: "hijo",
      ordenInzoom: [["evaluar", "registrar"], ["cerrar"]],
    }));

    const aplicado = aplicarPatchesOpl(sinCampo, preview.patches, sinCampo.opdRaizId);
    if (!aplicado.ok) throw new Error(aplicado.error);
    expect(aplicado.value.opds.hijo!.ordenInzoom).toEqual([["evaluar", "registrar"], ["cerrar"]]);
    expect(generarOpl(aplicado.value)).toEqual(opl);
  });

  test("idempotente: si el campo ya coincide, no propone patch de orden", () => {
    const conCampo = modeloInzoom([["evaluar", "registrar"], ["cerrar"]]);
    const opl = generarOpl(conCampo);

    const preview = planificarEdicionOplLibre(conCampo, opl.join("\n"), { opdActivoId: conCampo.opdRaizId });
    expect(preview.patches.filter((p) => p.tipo === "set-orden-inzoom")).toEqual([]);
  });

  test("pura secuencia: cada subproceso en su banda", () => {
    const conCampo = modeloInzoom([["evaluar"], ["registrar"], ["cerrar"]]);
    const opl = generarOpl(conCampo);

    const sinCampo = clonarSinOrden(conCampo);
    const preview = planificarEdicionOplLibre(sinCampo, opl.join("\n"), { opdActivoId: sinCampo.opdRaizId });
    const aplicado = aplicarPatchesOpl(sinCampo, preview.patches, sinCampo.opdRaizId);
    if (!aplicado.ok) throw new Error(aplicado.error);
    expect(aplicado.value.opds.hijo!.ordenInzoom).toEqual([["evaluar"], ["registrar"], ["cerrar"]]);
  });
});

describe("U4 · seguridad: nombres con separadores internos (« y », «,», «paralelo») no corrompen ni se pierden en silencio", () => {
  // El forward es ambiguo cuando un nombre contiene los separadores de lista. El
  // reverse debe verificar por inversa (re-emitir y comparar) y RECHAZAR
  // ruidosamente en vez de corromper o perder en silencio (riesgo §6).

  test("colisión: nombre con « y » cuyos tokens son OTROS subprocesos ⇒ rechazo ruidoso, sin corrupción", () => {
    // {p0:"Cargar y Validar", p1:"Cargar", p2:"Validar"} orden [[p0],[p1],[p2]].
    const conCampo = modeloNombres(
      { p0: "Cargar y Validar", p1: "Cargar", p2: "Validar" },
      [["p0"], ["p1"], ["p2"]],
    );
    const opl = generarOpl(conCampo);
    const sinCampo = clonarSinOrden(conCampo);
    const preview = planificarEdicionOplLibre(sinCampo, opl.join("\n"), { opdActivoId: sinCampo.opdRaizId });

    // NO se emite el patch corrupto [[p1],[p2],[p1],[p2]].
    expect(preview.patches.filter((p) => p.tipo === "set-orden-inzoom")).toEqual([]);
    // El rechazo es VISIBLE (no info silenciosa).
    expect(preview.diagnosticos.some((d) => d.severidad === "warning")).toBe(true);

    const aplicado = aplicarPatchesOpl(sinCampo, preview.patches, sinCampo.opdRaizId);
    if (!aplicado.ok) throw new Error(aplicado.error);
    // Sin corrupción: el campo queda sin tocar (no [[p1],[p2],[p1],[p2]]).
    expect(aplicado.value.opds.hijo!.ordenInzoom).toBeUndefined();
  });

  test("común: nombre con « y » que no colisiona ⇒ no se reconstruye, pero con aviso VISIBLE (no silencioso)", () => {
    const conCampo = modeloNombres(
      { p0: "Validar y Firmar", p1: "Cerrar" },
      [["p0"], ["p1"]],
    );
    const opl = generarOpl(conCampo);
    const sinCampo = clonarSinOrden(conCampo);
    const preview = planificarEdicionOplLibre(sinCampo, opl.join("\n"), { opdActivoId: sinCampo.opdRaizId });

    expect(preview.patches.filter((p) => p.tipo === "set-orden-inzoom")).toEqual([]);
    expect(preview.diagnosticos.some((d) => d.severidad === "warning")).toBe(true);
  });
});

function modeloNombres(nombres: Record<string, string>, orden: string[][]): Modelo {
  const ids = Object.keys(nombres);
  const apariencias: Record<string, { id: string; entidadId: string; opdId: string; x: number; y: number; width: number; height: number }> = {
    contorno: { id: "contorno", entidadId: "padre", opdId: "hijo", x: 0, y: 0, width: 600, height: 400 },
  };
  const entidades: Record<string, unknown> = {
    padre: { id: "padre", tipo: "proceso", nombre: "Atender", esencia: "informacional", afiliacion: "sistemica", refinamientos: { descomposicion: { opdId: "hijo" } } },
  };
  ids.forEach((id, i) => {
    apariencias[id] = { id, entidadId: id, opdId: "hijo", x: 20 + (i % 3) * 120, y: 20 + Math.floor(i / 3) * 100, width: 80, height: 40 };
    entidades[id] = { id, tipo: "proceso", nombre: nombres[id], esencia: "informacional", afiliacion: "sistemica" };
  });
  return {
    id: "m1", nombre: "M", opdRaizId: "opd",
    opds: {
      opd: { id: "opd", nombre: "SD", padreId: null, apariencias: { ap: { id: "ap", entidadId: "padre", opdId: "opd", x: 0, y: 0, width: 200, height: 120 } }, enlaces: {} },
      hijo: { id: "hijo", nombre: "SD1", padreId: "opd", apariencias: apariencias as never, enlaces: {}, ordenInzoom: orden },
    },
    entidades: entidades as never,
    estados: {}, enlaces: {}, nextSeq: 1,
  } as Modelo;
}

function bandasDe(texto: string): string[][] | undefined {
  const parse = parsearParrafoOpl(texto);
  const contexto = parse.ast.find((ast) => ast.kind === "contexto");
  if (contexto?.kind !== "contexto") return undefined;
  return (contexto as { bandasNombres?: string[][] }).bandasNombres;
}

function clonarSinOrden(modelo: Modelo): Modelo {
  const opds: Record<string, Opd> = {};
  for (const [id, opd] of Object.entries(modelo.opds)) {
    const { ordenInzoom: _omit, ...resto } = opd;
    opds[id] = { ...resto };
  }
  return { ...modelo, opds };
}

/**
 * Modelo: proceso «Atender» descompuesto en {Evaluar, Registrar, Cerrar} dentro
 * del OPD hijo, con `ordenInzoom` declarado. Las apariencias internas están
 * dentro del contorno (criterio espacial de descomposición).
 */
function modeloInzoom(orden: string[][]): Modelo {
  return {
    id: "m1",
    nombre: "M",
    opdRaizId: "opd",
    opds: {
      opd: {
        id: "opd",
        nombre: "SD",
        padreId: null,
        apariencias: { ap: { id: "ap", entidadId: "padre", opdId: "opd", x: 0, y: 0, width: 200, height: 120 } },
        enlaces: {},
      },
      hijo: {
        id: "hijo",
        nombre: "SD1",
        padreId: "opd",
        apariencias: {
          contorno: { id: "contorno", entidadId: "padre", opdId: "hijo", x: 0, y: 0, width: 400, height: 300 },
          evaluar: { id: "evaluar", entidadId: "evaluar", opdId: "hijo", x: 20, y: 20, width: 80, height: 40 },
          registrar: { id: "registrar", entidadId: "registrar", opdId: "hijo", x: 120, y: 20, width: 80, height: 40 },
          cerrar: { id: "cerrar", entidadId: "cerrar", opdId: "hijo", x: 20, y: 120, width: 80, height: 40 },
        },
        enlaces: {},
        ordenInzoom: orden,
      },
    },
    entidades: {
      padre: { id: "padre", tipo: "proceso", nombre: "Atender", esencia: "informacional", afiliacion: "sistemica", refinamientos: { descomposicion: { opdId: "hijo" } } },
      evaluar: { id: "evaluar", tipo: "proceso", nombre: "Evaluar", esencia: "informacional", afiliacion: "sistemica" },
      registrar: { id: "registrar", tipo: "proceso", nombre: "Registrar", esencia: "informacional", afiliacion: "sistemica" },
      cerrar: { id: "cerrar", tipo: "proceso", nombre: "Cerrar", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {},
    nextSeq: 1,
  };
}
