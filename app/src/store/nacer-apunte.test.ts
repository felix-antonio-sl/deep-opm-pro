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

    store.getState().abrirGraduar(id);
    store.getState().confirmarGraduacion({
      modeloId: id,
      nombre: "Modelo graduado",
      carpetaId: null,
      bloqueos: 0,
      mejoras: 0,
    });

    // Hasta que el backend confirme la transición compuesta, la identidad local
    // sigue siendo Apunte y el diálogo permanece abierto.
    expect(store.getState().indice.modelos.some((m) => m.id === id && m.esApunte === true)).toBe(true);
    expect(store.getState().dialogoGraduarModeloId).toBe(id);

    // El renombrado es async; espera a que asiente y verifica que NO se re-infecta
    // (el record no persiste la especie → sincronizar no re-marca el apunte).
    await esperar(() => store.getState().modelo.nombre === "Modelo graduado");
    expect(store.getState().dialogoGraduarModeloId).toBeNull();
    store.getState().listarModelosGuardados();
    await esperar(() => store.getState().mensaje === null);
    expect(store.getState().indice.modelos.some((m) => m.id === id && m.esApunte === true)).toBe(false);
  });

  test("marcar un Apunte como Biblioteca reutiliza graduación y confirma ambos ejes atómicamente", async () => {
    store.getState().nacerApunte();
    await esperar(() => store.getState().modeloPersistidoId !== null);
    const id = store.getState().modeloPersistidoId!;

    store.getState().toggleBibliotecaModelo(id);
    expect(store.getState().dialogoGraduarModeloId).toBe(id);
    expect(store.getState().graduacionDestino).toBe("biblioteca");

    store.getState().confirmarGraduacion({
      modeloId: id,
      nombre: "Biblioteca graduada",
      carpetaId: null,
      bloqueos: 0,
      mejoras: 0,
    });
    expect(store.getState().indice.modelos.find((modelo) => modelo.id === id)?.esApunte).toBe(true);

    await esperar(() => store.getState().dialogoGraduarModeloId === null);
    const entrada = store.getState().indice.modelos.find((modelo) => modelo.id === id);
    expect(entrada?.esApunte).toBeUndefined();
    expect(entrada?.esBiblioteca).toBe(true);
    expect(store.getState().mensaje).toBe("Ahora es Modelo de Biblioteca · sin pendientes de cierre");
  });

  test("marcar un Apunte inactivo no abre ni reemplaza el modelo de trabajo actual", async () => {
    store.getState().nacerApunte();
    await esperar(() => store.getState().modeloPersistidoId !== null);
    const primerId = store.getState().modeloPersistidoId!;

    store.getState().nacerApunte();
    await esperar(() => store.getState().modeloPersistidoId !== null && store.getState().modeloPersistidoId !== primerId);
    const activoId = store.getState().modeloPersistidoId!;
    const activoNombre = store.getState().modelo.nombre;

    store.getState().toggleBibliotecaModelo(primerId);
    await esperar(() => store.getState().graduacionModeloObjetivo?.id === primerId);
    expect(store.getState().modeloPersistidoId).toBe(activoId);

    store.getState().confirmarGraduacion({
      modeloId: primerId,
      nombre: "Biblioteca sin abrir",
      carpetaId: null,
      bloqueos: 0,
      mejoras: 0,
    });
    await esperar(() => store.getState().dialogoGraduarModeloId === null);

    expect(store.getState().modeloPersistidoId).toBe(activoId);
    expect(store.getState().modelo.nombre).toBe(activoNombre);
    expect(store.getState().indice.modelos.find((modelo) => modelo.id === primerId)?.esBiblioteca).toBe(true);
  });

  test("fallo de persistencia conserva Apunte, nombre, destino y diálogo", async () => {
    store.getState().nacerApunte();
    await esperar(() => store.getState().modeloPersistidoId !== null);
    const id = store.getState().modeloPersistidoId!;
    const nombreOriginal = store.getState().modelo.nombre;
    backend.fallarSiguienteGraduacion("conflicto de prueba");

    store.getState().abrirGraduar(id);
    store.getState().confirmarGraduacion({
      modeloId: id,
      nombre: "Nombre que no debe entrar",
      carpetaId: null,
      bloqueos: 1,
      mejoras: 2,
    });
    await esperar(() => store.getState().graduacionError !== null);

    const estado = store.getState();
    expect(estado.modelo.nombre).toBe(nombreOriginal);
    expect(estado.indice.modelos.find((modelo) => modelo.id === id)?.esApunte).toBe(true);
    expect(estado.dialogoGraduarModeloId).toBe(id);
    expect(estado.graduacionError).toBe(
      "No se pudo graduar · conflicto de prueba · Reintentar",
    );
    expect(backend.modelos.get(id)?.nombre).toBe(nombreOriginal);
  });

  test("nombre vacío no inicia persistencia ni cierra el diálogo", async () => {
    store.getState().nacerApunte();
    await esperar(() => store.getState().modeloPersistidoId !== null);
    const id = store.getState().modeloPersistidoId!;
    store.getState().abrirGraduar(id);

    store.getState().confirmarGraduacion({
      modeloId: id,
      nombre: "   ",
      carpetaId: null,
      bloqueos: 0,
      mejoras: 0,
    });

    expect(store.getState().graduacionEnCurso).toBe(false);
    expect(store.getState().dialogoGraduarModeloId).toBe(id);
    expect(store.getState().graduacionError).toContain("El nombre no puede quedar vacío");
  });
});

