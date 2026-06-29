// Tests de los verbos de la PUERTA del Anclaje (corte "gesto de anclar", B2+B3):
// `calcarPiezaBiblioteca` y `anclarPiezaBiblioteca` del store.
//
// Calcar clona-y-olvida (sin anclaje). Anclar = Calcar + atar, con `frozenAtHash`
// resuelto del BACKEND PERSISTIDO (mismo cálculo que el Centinela) ⇒ arranca
// sincronizado. Harness de backend-mock idéntico a `acciones-anclaje.test.ts`.
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, firmaBiblioteca } from "../../modelo/operaciones";
import type { Entidad, Estado, Id, Modelo, Resultado } from "../../modelo/tipos";
import type { ModeloPersistido } from "../../persistencia/modelos";
import { exportarModelo, hidratarModelo } from "../../serializacion/json";
import { store } from "../../store";

let originalFetch: typeof fetch;
let backend: BackendMock;

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function entidad(modelo: Modelo, nombre: string): Entidad {
  const e = Object.values(modelo.entidades).find((x) => x.nombre === nombre);
  if (!e) throw new Error(`Entidad no encontrada: ${nombre}`);
  return e;
}

/** Biblioteca gist: una Pieza "Recurso" persistida aparte con id estable. */
function biblioteca(modeloId = "gist-lib"): Modelo {
  let lib = crearModelo("gist 14.1.0");
  lib = { ...lib, id: modeloId };
  lib = must(crearObjeto(lib, lib.opdRaizId, { x: 0, y: 0 }, "Recurso"));
  return lib;
}

/** Firma de la biblioteca TAL COMO LA SIRVE EL BACKEND (round-trip export→hidratar). */
function firmaServida(lib: Modelo): string {
  return firmaBiblioteca(must(hidratarModelo(exportarModelo(lib))));
}

/** Estados de la Pieza tal como el caller (UI) los extrae de la biblioteca cargada. */
function estadosDe(lib: Modelo, pieza: Entidad): Estado[] {
  return Object.values(lib.estados).filter((s) => s.entidadId === pieza.id);
}

function cargarActivo(nombre = "HODOM"): void {
  store.getState().importarJson(exportarModelo(crearModelo(nombre)));
}

/** Id de la única cosa del modelo activo que NO existía antes (la recién calcada/anclada). */
function idNuevo(antes: Set<Id>): Id {
  const ahora = Object.keys(store.getState().modelo.entidades);
  const nuevo = ahora.find((id) => !antes.has(id));
  if (!nuevo) throw new Error("No apareció ninguna entidad nueva");
  return nuevo;
}

beforeEach(() => {
  backend = instalarBackendMock();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  Reflect.deleteProperty(globalThis, "window");
});

describe("calcarPiezaBiblioteca — clona-y-olvida (sin anclaje)", () => {
  test("calca la Pieza al OPD activo con id fresco, seleccionada y SIN anclaje", () => {
    const lib = biblioteca();
    const recurso = entidad(lib, "Recurso");
    cargarActivo();
    const antes = new Set(Object.keys(store.getState().modelo.entidades));

    store.getState().calcarPiezaBiblioteca({ entidad: recurso, estados: estadosDe(lib, recurso) });

    const nuevoId = idNuevo(antes);
    const clon = store.getState().modelo.entidades[nuevoId]!;
    expect(clon.nombre).toBe("Recurso");
    expect(clon.anclaje).toBeUndefined(); // Calcar NO ancla
    expect(store.getState().seleccionId).toBe(nuevoId); // aterriza seleccionada
    expect(store.getState().driftMap[nuevoId]).toBeUndefined(); // un Calco no entra al Centinela
  });
});

describe("anclarPiezaBiblioteca — Calcar + atar, frozen del backend, arranca sincronizado", () => {
  test("deja anclaje con frozenAtHash de la biblioteca servida y arranca sincronizado", async () => {
    const lib = biblioteca();
    guardarModeloEnBackendMock({ id: lib.id, nombre: lib.nombre, json: exportarModelo(lib) });
    const recurso = entidad(lib, "Recurso");
    cargarActivo();
    const antes = new Set(Object.keys(store.getState().modelo.entidades));

    await store.getState().anclarPiezaBiblioteca({
      entidad: recurso,
      estados: estadosDe(lib, recurso),
      modeloId: lib.id,
      nombre: lib.nombre,
    });

    const nuevoId = idNuevo(antes);
    const anclada = store.getState().modelo.entidades[nuevoId]!;
    expect(anclada.anclaje).toBeDefined();
    expect(anclada.anclaje!.piezaId).toBe(recurso.id);
    expect(anclada.anclaje!.biblioteca.modeloId).toBe(lib.id);
    expect(anclada.anclaje!.biblioteca.nombre).toBe(lib.nombre);
    // El frozen se congela contra la firma SERVIDA por el backend (no la in-memory).
    expect(anclada.anclaje!.biblioteca.frozenAtHash).toBe(firmaServida(lib));
    // Arranca sincronizado y se mantiene tras evaluar contra el backend.
    expect(store.getState().driftMap[nuevoId]).toBe("sincronizado");
    expect(store.getState().seleccionId).toBe(nuevoId);

    await store.getState().cargarYEvaluarDrift();
    expect(store.getState().driftMap[nuevoId]).toBe("sincronizado");
  });

  test("biblioteca irresoluble en el backend ⇒ no ancla, mensaje de error, modelo intacto", async () => {
    const lib = biblioteca(); // NO se guarda en el mock ⇒ no resuelve
    const recurso = entidad(lib, "Recurso");
    cargarActivo();
    const cuentaAntes = Object.keys(store.getState().modelo.entidades).length;

    await store.getState().anclarPiezaBiblioteca({
      entidad: recurso,
      estados: estadosDe(lib, recurso),
      modeloId: lib.id,
    });

    expect(Object.keys(store.getState().modelo.entidades).length).toBe(cuentaAntes); // no calcó nada
    expect(store.getState().mensaje).toContain("No se pudo leer la biblioteca");
  });
});

interface BackendMock {
  modelos: Map<string, ModeloPersistido>;
  getCount: Map<string, number>;
}

function guardarModeloEnBackendMock(input: Pick<ModeloPersistido, "id" | "nombre" | "json"> & Partial<ModeloPersistido>): void {
  const ahora = "2026-06-29T00:00:00.000Z";
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
