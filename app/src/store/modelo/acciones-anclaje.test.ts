// Tests del slice del Centinela de Drift (corte Anclaje α, Fase 1): el RESOLUTOR de hash vivo.
//
// El kernel puro (`evaluarDrift*`, `reSincronizarAnclaje`, `soltarAnclaje`) ya está probado
// en `src/leyes/anclaje-centinela.test.ts`. Aquí se prueba el ESLABÓN NUEVO: la orquestación
// con efecto que carga las bibliotecas ancladas DESDE EL BACKEND PERSISTIDO, computa su firma
// viva, y construye/limpia el `driftMap`. Refuerzo #2 del acta de arranque: el drift se mide
// contra lo que el backend tiene guardado, NUNCA contra runtime de otra pestaña — se sella aquí.
//
// Harness de backend-mock idéntico a `composicion-ux.test.ts` (fetch real interceptado +
// `window` definido para habilitar la persistencia).
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import {
  anclarAPieza,
  crearModelo,
  crearObjeto,
  firmaBiblioteca,
} from "../../modelo/operaciones";
import type { BibliotecaRef, Id, Modelo, Resultado } from "../../modelo/tipos";
import type { ModeloPersistido } from "../../persistencia/modelos";
import { exportarModelo, hidratarModelo } from "../../serializacion/json";
import { store } from "../../store";

let originalFetch: typeof fetch;
let backend: BackendMock;

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function entidadId(modelo: Modelo, nombre: string): Id {
  const e = Object.values(modelo.entidades).find((x) => x.nombre === nombre);
  if (!e) throw new Error(`Entidad no encontrada: ${nombre}`);
  return e.id;
}

/** Greda gist v1: una biblioteca de Piezas persistida aparte, con un id estable. */
function gredaV1(modeloId = "gist-lib"): Modelo {
  let g = crearModelo("gist 14.1.0");
  g = { ...g, id: modeloId };
  g = must(crearObjeto(g, g.opdRaizId, { x: 0, y: 0 }, "Category"));
  return g;
}

/** La misma greda con una raíz extra: gist evolucionó (firma viva distinta). */
function gredaV2(modeloId = "gist-lib"): Modelo {
  let g = gredaV1(modeloId);
  g = must(crearObjeto(g, g.opdRaizId, { x: 200, y: 0 }, "Aspect"));
  return g;
}

/**
 * Firma de la biblioteca TAL COMO LA SIRVE EL BACKEND (round-trip export→hidratar). Es la
 * forma contra la que el resolutor compara: el `firmaBiblioteca` de la forma in-memory difiere
 * del de la forma normalizada/hidratada (opforja inyecta defaults). El anclaje DEBE congelarse
 * contra esta forma para que recargar el modelo no dispare un falso `divergente`. (En producción
 * el gesto de anclar —fuera de Fase 1— debe hacer lo mismo: congelar contra la firma servida.)
 */
function firmaServida(greda: Modelo): string {
  const round = hidratarModelo(exportarModelo(greda));
  return firmaBiblioteca(must(round));
}

/** Modelo de trabajo con una cosa anclada a la Pieza `ent-Category` de `greda`, hash congelado a la forma SERVIDA. */
function modeloConAnclada(nombre: string, greda: Modelo): Modelo {
  let m = crearModelo("HODOM");
  m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, nombre));
  const biblioteca: BibliotecaRef = { modeloId: greda.id, nombre: greda.nombre, frozenAtHash: firmaServida(greda) };
  m = must(anclarAPieza(m, entidadId(m, nombre), biblioteca, "ent-Category" as Id));
  return m;
}

function cargarEnStore(m: Modelo): void {
  store.getState().importarJson(exportarModelo(m));
}

beforeEach(() => {
  backend = instalarBackendMock();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  Reflect.deleteProperty(globalThis, "window");
});

