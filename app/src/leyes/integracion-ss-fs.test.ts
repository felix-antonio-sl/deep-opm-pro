import { describe, expect, test } from "bun:test";
import { desplegar, iniciarSimulacion } from "../modelo/simulacion/runner";
import {
  entidadesVisitadas,
  hechosEjercidosPorTraza,
  razonarSobreCorrida,
} from "../modelo/simulacion/integracionHechos";
import { hechosDe } from "../modelo/hechos";
import { derivar } from "../modelo/razonamiento";
import { componerModelos } from "../modelo/composicion";
import type { Modelo, Resultado } from "../modelo/tipos";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

/**
 * LEYES DE INTEGRACIÓN Ss↔Fs — la simulación (anamorfismo) y el cimiento de
 * hechos F0 / razonamiento F3 (catamorfismo) sobre el MISMO sustrato.
 *
 * Antes de esto las dos capas estaban totalmente desconectadas: `simulacion/`
 * no importaba ninguna F y las Fs no conocían `simulacion/`. Estas leyes
 * verifican que el unfold de S y el fold de F3 son duales sobre los hechos de
 * F0 — no dos teorías que casualmente viven en el mismo repo.
 *
 * Fundamento: `urn:fxsl:kb:icas-efectos` (unfold/fold duales sobre el carrier).
 *
 * Fixture: proceso «Cocinar» transforma «Huevo» de `crudo`→`cocido` (consumo
 * de estado + resultado a estado, el patrón de `inferirTransiciones`). «Sal»
 * es un objeto AISLADO: control de no-tautología (ni se transiciona ni lo
 * reconoce F3).
 */
function modeloCocinarHuevo(): Modelo {
  return {
    id: "m",
    nombre: "m",
    opdRaizId: "raiz",
    nextSeq: 100,
    entidades: {
      Cocinar: { id: "Cocinar", tipo: "proceso", nombre: "Cocinar", esencia: "informacional", afiliacion: "sistemica" },
      Huevo: { id: "Huevo", tipo: "objeto", nombre: "Huevo", esencia: "informacional", afiliacion: "sistemica" },
      Sal: { id: "Sal", tipo: "objeto", nombre: "Sal", esencia: "fisica", afiliacion: "sistemica" },
    },
    estados: {
      // ids ordenados para que el estado inicial (por orden estable) sea `crudo`.
      s0crudo: { id: "s0crudo", entidadId: "Huevo", nombre: "crudo" },
      s1cocido: { id: "s1cocido", entidadId: "Huevo", nombre: "cocido" },
    },
    enlaces: {
      cons: { id: "cons", tipo: "consumo", origenId: { kind: "estado", id: "s0crudo" }, destinoId: { kind: "entidad", id: "Cocinar" }, etiqueta: "c" },
      res: { id: "res", tipo: "resultado", origenId: { kind: "entidad", id: "Cocinar" }, destinoId: { kind: "estado", id: "s1cocido" }, etiqueta: "r" },
    },
    opds: {
      raiz: {
        id: "raiz",
        nombre: "SD",
        padreId: null,
        apariencias: {
          apC: { id: "apC", entidadId: "Cocinar", opdId: "raiz", x: 0, y: 0, width: 100, height: 50 },
          apH: { id: "apH", entidadId: "Huevo", opdId: "raiz", x: 200, y: 0, width: 100, height: 50 },
          apS: { id: "apS", entidadId: "Sal", opdId: "raiz", x: 200, y: 200, width: 100, height: 50 },
        },
        enlaces: {
          aeCons: { id: "aeCons", enlaceId: "cons", opdId: "raiz", vertices: [] },
          aeRes: { id: "aeRes", enlaceId: "res", opdId: "raiz", vertices: [] },
        },
      },
    },
  };
}

function corrida(): { modelo: Modelo; fin: ReturnType<typeof desplegar> } {
  const modelo = modeloCocinarHuevo();
  const fin = desplegar(modelo, iniciarSimulacion(modelo, "raiz"));
  return { modelo, fin };
}