interface BackendMock {
  modelos: Map<string, ModeloPersistido>;
  workspace: {
    modelos: Array<{
      id: string;
      carpetaId: string | null;
      esApunte?: boolean;
      versiones?: Array<{
        id: string;
        creadoEn: string;
        nombre: string;
        modeloPayloadKey: string;
        bytes: number;
      }>;
    }>;
    carpetas: [];
    recientes: string[];
  };
  workspaceRevision: number;
  bloquearSiguienteGuardado(): { iniciado: Promise<void>; liberar(): void };
  fallarSiguienteGraduacion(causa: string): void;
}

function instalarBackendMock(): BackendMock {
  Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
  originalFetch = globalThis.fetch;
  let siguienteGuardado:
    | { iniciado: ReturnType<typeof diferido>; liberado: ReturnType<typeof diferido> }
    | null = null;
  let siguienteGraduacionError: string | null = null;
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
    fallarSiguienteGraduacion(causa) {
      siguienteGraduacionError = causa;
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
    if (url.endsWith("/revisiones") && method === "POST") {
      const incoming = body.model as ModeloPersistido;
      const persistir = () => {
        const version = {
          ...body.version,
          modeloPayloadKey: body.version.id,
          bytes: incoming.json.length,
        };
        const actual = backend.modelos.get(incoming.id);
        if (body.base?.kind === "existing") {
          if (siguienteGraduacionError) {
            const error = siguienteGraduacionError;
            siguienteGraduacionError = null;
            return jsonResponse({ error }, 409);
          }
          if (!actual) return jsonResponse({ error: "Modelo no encontrado" }, 409);
          const guardado = {
            ...incoming,
            autosalvado: false,
            revision: (actual.revision ?? 1) + 1,
          };
          backend.modelos.set(guardado.id, guardado);
          backend.workspace = {
            ...backend.workspace,
            modelos: backend.workspace.modelos.map((item) => {
              if (item.id !== guardado.id) return item;
              const { esApunte: _esApunte, ...modelo } = item;
              return {
                ...modelo,
                carpetaId: body.graduation?.folderId ?? null,
                ...(body.graduation?.role === "library" ? { esBiblioteca: true } : {}),
                versiones: [version, ...(item.versiones ?? [])],
              };
            }),
          };
          backend.workspaceRevision += 1;
          return jsonResponse({
            model: guardado,
            version,
            workspace: { indice: backend.workspace, revision: backend.workspaceRevision },
          });
        }
        if (actual) return jsonResponse({ error: "El modelo ya existe" }, 409);
        const guardado = { ...incoming, autosalvado: false, revision: 1 };
        backend.modelos.set(guardado.id, guardado);
        backend.workspace = {
          ...backend.workspace,
          modelos: [
            ...backend.workspace.modelos.filter((item) => item.id !== guardado.id),
            {
              id: guardado.id,
              carpetaId: null,
              ...(body.speciesOnCreate === "apunte"
                ? { esApunte: true }
                : {}),
              versiones: [version],
            },
          ],
          recientes: [
            guardado.id,
            ...backend.workspace.recientes.filter((id) => id !== guardado.id),
          ],
        };
        backend.workspaceRevision += 1;
        return jsonResponse({
          model: guardado,
          version,
          workspace: {
            indice: backend.workspace,
            revision: backend.workspaceRevision,
          },
        });
      };
      const bloqueo = siguienteGuardado;
      siguienteGuardado = null;
      if (bloqueo) {
        bloqueo.iniciado.resolver();
        return bloqueo.liberado.promise.then(persistir);
      }
      return Promise.resolve(persistir());
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
