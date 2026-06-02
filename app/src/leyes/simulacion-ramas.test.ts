import { describe, expect, test } from "bun:test";
import { desplegarArbol, pasoEfecto } from "../modelo/simulacion/runner";
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
});
