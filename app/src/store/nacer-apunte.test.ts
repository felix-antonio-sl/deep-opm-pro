import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import { forgetObservedBackendSession } from "../persistencia/backend";
import { especieDe } from "../persistencia/especie";
import type { ModeloPersistido } from "../persistencia/modelos";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store";
import { resetWorkspacePersistenceRuntime } from "./runtime";
import { advanceSessionEpoch } from "./sessionEpoch";

let originalFetch: typeof fetch;

/**
 * «Todo nace apunte» (diseño §3). El guardado es ASÍNCRONO: el test mockea el
 * backend y espera un tick (patrón persistencia.test.ts). Verifica que el
 * nacimiento NO es un modelo plano: el modelo confirmado se reconcilia con la
 * especie APUNTE del índice, usando el mismo id para encender la cinta.
 */
describe("nacerApunte (store)", () => {
  let backend: BackendMock;

  beforeEach(() => {
    advanceSessionEpoch();
    resetWorkspacePersistenceRuntime();
    forgetObservedBackendSession();
    backend = instalarBackendMock();
    store.setState({
      modelosGuardados: [],
      modelosRecientes: [],
      revisionBasePorModelo: {},
      revisionRemota: null,
      modeloPersistidoId: null,
      indice: { modelos: [], carpetas: [], recientes: [] },
      workspaceRevision: null,
      requiereLogin: false,
      mensaje: null,
    });
    store.getState().activarReadOnly(false);
    store.getState().importarJson(exportarModelo(crearModelo()));
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    Reflect.deleteProperty(globalThis, "window");
    forgetObservedBackendSession();
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

  test("preserva el primer trazo creado mientras espera la persistencia inicial", async () => {
    const gate = backend.bloquearSiguienteGuardado();
    store.getState().nacerApunte();
    await gate.iniciado;
    const pestanaOrigenId = store.getState().pestanaActivaId;

    store.getState().crearObjetoDemo();
    const jsonVivo = exportarModelo(store.getState().modelo);
    gate.liberar();
    await esperar(() => store.getState().modeloPersistidoId !== null);

    const estado = store.getState();
    const pestanaOrigen = estado.pestanasAbiertas.find((pestana) => pestana.id === pestanaOrigenId);
    expect(exportarModelo(estado.modelo)).toBe(jsonVivo);
    expect(estado.dirty).toBe(true);
    expect(pestanaOrigen?.dirty).toBe(true);
    expect(pestanaOrigen?.snapshotJson).not.toBe(jsonVivo);
    expect(Object.keys(estado.modelo.entidades)).toHaveLength(1);
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

  test("dos nacimientos rápidos conservan el primer apunte aunque su intención quede obsoleta", async () => {
    const primerGuardado = backend.bloquearSiguienteGuardado();
    store.getState().nacerApunte();
    await primerGuardado.iniciado;
    const primerId = store.getState().modelo.id;

    store.getState().nacerApunte();
    const segundoId = store.getState().modelo.id;
    expect(segundoId).not.toBe(primerId);
    await esperar(() => store.getState().modeloPersistidoId === segundoId);

    primerGuardado.liberar();
    await esperar(() => backend.modelos.has(primerId));
    await esperar(() => store.getState().indice.modelos.some((modelo) => modelo.id === primerId));

    expect(especieDe(store.getState().indice.modelos.find((modelo) => modelo.id === primerId)!))
      .toBe("apunte");
    expect(especieDe(backend.workspace.modelos.find((modelo) => modelo.id === primerId)!))
      .toBe("apunte");

    store.getState().listarModelosGuardados();
    await esperar(() => store.getState().mensaje === null);
    const entradaTrasSincronizar = store.getState().indice.modelos.find(
      (modelo) => modelo.id === primerId,
    );
    if (!entradaTrasSincronizar) throw new Error("El primer apunte desapareció al sincronizar");
    expect(especieDe(entradaTrasSincronizar)).toBe("apunte");
  });

  test("graduar apaga la especie apunte y NO se re-infecta al sincronizar", async () => {
    store.getState().nacerApunte();
    await esperar(() => store.getState().modeloPersistidoId !== null);
    const id = store.getState().modeloPersistidoId!;
    expect(store.getState().indice.modelos.some((m) => m.id === id && m.esApunte === true)).toBe(true);

    store.getState().confirmarGraduacion({ modeloId: id, nombre: "Modelo graduado", carpetaId: null });
    // esApunte off en el índice → la cinta desaparece.
    expect(store.getState().indice.modelos.some((m) => m.id === id && m.esApunte === true)).toBe(false);
    expect(store.getState().dialogoGraduarModeloId).toBeNull();

    // El renombrado es async; espera a que asiente y verifica que NO se re-infecta
    // (el record no persiste la especie → sincronizar no re-marca el apunte).
    await esperar(() => store.getState().modelo.nombre === "Modelo graduado");
    store.getState().listarModelosGuardados();
    await esperar(() => store.getState().mensaje === null);
    expect(store.getState().indice.modelos.some((m) => m.id === id && m.esApunte === true)).toBe(false);
  });
});

interface BackendMock {
  modelos: Map<string, ModeloPersistido>;
  workspace: {
    modelos: Array<{ id: string; carpetaId: string | null; esApunte?: boolean }>;
    carpetas: [];
    recientes: string[];
  };
  workspaceRevision: number;
  bloquearSiguienteGuardado(): { iniciado: Promise<void>; liberar(): void };
}

function instalarBackendMock(): BackendMock {
  Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
  originalFetch = globalThis.fetch;
  let siguienteGuardado:
    | { iniciado: ReturnType<typeof diferido>; liberado: ReturnType<typeof diferido> }
    | null = null;
  const backend: BackendMock = {
    modelos: new Map(),
    workspace: { modelos: [], carpetas: [], recientes: [] },
    workspaceRevision: 0,
    bloquearSiguienteGuardado() {
      const iniciado = diferido();
      const liberado = diferido();
      siguienteGuardado = { iniciado, liberado };
      return { iniciado: iniciado.promise, liberar: liberado.resolver };
    },
  };
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? "GET";
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    if (url === "/__deep-opm/session") return Promise.resolve(jsonResponse({ session: { tenantId: "t", userId: "u" } }));
    if (url === "/__deep-opm/modelos?includePayload=1" && method === "GET") return Promise.resolve(jsonResponse({ modelos: [...backend.modelos.values()] }));
    if (url === "/__deep-opm/workspace" && method === "GET") {
      return Promise.resolve(jsonResponse({
        indice: backend.workspace,
        revision: backend.workspaceRevision,
      }));
    }
    if (url === "/__deep-opm/workspace" && method === "PUT") {
      if (body.revisionBase !== backend.workspaceRevision) {
        return Promise.resolve(jsonResponse({
          error: "Workspace desactualizado; recarga antes de guardar",
        }, 409));
      }
      backend.workspace = body.indice;
      backend.workspaceRevision += 1;
      return Promise.resolve(jsonResponse({
        indice: backend.workspace,
        revision: backend.workspaceRevision,
      }));
    }
    if (url === "/__deep-opm/modelos" && method === "POST") {
      const incoming = body.modelo as ModeloPersistido;
      const persistir = () => {
        const actual = backend.modelos.get(incoming.id);
        const guardado = { ...incoming, revision: actual ? (actual.revision ?? 1) + 1 : 1 };
        backend.modelos.set(guardado.id, guardado);
        return jsonResponse({ modelo: guardado });
      };
      const bloqueo = siguienteGuardado;
      siguienteGuardado = null;
      if (bloqueo) {
        bloqueo.iniciado.resolver();
        return bloqueo.liberado.promise.then(persistir);
      }
      return Promise.resolve(persistir());
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

function diferido(): { promise: Promise<void>; resolver(): void } {
  let resolver = () => {};
  const promise = new Promise<void>((resolve) => {
    resolver = resolve;
  });
  return { promise, resolver };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

async function esperar(condicion: () => boolean): Promise<void> {
  for (let intento = 0; intento < 40; intento += 1) {
    if (condicion()) return;
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  throw new Error("La condición esperada no se cumplió");
}
