import { describe, expect, test } from "bun:test";
import { desplegar, iniciarSimulacion } from "../modelo/simulacion/runner";
import {
  entidadesVisitadas,
  hechosEjercidosPorTraza,
  razonarSobreCorrida,
  verificarBisimulacionFrontera,
} from "../modelo/simulacion/integracionHechos";
import { hechosDe } from "../modelo/hechos";
import { derivar } from "../modelo/razonamiento";
import { componerModelos } from "../modelo/composicion";
import { crearEnlace, crearModelo, crearObjeto, crearProceso, descomponerProceso } from "../modelo/operaciones";
import { observarPreservacionFrontera } from "../modelo/equivalencia";
import type { Id, Modelo, Resultado } from "../modelo/tipos";

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

describe("integración F2↔S (la descomposición es simulable y coherente con F0)", () => {
  test("LEY F2↔S: un in-zoom F2-coherente es simulable y respeta S⊑F0 (puente S↔descomposición↔F2)", () => {
    // Transformador con frontera: Pedido -(consumo)-> Procesar -(resultado)-> Despacho.
    let base = crearModelo("Pedido");
    base = must(crearObjeto(base, base.opdRaizId, { x: 40, y: 80 }, "Pedido"));
    base = must(crearProceso(base, base.opdRaizId, { x: 240, y: 80 }, "Procesar"));
    base = must(crearObjeto(base, base.opdRaizId, { x: 440, y: 80 }, "Despacho"));
    const procesarId = Object.values(base.entidades).find((e) => e.tipo === "proceso")!.id;
    const pedidoId = Object.values(base.entidades).find((e) => e.nombre === "Pedido")!.id;
    const despachoId = Object.values(base.entidades).find((e) => e.nombre === "Despacho")!.id;
    base = must(crearEnlace(base, base.opdRaizId, pedidoId, procesarId, "consumo"));
    base = must(crearEnlace(base, base.opdRaizId, procesarId, despachoId, "resultado"));

    const modelo = must(descomponerProceso(base, base.opdRaizId, procesarId)).modelo;
    const opdHijoId = modelo.entidades[procesarId]?.refinamientos?.descomposicion?.opdId;
    expect(opdHijoId).toBeDefined();

    // Precondición F2: el in-zoom fresco PRESERVA la frontera de "Procesar" (coherente).
    expect(observarPreservacionFrontera(modelo).some((o) => o.procesoId === procesarId)).toBe(false);

    // Ley S⊑F0 sobre la descomposición: simular el in-zoom NO inventa estructura fuera de F0.
    // (la bisimulación de frontera plena —que S ejerza las entidades de frontera— queda como
    //  diseño-mayor: exige confirmar que los subprocesos del in-zoom ejercen los enlaces heredados.)
    const fin = desplegar(modelo, iniciarSimulacion(modelo, opdHijoId!));
    const todos = hechosDe(modelo);
    for (const clave of hechosEjercidosPorTraza(modelo, fin).keys()) {
      expect(todos.has(clave)).toBe(true);
    }
  });

  test("LEY F2↔S frontera plena: simular el in-zoom ejerce la firma de frontera del proceso abstracto", () => {
    const { modelo, procesarId, pedidoId, despachoId, opdHijoId } = modeloPedidoProcesarDespachoDescompuesto();

    const fin = desplegar(modelo, iniciarSimulacion(modelo, opdHijoId));
    const bisimulacion = verificarBisimulacionFrontera(modelo, fin, procesarId);

    expect(bisimulacion.equivalente).toBe(true);
    expect(bisimulacion.firmaAbstracta).toContain(`${pedidoId}|consumo|origen`);
    expect(bisimulacion.firmaAbstracta).toContain(`${despachoId}|resultado|destino`);
    expect(bisimulacion.firmaEjercida).toEqual(bisimulacion.firmaAbstracta);
  });

  test("control de no-tautología F2↔S: si el hijo no ejerce un derivado de frontera, la bisimulación falla", () => {
    const fixture = modeloPedidoProcesarDespachoDescompuesto();
    const modeloRoto = quitarDerivadoDeFrontera(fixture.modelo, fixture.opdHijoId, "consumo");

    const fin = desplegar(modeloRoto, iniciarSimulacion(modeloRoto, fixture.opdHijoId));
    const bisimulacion = verificarBisimulacionFrontera(modeloRoto, fin, fixture.procesarId);

    expect(bisimulacion.equivalente).toBe(false);
    expect(bisimulacion.diferencias).toContain(`${fixture.pedidoId}|consumo|origen`);
  });
});

function modeloPedidoProcesarDespachoDescompuesto(): {
  modelo: Modelo;
  procesarId: Id;
  pedidoId: Id;
  despachoId: Id;
  opdHijoId: Id;
} {
  let base = crearModelo("Pedido");
  base = must(crearObjeto(base, base.opdRaizId, { x: 40, y: 80 }, "Pedido"));
  base = must(crearProceso(base, base.opdRaizId, { x: 240, y: 80 }, "Procesar"));
  base = must(crearObjeto(base, base.opdRaizId, { x: 440, y: 80 }, "Despacho"));
  const procesarId = Object.values(base.entidades).find((e) => e.tipo === "proceso")!.id;
  const pedidoId = Object.values(base.entidades).find((e) => e.nombre === "Pedido")!.id;
  const despachoId = Object.values(base.entidades).find((e) => e.nombre === "Despacho")!.id;
  base = must(crearEnlace(base, base.opdRaizId, pedidoId, procesarId, "consumo"));
  base = must(crearEnlace(base, base.opdRaizId, procesarId, despachoId, "resultado"));

  const modelo = must(descomponerProceso(base, base.opdRaizId, procesarId)).modelo;
  const opdHijoId = modelo.entidades[procesarId]?.refinamientos?.descomposicion?.opdId;
  if (!opdHijoId) throw new Error("Fixture sin OPD hijo");
  return { modelo, procesarId, pedidoId, despachoId, opdHijoId };
}

function quitarDerivadoDeFrontera(modelo: Modelo, opdId: Id, tipo: "consumo" | "resultado"): Modelo {
  const opd = modelo.opds[opdId];
  if (!opd) throw new Error(`OPD no encontrado: ${opdId}`);
  return {
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces: Object.fromEntries(
          Object.entries(opd.enlaces).filter(([, apariencia]) => {
            const enlace = modelo.enlaces[apariencia.enlaceId];
            return enlace?.tipo !== tipo || enlace.derivado?.tipo !== "enlace-externo-refinamiento";
          }),
        ),
      },
    },
  };
}