describe("integración Ss↔Fs (anamorfismo/catamorfismo sobre F0)", () => {
  test("la corrida sí ejerció la transición crudo→cocido (precondición del fixture)", () => {
    const { fin } = corrida();
    expect(fin.trace.length).toBe(1);
    expect(fin.trace[0]!.transicionesAplicadas).toEqual([
      { entidadId: "Huevo", estadoAntesId: "s0crudo", estadoDespuesId: "s1cocido" },
    ]);
  });

  test("LEY S⊑F0: toda referencia de la traza está denotada en el haz de hechos F0", () => {
    const { modelo, fin } = corrida();
    // LHS computado independiente del puente: los ids que la traza toca.
    const idsEntidad = new Set<string>();
    const idsEstado = new Set<string>();
    for (const h of hechosDe(modelo).values()) {
      if (h.tipo === "entidad") idsEntidad.add(h.entidadId);
      else if (h.tipo === "estado") idsEstado.add(h.estadoId);
    }
    for (const e of fin.trace) {
      expect(idsEntidad.has(e.procesoId)).toBe(true);
      for (const t of e.transicionesAplicadas) {
        expect(idsEntidad.has(t.entidadId)).toBe(true);
        if (t.estadoAntesId) expect(idsEstado.has(t.estadoAntesId)).toBe(true);
        if (t.estadoDespuesId) expect(idsEstado.has(t.estadoDespuesId)).toBe(true);
      }
    }
  });

  test("hechosEjercidosPorTraza captura la sección del haz (proceso + objeto + estados + enlaces)", () => {
    const { modelo, fin } = corrida();
    const ejercidos = hechosEjercidosPorTraza(modelo, fin);
    const todos = hechosDe(modelo);
    // subconjunto estricto de F0: el unfold no inventa estructura.
    for (const clave of ejercidos.keys()) expect(todos.has(clave)).toBe(true);
    const vals = [...ejercidos.values()];
    expect(vals.filter((h) => h.tipo === "entidad").length).toBe(2); // Cocinar + Huevo
    expect(vals.filter((h) => h.tipo === "estado").length).toBe(2); // crudo + cocido
    expect(vals.filter((h) => h.tipo === "enlace").length).toBe(2); // consumo + resultado
  });

  test("LEY dualidad S→F3: todo objeto que S transicionó, F3 lo reconoce (afectan-a)", () => {
    const { modelo, fin } = corrida();
    const transicionadas = new Set<string>();
    for (const e of fin.trace) for (const t of e.transicionesAplicadas) transicionadas.add(t.entidadId);
    expect(transicionadas.has("Huevo")).toBe(true);
    for (const entidadId of transicionadas) {
      // la estática (F3) debe reconocer la dinámica (S): coinciden sobre F0.
      expect(derivar(modelo, { tipo: "afectan-a", entidadId }).length).toBeGreaterThan(0);
    }
  });

  test("razonarSobreCorrida cierra el ciclo unfold→fold (F3 razona sobre lo que S ejerció)", () => {
    const { modelo, fin } = corrida();
    const derivados = razonarSobreCorrida(modelo, fin);
    expect(derivados.length).toBeGreaterThan(0);
    expect(derivados.some((d) => d.procesoId === "Cocinar")).toBe(true);
  });

  test("control de no-tautología: «Sal» aislada ni se transiciona ni la reconoce F3", () => {
    const { modelo, fin } = corrida();
    expect(entidadesVisitadas(fin).has("Sal")).toBe(false);
    expect(derivar(modelo, { tipo: "afectan-a", entidadId: "Sal" }).length).toBe(0);
  });
});

/** Modelo B simulable mínimo: un proceso «Hornear» en el OPD raíz. */
function modeloHornear(): Modelo {
  return {
    id: "b",
    nombre: "b",
    opdRaizId: "raiz",
    nextSeq: 100,
    entidades: {
      Hornear: { id: "Hornear", tipo: "proceso", nombre: "Hornear", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {},
    opds: {
      raiz: {
        id: "raiz",
        nombre: "SD",
        padreId: null,
        apariencias: { apHor: { id: "apHor", entidadId: "Hornear", opdId: "raiz", x: 0, y: 0, width: 100, height: 50 } },
        enlaces: {},
      },
    },
  };
}

describe("integración F1↔S (la composición preserva la simulabilidad)", () => {
  test("LEY F1↔S: simular(A∘B) ejerce los procesos de A Y de B (componer no pierde dinámica)", () => {
    const a = modeloCocinarHuevo(); // proceso «Cocinar»
    const b = modeloHornear(); // proceso «Hornear»
    const compuesto = must(componerModelos(a, b, {}));
    const fin = desplegar(compuesto, iniciarSimulacion(compuesto, compuesto.opdRaizId));
    // Por nombre (los ids de B se namespacearon): ambos procesos fueron ejercidos.
    const nombresVisitados = new Set(
      [...entidadesVisitadas(fin)].map((id) => compuesto.entidades[id]?.nombre),
    );
    expect(nombresVisitados.has("Cocinar")).toBe(true); // de A
    expect(nombresVisitados.has("Hornear")).toBe(true); // de B
  });
});
