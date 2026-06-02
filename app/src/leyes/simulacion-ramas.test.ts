import { describe, expect, test } from "bun:test";
import { desplegar, desplegarArbol, pasoEfecto } from "../modelo/simulacion/runner";
import type { ContextoSimulacion, ModoSimulacion } from "../modelo/simulacion/tipos";
import type { Modelo } from "../modelo/tipos";

/**
 * LEY law-simulacion-ramas (S2): la rama elegida de un abanico XOR de salida
 * determina la transición de estado. El fixture que el agente anterior omitió:
 * todas sus leyes usaban modelos SIN abanicos, así que la ramificación nunca
 * se ejercía (BUG-1/2/6 pasaban verdes).
 *
 * Modelo mínimo construido a mano (sin depender de helpers de puerto compartido):
 * proceso P con un abanico XOR de salida de dos ramas hacia dos estados (s1, s2)
 * del objeto O. El plan lleva las dos transiciones alternativas; sólo la rama
 * elegida debe aplicarse.
 */
function modeloAbanicoXorAEstados(): Modelo {
  return {
    id: "m",
    nombre: "m",
    opdRaizId: "raiz",
    nextSeq: 100,
    entidades: {
      P: { id: "P", tipo: "proceso", nombre: "P", esencia: "informacional", afiliacion: "sistemica" },
      O: { id: "O", tipo: "objeto", nombre: "O", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {
      s1: { id: "s1", entidadId: "O", nombre: "s1" },
      s2: { id: "s2", entidadId: "O", nombre: "s2" },
    },
    enlaces: {
      e1: { id: "e1", tipo: "resultado", origenId: { kind: "entidad", id: "P" }, destinoId: { kind: "estado", id: "s1" }, etiqueta: "r1" },
      e2: { id: "e2", tipo: "resultado", origenId: { kind: "entidad", id: "P" }, destinoId: { kind: "estado", id: "s2" }, etiqueta: "r2" },
    },
    opds: {
      raiz: {
        id: "raiz",
        nombre: "SD",
        padreId: null,
        apariencias: {
          apP: { id: "apP", entidadId: "P", opdId: "raiz", x: 0, y: 0, width: 100, height: 50 },
          apO: { id: "apO", entidadId: "O", opdId: "raiz", x: 200, y: 0, width: 100, height: 50 },
        },
        enlaces: {
          ae1: { id: "ae1", enlaceId: "e1", opdId: "raiz", vertices: [] },
          ae2: { id: "ae2", enlaceId: "e2", opdId: "raiz", vertices: [] },
        },
      },
    },
    abanicos: {
      ab1: {
        id: "ab1",
        opdId: "raiz",
        puertoComun: { entidadId: "P", lado: "origen", portId: "p" },
        puertoEntidadId: "P",
        operador: "XOR",
        enlaceIds: ["e1", "e2"],
      },
    },
  };
}

function ctx(modelo: Modelo, modo: ModoSimulacion, semilla?: number): ContextoSimulacion {
  return {
    modeloId: modelo.id,
    opdId: "raiz",
    plan: [{
      opdId: "raiz",
      opdNombre: "SD",
      profundidad: 0,
      procesoId: "P",
      procesoNombre: "P",
      ordenY: 0,
      enlacesEntradaIds: [],
      enlacesSalidaIds: ["e1", "e2"],
      transicionesPlanificadas: [
        { entidadId: "O", estadoAntesId: null, estadoDespuesId: "s1" },
        { entidadId: "O", estadoAntesId: null, estadoDespuesId: "s2" },
      ],
    }],
    pasoActual: 0,
    estado: "preparado",
    estadosCurrent: {},
    valoresRuntime: {},
    trace: [],
    modo,
    ...(semilla != null ? { semilla } : {}),
  };
}

/** Dos procesos en secuencia, cada uno con su abanico XOR a estados de su objeto. */
function modeloDosAbanicos(): Modelo {
  return {
    id: "m2",
    nombre: "m2",
    opdRaizId: "raiz",
    nextSeq: 200,
    entidades: {
      P1: { id: "P1", tipo: "proceso", nombre: "P1", esencia: "informacional", afiliacion: "sistemica" },
      P2: { id: "P2", tipo: "proceso", nombre: "P2", esencia: "informacional", afiliacion: "sistemica" },
      A: { id: "A", tipo: "objeto", nombre: "A", esencia: "informacional", afiliacion: "sistemica" },
      B: { id: "B", tipo: "objeto", nombre: "B", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {
      a1: { id: "a1", entidadId: "A", nombre: "a1" },
      a2: { id: "a2", entidadId: "A", nombre: "a2" },
      b1: { id: "b1", entidadId: "B", nombre: "b1" },
      b2: { id: "b2", entidadId: "B", nombre: "b2" },
    },
    enlaces: {
      eA1: { id: "eA1", tipo: "resultado", origenId: { kind: "entidad", id: "P1" }, destinoId: { kind: "estado", id: "a1" }, etiqueta: "a1" },
      eA2: { id: "eA2", tipo: "resultado", origenId: { kind: "entidad", id: "P1" }, destinoId: { kind: "estado", id: "a2" }, etiqueta: "a2" },
      eB1: { id: "eB1", tipo: "resultado", origenId: { kind: "entidad", id: "P2" }, destinoId: { kind: "estado", id: "b1" }, etiqueta: "b1" },
      eB2: { id: "eB2", tipo: "resultado", origenId: { kind: "entidad", id: "P2" }, destinoId: { kind: "estado", id: "b2" }, etiqueta: "b2" },
    },
    opds: {
      raiz: {
        id: "raiz",
        nombre: "SD",
        padreId: null,
        apariencias: {
          apP1: { id: "apP1", entidadId: "P1", opdId: "raiz", x: 0, y: 0, width: 80, height: 40 },
          apP2: { id: "apP2", entidadId: "P2", opdId: "raiz", x: 0, y: 120, width: 80, height: 40 },
          apA: { id: "apA", entidadId: "A", opdId: "raiz", x: 200, y: 0, width: 80, height: 40 },
          apB: { id: "apB", entidadId: "B", opdId: "raiz", x: 200, y: 120, width: 80, height: 40 },
        },
        enlaces: {
          aeA1: { id: "aeA1", enlaceId: "eA1", opdId: "raiz", vertices: [] },
          aeA2: { id: "aeA2", enlaceId: "eA2", opdId: "raiz", vertices: [] },
          aeB1: { id: "aeB1", enlaceId: "eB1", opdId: "raiz", vertices: [] },
          aeB2: { id: "aeB2", enlaceId: "eB2", opdId: "raiz", vertices: [] },
        },
      },
    },
    abanicos: {
      abA: { id: "abA", opdId: "raiz", puertoComun: { entidadId: "P1", lado: "origen", portId: "pA" }, puertoEntidadId: "P1", operador: "XOR", enlaceIds: ["eA1", "eA2"] },
      abB: { id: "abB", opdId: "raiz", puertoComun: { entidadId: "P2", lado: "origen", portId: "pB" }, puertoEntidadId: "P2", operador: "XOR", enlaceIds: ["eB1", "eB2"] },
    },
  };
}

function ctxDos(modelo: Modelo, modo: ModoSimulacion, semilla: number): ContextoSimulacion {
  return {
    modeloId: modelo.id,
    opdId: "raiz",
    plan: [
      { opdId: "raiz", opdNombre: "SD", profundidad: 0, procesoId: "P1", procesoNombre: "P1", ordenY: 0, enlacesEntradaIds: [], enlacesSalidaIds: ["eA1", "eA2"], transicionesPlanificadas: [{ entidadId: "A", estadoAntesId: null, estadoDespuesId: "a1" }, { entidadId: "A", estadoAntesId: null, estadoDespuesId: "a2" }] },
      { opdId: "raiz", opdNombre: "SD", profundidad: 0, procesoId: "P2", procesoNombre: "P2", ordenY: 120, enlacesEntradaIds: [], enlacesSalidaIds: ["eB1", "eB2"], transicionesPlanificadas: [{ entidadId: "B", estadoAntesId: null, estadoDespuesId: "b1" }, { entidadId: "B", estadoAntesId: null, estadoDespuesId: "b2" }] },
    ],
    pasoActual: 0,
    estado: "preparado",
    estadosCurrent: {},
    valoresRuntime: {},
    trace: [],
    modo,
    semilla,
  };
}

describe("LEY law-simulacion-ramas (S2)", () => {
  test("exhaustivo: cada rama produce su propio estado (BUG-1)", () => {
    const m = modeloAbanicoXorAEstados();
    const efecto = pasoEfecto(m, ctx(m, "exhaustivo"));
    expect(efecto.sucesores.length).toBe(2);
    const porRama: Record<string, string | undefined> = {};
    for (const s of efecto.sucesores) porRama[s.rama ?? "?"] = s.estado.estadosCurrent["O"];
    expect(porRama["r1"]).toBe("s1");
    expect(porRama["r2"]).toBe("s2");
  });

  test("exhaustivo: la anotación de una rama no contamina a la otra (BUG-6, inmutabilidad)", () => {
    const m = modeloAbanicoXorAEstados();
    const efecto = pasoEfecto(m, ctx(m, "exhaustivo"));
    const sa = efecto.sucesores.find((s) => s.rama === "r1")!;
    const sb = efecto.sucesores.find((s) => s.rama === "r2")!;
    const da = sa.estado.trace.at(-1)?.diagnostico ?? "";
    const db = sb.estado.trace.at(-1)?.diagnostico ?? "";
    expect(da).toContain("r1");
    expect(db).toContain("r2");
    expect(da).not.toBe(db);
  });

  test("muestreo: misma semilla elige la misma rama y estado (BUG-2)", () => {
    const m = modeloAbanicoXorAEstados();
    const a = pasoEfecto(m, ctx(m, "muestreo", 7)).sucesores[0]!;
    const b = pasoEfecto(m, ctx(m, "muestreo", 7)).sucesores[0]!;
    expect(a.rama).toBe(b.rama);
    expect(a.estado.estadosCurrent["O"]).toBe(b.estado.estadosCurrent["O"]);
    // la rama elegida realmente transicionó el objeto (no quedó en el "último gana")
    const oFinal = a.estado.estadosCurrent["O"];
    expect(oFinal === "s1" || oFinal === "s2").toBe(true);
  });

  test("muestreo: distintas semillas pueden elegir ramas distintas (Dist uniforme, no fallback fijo) (BUG-4)", () => {
    const m = modeloAbanicoXorAEstados();
    const ramas = new Set<string>();
    for (let s = 0; s < 12; s += 1) {
      const suc = pasoEfecto(m, ctx(m, "muestreo", s)).sucesores[0]!;
      if (suc.rama) ramas.add(suc.rama);
    }
    expect(ramas.has("r1")).toBe(true);
    expect(ramas.has("r2")).toBe(true);
  });

  test("exhaustivo: desplegarArbol ramifica en la raíz, un hijo por rama (BUG-5)", () => {
    const m = modeloAbanicoXorAEstados();
    const { raiz, truncado } = desplegarArbol(m, ctx(m, "exhaustivo"), 50);
    expect(truncado).toBe(false);
    expect(raiz.hijos.length).toBe(2);
    expect(new Set(raiz.hijos.map((h) => h.rama)).size).toBe(2);
  });

  test("muestreo: abanicos sucesivos son independientes — la semilla progresa entre pasos (BUG-2)", () => {
    const m = modeloDosAbanicos();
    const pares = new Set<string>();
    for (let s = 0; s < 24; s += 1) {
      const fin = desplegar(m, ctxDos(m, "muestreo", s));
      pares.add(`${fin.estadosCurrent["A"]}|${fin.estadosCurrent["B"]}`);
    }
    // Si la semilla NO progresa, ambos abanicos toman el mismo índice y solo
    // aparecen a1|b1 y a2|b2. Independencia ⟹ aparece al menos un par cruzado.
    const cruzado = [...pares].some((p) => p === "a1|b2" || p === "a2|b1");
    expect(cruzado).toBe(true);
  });
});
