import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import { especieDe } from "../persistencia/especie";
import type { ModeloPersistido } from "../persistencia/modelos";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store";

let originalFetch: typeof fetch;

/**
 * «Todo nace apunte» (diseño §3). El guardado es ASÍNCRONO: el test mockea el
 * backend y espera un tick (patrón persistencia.test.ts). Verifica que el
 * nacimiento NO es un modelo plano: nace APUNTE en un solo guardado, con el id
 * reconciliado para que la especie se derive del índice (la cinta enciende).
 */
describe("nacerApunte (store)", () => {
  let backend: BackendMock;

  beforeEach(() => {
    backend = instalarBackendMock();
    store.getState().activarReadOnly(false);
    store.getState().importarJson(exportarModelo(crearModelo()));
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    Reflect.deleteProperty(globalThis, "window");
  });

  test("nace un apunte persistido con auto-nombre y especie apunte", async () => {
    store.getState().nacerApunte();
    await esperar(() => store.getState().modeloPersistidoId !== null);

    const s = store.getState();
    expect(s.modelo.nombre.startsWith("Apunte ")).toBe(true);
    expect(s.modeloPersistidoId).not.toBeNull();
    const entrada = s.indice.modelos.find((m) => m.id === s.modeloPersistidoId);
    expect(entrada).toBeDefined();
    expect(especieDe(entrada!)).toBe("apunte");
  });

  test("reconcilia modelo.id con el id persistido → la cinta «Apunte» enciende", async () => {
    store.getState().nacerApunte();
    await esperar(() => store.getState().modeloPersistidoId !== null);

    const s = store.getState();
    // Invariante de la Fix A: el id del dominio == id del record == entrada del índice.
    expect(s.modeloPersistidoId).not.toBeNull();
    expect(s.modelo.id).toBe(s.modeloPersistidoId!);
    // Derivación exacta de CintaApunte / PanelDiagnostico.
    expect(s.indice.modelos.some((m) => m.id === s.modelo.id && m.esApunte === true)).toBe(true);
  });

  test("dos nacimientos el mismo día no colisionan de nombre (gestor exige unicidad)", async () => {
    // NOTA: el store es un singleton global (modelosGuardados se acumula entre
    // tests); por eso el aserto se ancla a los DOS ids creados AQUÍ, no al total.
    store.getState().nacerApunte();
    await esperar(() => store.getState().modeloPersistidoId !== null);
    const primero = store.getState().modeloPersistidoId!;

    store.getState().nacerApunte();
    await esperar(() => store.getState().modeloPersistidoId !== null && store.getState().modeloPersistidoId !== primero);
    const segundo = store.getState().modeloPersistidoId!;

    const guardados = store.getState().modelosGuardados;
    const n1 = guardados.find((m) => m.id === primero)?.nombre;
    const n2 = guardados.find((m) => m.id === segundo)?.nombre;
    expect(n1).toBeDefined();
    expect(n2).toBeDefined();
    expect(n1).not.toBe(n2); // sin colisión de nombre pese a la misma fecha
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
    if (url === "/__deep-opm/session") return Promise.resolve(jsonResponse({ session: { tenantId: "t", userId: "u" } }));
    if (url === "/__deep-opm/modelos?includePayload=1" && method === "GET") return Promise.resolve(jsonResponse({ modelos: [...backend.modelos.values()] }));
    if (url === "/__deep-opm/workspace" && method === "GET") return Promise.resolve(jsonResponse({ indice: backend.workspace }));
    if (url === "/__deep-opm/workspace" && method === "PUT") { backend.workspace = body.indice; return Promise.resolve(jsonResponse({ indice: backend.workspace })); }
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
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

async function esperar(condicion: () => boolean): Promise<void> {
  for (let intento = 0; intento < 40; intento += 1) {
    if (condicion()) return;
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}