describe("cargarYEvaluarDrift — el resolutor de hash vivo contra el backend persistido", () => {
  test("sin cosas ancladas ⇒ driftMap vacío (no toca el backend)", async () => {
    cargarEnStore(crearModelo("Local sin anclas"));
    await store.getState().cargarYEvaluarDrift();
    expect(store.getState().driftMap).toEqual({});
  });

  test("biblioteca persistida == congelada ⇒ sincronizado", async () => {
    const greda = gredaV1();
    guardarModeloEnBackendMock({ id: greda.id, nombre: greda.nombre, json: exportarModelo(greda) });
    cargarEnStore(modeloConAnclada("Disciplina", greda));
    const id = entidadId(store.getState().modelo, "Disciplina");

    await store.getState().cargarYEvaluarDrift();
    expect(store.getState().driftMap[id]).toBe("sincronizado");
  });

  test("biblioteca persistida CAMBIÓ (v2) ⇒ divergente — el aviso", async () => {
    const v1 = gredaV1();
    // El modelo de trabajo ancla a la firma de v1…
    cargarEnStore(modeloConAnclada("Disciplina", v1));
    const id = entidadId(store.getState().modelo, "Disciplina");
    // …pero lo PERSISTIDO en el backend es v2 (gist evolucionó bajo los pies del anclaje).
    const v2 = gredaV2();
    guardarModeloEnBackendMock({ id: v2.id, nombre: v2.nombre, json: exportarModelo(v2) });

    await store.getState().cargarYEvaluarDrift();
    expect(store.getState().driftMap[id]).toBe("divergente");
  });

  test("biblioteca ausente en el backend ⇒ no-resuelto (no inventa divergencia)", async () => {
    const greda = gredaV1();
    cargarEnStore(modeloConAnclada("Disciplina", greda)); // greda NO guardada en el mock
    const id = entidadId(store.getState().modelo, "Disciplina");

    await store.getState().cargarYEvaluarDrift();
    expect(store.getState().driftMap[id]).toBe("no-resuelto");
  });

  test("junta modeloId ÚNICOS: dos cosas a la misma biblioteca ⇒ una sola carga, ambas en el driftMap", async () => {
    const greda = gredaV1();
    guardarModeloEnBackendMock({ id: greda.id, nombre: greda.nombre, json: exportarModelo(greda) });
    // Dos cosas ancladas a la MISMA biblioteca.
    let m = crearModelo("HODOM");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Disciplina"));
    m = must(crearObjeto(m, m.opdRaizId, { x: 200, y: 0 }, "Etiqueta"));
    const biblioteca: BibliotecaRef = { modeloId: greda.id, nombre: greda.nombre, frozenAtHash: firmaServida(greda) };
    m = must(anclarAPieza(m, entidadId(m, "Disciplina"), biblioteca, "ent-Category" as Id));
    m = must(anclarAPieza(m, entidadId(m, "Etiqueta"), biblioteca, "ent-Category" as Id));
    cargarEnStore(m);
    const vivo = store.getState().modelo;

    await store.getState().cargarYEvaluarDrift();
    const drift = store.getState().driftMap;
    expect(drift[entidadId(vivo, "Disciplina")]).toBe("sincronizado");
    expect(drift[entidadId(vivo, "Etiqueta")]).toBe("sincronizado");
    expect(backend.getCount.get(greda.id)).toBe(1); // SELLO: una sola carga por biblioteca única
  });

  test("SELLO refuerzo #2: el drift se mide contra el BACKEND, no contra el modelo en runtime", async () => {
    // El modelo en runtime ancla y congela a v1; el backend tiene v2. Aunque el runtime
    // "cree" estar sincronizado (su frozen == su propia firma), el Centinela compara contra
    // lo PERSISTIDO (v2) y reporta divergente. Esto distingue "drift real persistido" de
    // "edición no commiteada en runtime".
    const v1 = gredaV1();
    cargarEnStore(modeloConAnclada("Disciplina", v1));
    const id = entidadId(store.getState().modelo, "Disciplina");
    const v2 = gredaV2();
    guardarModeloEnBackendMock({ id: v2.id, nombre: v2.nombre, json: exportarModelo(v2) });

    // Sanity: el frozen del runtime SÍ casa con la firma SERVIDA de v1 (no es drift "de runtime").
    expect(store.getState().modelo.entidades[id]!.anclaje!.biblioteca.frozenAtHash).toBe(firmaServida(v1));
    await store.getState().cargarYEvaluarDrift();
    expect(store.getState().driftMap[id]).toBe("divergente"); // mide contra el backend (v2)
  });

  test("una evaluación antigua no sobrescribe el drift del modelo vigente", async () => {
    const bibliotecaA = gredaV1("lib-a");
    const bibliotecaB = gredaV1("lib-b");
    guardarModeloEnBackendMock({ id: bibliotecaA.id, nombre: bibliotecaA.nombre, json: exportarModelo(bibliotecaA) });
    guardarModeloEnBackendMock({ id: bibliotecaB.id, nombre: bibliotecaB.nombre, json: exportarModelo(bibliotecaB) });
    const pendientes = new Map<string, Diferido<Response>>();
    globalThis.fetch = ((input: RequestInfo | URL) => {
      const id = decodeURIComponent(String(input).split("/").pop() ?? "");
      const diferido = crearDiferido<Response>();
      pendientes.set(id, diferido);
      return diferido.promise;
    }) as typeof fetch;

    const modeloA = modeloConAnclada("Pieza A", bibliotecaA);
    store.setState({ modelo: modeloA, driftMap: {} });
    const evaluacionA = store.getState().cargarYEvaluarDrift();

    const modeloB = modeloConAnclada("Pieza B", bibliotecaB);
    const piezaBId = entidadId(modeloB, "Pieza B");
    store.setState({ modelo: modeloB, driftMap: {} });
    const evaluacionB = store.getState().cargarYEvaluarDrift();

    pendientes.get(bibliotecaB.id)?.resolve(jsonResponse({ modelo: backend.modelos.get(bibliotecaB.id) }));
    await evaluacionB;
    expect(store.getState().driftMap[piezaBId]).toBe("sincronizado");

    pendientes.get(bibliotecaA.id)?.resolve(jsonResponse({ modelo: backend.modelos.get(bibliotecaA.id) }));
    await evaluacionA;
    expect(store.getState().driftMap[piezaBId]).toBe("sincronizado");
  });
});

