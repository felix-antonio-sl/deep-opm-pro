import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import type { ModeloPersistido } from "../persistencia/modelos";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store";

let originalFetch: typeof fetch;
const cargarYEvaluarDriftOriginal = store.getState().cargarYEvaluarDrift;

describe("slice persistencia backend-only", () => {
  let backend: BackendMock;

  beforeEach(() => {
    backend = instalarBackendMock();
    store.getState().activarReadOnly(false);
    store.getState().importarJson(exportarModelo(crearModelo()));
  });

  afterEach(() => {
    store.setState({ cargarYEvaluarDrift: cargarYEvaluarDriftOriginal });
    globalThis.fetch = originalFetch;
    Reflect.deleteProperty(globalThis, "window");
  });

  test("listarModelosGuardados conserva el contrato de arreglo publico", async () => {
    store.getState().listarModelosGuardados();
    await esperar(() => store.getState().mensaje === null);
    expect(Array.isArray(store.getState().modelosGuardados)).toBe(true);
  });

  test("guardarLocal en read-only redirige a Guardar Como y deja copia editable", async () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Modelo publicado" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const idPublicado = store.getState().modeloPersistidoId;
    expect(idPublicado).toBeTruthy();

    store.getState().activarReadOnly(true);
    store.getState().guardarLocal();
    await esperar(() => store.getState().modeloPersistidoId !== idPublicado);

    expect(store.getState().readOnly).toBe(false);
    expect(store.getState().modeloPersistidoId).not.toBe(idPublicado);
    expect(store.getState().modelo.nombre).toBe("Modelo publicado copia");
    expect(store.getState().modelosGuardados.map((modelo) => modelo.nombre).sort()).toEqual([
      "Modelo publicado",
      "Modelo publicado copia",
    ]);
  });

  test("Guardar como permite actualizar el modelo actual con su mismo nombre", async () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "HODOM completo v14", descripcion: "Base" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const idPersistido = store.getState().modeloPersistidoId;
    expect(idPersistido).toBeTruthy();

    store.getState().crearProcesoDemo();
    expect(store.getState().dirty).toBe(true);
    store.getState().abrirGuardarComo();
    store.getState().guardarComoLocalConDescripcion({
      nombre: "HODOM completo v14",
      descripcion: "Actualizado desde Guardar como",
    });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");

    expect(store.getState().dialogoGuardarComoAbierto).toBe(false);
    expect(store.getState().modeloPersistidoId).toBe(idPersistido);
    expect(store.getState().dirty).toBe(false);
    expect(store.getState().descripcionModeloLocal).toBe("Actualizado desde Guardar como");
    expect(store.getState().modelosGuardados.filter((modelo) => modelo.nombre === "HODOM completo v14")).toHaveLength(1);
  });

  test("cargar modelo usa backend como unica fuente", async () => {
    const modeloServidor = crearModelo("Copia backend vigente");
    const ahora = "2026-06-06T00:00:00.000Z";
    backend.modelos.set("modelo-stale", {
      id: "modelo-stale",
      nombre: "Copia backend vigente",
      descripcion: "server",
      creadoEn: ahora,
      actualizadoEn: ahora,
      carpetaId: null,
      json: exportarModelo(modeloServidor),
      revision: 1,
    });
    store.setState({ modelosGuardados: [{
      id: "modelo-stale",
      nombre: "Copia backend vigente",
      descripcion: "server",
      creadoEn: ahora,
      actualizadoEn: ahora,
      revision: 1,
    }] });

    store.getState().cargarLocal("modelo-stale");
    await esperar(() => store.getState().mensaje === "Modelo cargado: Copia backend vigente");

    expect(store.getState().modelo.nombre).toBe("Copia backend vigente");
    expect(store.getState().descripcionModeloLocal).toBe("server");
  });

  test("cargar modelo reevalua drift despues de montar la revision hidratada", async () => {
    const modeloServidor = crearModelo("Revision del agente");
    const ahora = "2026-07-12T00:00:00.000Z";
    backend.modelos.set("modelo-agente", {
      id: "modelo-agente",
      nombre: "Revision del agente",
      descripcion: "server",
      creadoEn: ahora,
      actualizadoEn: ahora,
      carpetaId: null,
      json: exportarModelo(modeloServidor),
      revision: 2,
    });
    const modelosEvaluados: string[] = [];
    store.setState({
      cargarYEvaluarDrift: async () => {
        modelosEvaluados.push(store.getState().modelo.nombre);
      },
    });

    store.getState().cargarLocal("modelo-agente");
    await esperar(() => modelosEvaluados.length > 0);

    expect(modelosEvaluados).toEqual(["Revision del agente"]);
  });

  test("A′-vitrina: guardado propio NO gatilla el chip; push del agente SÍ", async () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Modelo vitrina" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;
    // La base se fija al nacer el modelo.
    expect(typeof store.getState().revisionBasePorModelo[id]).toBe("number");
    // Guardado propio adicional: la base debe avanzar con la revisión.
    store.getState().crearProcesoDemo();
    store.getState().guardarLocal();
    await esperar(() => store.getState().dirty === false && store.getState().mensaje === "Modelo guardado exitosamente");
    const base1 = store.getState().revisionBasePorModelo[id]!;
    await store.getState().verificarRevisionRemota();
    // remota == base ⇒ el selector oculta el chip (mi propio guardado).
    expect(store.getState().revisionRemota).toEqual({ modeloId: id, revision: base1 });
    // Simular push del agente: el backend avanza una revisión por fuera.
    backend.modelos.set(id, { ...backend.modelos.get(id)!, revision: base1 + 1 });
    await store.getState().verificarRevisionRemota();
    expect(store.getState().revisionRemota).toEqual({ modeloId: id, revision: base1 + 1 });
    // Base intacta ⇒ remota > base ⇒ el selector mostrará el chip.
    expect(store.getState().revisionBasePorModelo[id]).toBe(base1);
  });

  test("A′-vitrina: traerRevisionDelAgente recarga y limpia revisionRemota", async () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Modelo traer" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;
    const base = store.getState().revisionBasePorModelo[id]!;
    backend.modelos.set(id, { ...backend.modelos.get(id)!, revision: base + 1 });
    await store.getState().verificarRevisionRemota();
    expect(store.getState().revisionRemota).not.toBeNull();
    store.getState().traerRevisionDelAgente();
    await esperar(() => store.getState().revisionRemota === null && store.getState().revisionBasePorModelo[id] === base + 1);
    expect(store.getState().revisionBasePorModelo[id]).toBe(base + 1); // base avanzó al recargar la revisión del agente
  });
});

interface BackendMock {
  modelos: Map<string, ModeloPersistido>;
  workspace: { modelos: Array<{ id: string; carpetaId: string | null }>; carpetas: []; recientes: string[] };
}

function instalarBackendMock(): BackendMock {
  Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
  originalFetch = globalThis.fetch;
  const backend: BackendMock = { modelos: new Map(), workspace: { modelos: [], carpetas: [], recientes: [] } };
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? "GET";
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    if (url === "/__deep-opm/session") {
      return Promise.resolve(jsonResponse({ session: { tenantId: "tenant-test", userId: "user-test" } }));
    }
    if (url === "/__deep-opm/modelos?includePayload=1" && method === "GET") {
      return Promise.resolve(jsonResponse({ modelos: [...backend.modelos.values()] }));
    }
    if (url === "/__deep-opm/workspace" && method === "GET") {
      return Promise.resolve(jsonResponse({ indice: backend.workspace }));
    }
    if (url === "/__deep-opm/workspace" && method === "PUT") {
      backend.workspace = body.indice;
      return Promise.resolve(jsonResponse({ indice: backend.workspace }));
    }
    if (url === "/__deep-opm/modelos" && method === "POST") {
      const incoming = body.modelo as ModeloPersistido;
      const actual = backend.modelos.get(incoming.id);
      const guardado = { ...incoming, revision: actual ? (actual.revision ?? 1) + 1 : 1 };
      backend.modelos.set(guardado.id, guardado);
      return Promise.resolve(jsonResponse({ modelo: guardado }));
    }
    if (url.startsWith("/__deep-opm/modelos/") && method === "GET") {
      const id = decodeURIComponent(url.split("/").pop() ?? "");
      const modelo = backend.modelos.get(id);
      return Promise.resolve(modelo ? jsonResponse({ modelo }) : jsonResponse({ error: "Modelo no encontrado" }, 404));
    }
    return Promise.resolve(jsonResponse({ error: "unexpected" }, 404));
  }) as unknown as typeof fetch;
  return backend;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function esperar(condicion: () => boolean): Promise<void> {
  for (let intento = 0; intento < 30; intento += 1) {
    if (condicion()) return;
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}