describe("reSincronizarAnclajeEntidad — re-congela al hash vivo y entra al undo", () => {
  test("adopta la versión nueva del backend, marca sincronizado y el commit es deshacible", async () => {
    const v1 = gredaV1();
    cargarEnStore(modeloConAnclada("Disciplina", v1));
    const id = entidadId(store.getState().modelo, "Disciplina");
    const v2 = gredaV2();
    guardarModeloEnBackendMock({ id: v2.id, nombre: v2.nombre, json: exportarModelo(v2) });

    await store.getState().cargarYEvaluarDrift();
    expect(store.getState().driftMap[id]).toBe("divergente");

    await store.getState().reSincronizarAnclajeEntidad(id);
    // El frozen se re-congeló a la firma viva (servida) de v2.
    expect(store.getState().modelo.entidades[id]!.anclaje!.biblioteca.frozenAtHash).toBe(firmaServida(v2));
    expect(store.getState().driftMap[id]).toBe("sincronizado");
    // El commit entró al undo: se puede deshacer.
    expect(store.getState().puedeDeshacer).toBe(true);
    store.getState().deshacer();
    expect(store.getState().modelo.entidades[id]!.anclaje!.biblioteca.frozenAtHash).toBe(firmaServida(v1));
  });

  test("biblioteca caída ⇒ mensaje de error, modelo intacto (no muta el anclaje)", async () => {
    const v1 = gredaV1();
    cargarEnStore(modeloConAnclada("Disciplina", v1)); // backend vacío: la biblioteca no resuelve
    const id = entidadId(store.getState().modelo, "Disciplina");
    const frozenAntes = store.getState().modelo.entidades[id]!.anclaje!.biblioteca.frozenAtHash;

    await store.getState().reSincronizarAnclajeEntidad(id);
    expect(store.getState().modelo.entidades[id]!.anclaje!.biblioteca.frozenAtHash).toBe(frozenAntes);
    expect(store.getState().mensaje).toContain("No se pudo leer la biblioteca");
  });
});

describe("soltarAnclajeEntidad — desancla, sale del driftMap, commit deshacible", () => {
  test("quita el anclaje, lo saca del driftMap y el commit entra al undo", async () => {
    const greda = gredaV1();
    guardarModeloEnBackendMock({ id: greda.id, nombre: greda.nombre, json: exportarModelo(greda) });
    cargarEnStore(modeloConAnclada("Disciplina", greda));
    const id = entidadId(store.getState().modelo, "Disciplina");

    await store.getState().cargarYEvaluarDrift();
    expect(store.getState().driftMap[id]).toBe("sincronizado");

    store.getState().soltarAnclajeEntidad(id);
    expect(store.getState().modelo.entidades[id]!.anclaje).toBeUndefined();
    expect(store.getState().driftMap[id]).toBeUndefined(); // fuera del Centinela
    expect(store.getState().puedeDeshacer).toBe(true);

    store.getState().deshacer();
    // El undo inmediato restaura el anclaje; conservar el cambio sí deja la cosa
    // como Calco, sin una reconversión directa posterior a Anclaje.
    expect(store.getState().modelo.entidades[id]!.anclaje).toBeDefined();
  });

  test("soltar una cosa NO anclada ⇒ mensaje de error, sin commit", () => {
    let m = crearModelo("Local");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Local"));
    cargarEnStore(m);
    const id = entidadId(store.getState().modelo, "Local");
    store.getState().soltarAnclajeEntidad(id);
    expect(store.getState().mensaje).toBeTruthy();
    expect(store.getState().puedeDeshacer).toBe(false);
  });
});

interface BackendMock {
  modelos: Map<string, ModeloPersistido>;
  getCount: Map<string, number>;
}

interface Diferido<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
}

function crearDiferido<T>(): Diferido<T> {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolver) => { resolve = resolver; });
  return { promise, resolve };
}

function guardarModeloEnBackendMock(input: Pick<ModeloPersistido, "id" | "nombre" | "json"> & Partial<ModeloPersistido>): void {
  const ahora = "2026-06-26T00:00:00.000Z";
  backend.modelos.set(input.id, {
    descripcion: "",
    creadoEn: ahora,
    actualizadoEn: ahora,
    carpetaId: null,
    revision: 1,
    ...input,
  });
}

function instalarBackendMock(): BackendMock {
  Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
  originalFetch = globalThis.fetch;
  const mock: BackendMock = { modelos: new Map(), getCount: new Map() };
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? "GET";
    if (url.startsWith("/__deep-opm/modelos/") && method === "GET") {
      const id = decodeURIComponent(url.split("/").pop() ?? "");
      mock.getCount.set(id, (mock.getCount.get(id) ?? 0) + 1);
      const modelo = mock.modelos.get(id);
      return Promise.resolve(modelo
        ? jsonResponse({ modelo })
        : jsonResponse({ error: "Modelo no encontrado en servidor" }, 404));
    }
    return Promise.resolve(jsonResponse({ error: "unexpected" }, 404));
  }) as unknown as typeof fetch;
  return mock;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}
