import { afterEach, describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import {
  forgetObservedBackendSession,
  guardarWorkspaceBackend,
} from "../persistencia/backend";
import { exportarModelo } from "../serializacion/json";
import { indiceVacio } from "../persistencia/workspace";
import { store } from "../store";

// Auth v1 (spec §4): requiereLogin + acciones iniciarSesion/cerrarSesion.
// El cliente HTTP se mockea (patrón backend.test.ts); el handler real se
// defiende en modelPersistenceAuth.test.ts y el flujo UI en e2e/auth.spec.ts.

const originalFetch = globalThis.fetch;

function mockFetch(rutas: Record<string, { status: number; body: unknown }>): void {
  Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    const match = Object.entries(rutas).find(([ruta]) => url.includes(ruta));
    const { status, body } = match?.[1] ?? { status: 404, body: { error: "no mock" } };
    return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
}

describe("store auth v1", () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, "window");
    globalThis.fetch = originalFetch;
    forgetObservedBackendSession();
    store.setState({
      requiereLogin: false,
      mensaje: null,
      workspaceRevision: null,
    });
  });

  test("iniciarSesion con credenciales malas deja requiereLogin y mensaje", async () => {
    mockFetch({ "/auth/login": { status: 401, body: { error: "Credenciales inválidas" } } });
    store.setState({ requiereLogin: true });
    await store.getState().iniciarSesion("a@b.c", "mala");
    expect(store.getState().requiereLogin).toBe(true);
    expect(store.getState().mensaje).toContain("Credenciales");
  });

  test("iniciarSesion correcta limpia requiereLogin", async () => {
    mockFetch({
      "/auth/login": { status: 200, body: { session: { tenantId: "t", userId: "u", auth: true } } },
      "/session": { status: 200, body: { session: { tenantId: "t", userId: "u", auth: true } } },
      "/modelos": { status: 200, body: { modelos: [] } },
      "/workspace": {
        status: 200,
        body: {
          indice: { modelos: [], carpetas: [], recientes: [] },
          revision: 0,
        },
      },
    });
    store.setState({ requiereLogin: true });
    await store.getState().iniciarSesion("a@b.c", "buena");
    expect(store.getState().requiereLogin).toBe(false);
  });

  test("cerrarSesion vuelve a requiereLogin", async () => {
    mockFetch({ "/auth/logout": { status: 200, body: { ok: true } } });
    store.getState().crearObjetoDemo();
    store.setState({
      modeloPersistidoId: "modelo-tenant-anterior",
      revisionBasePorModelo: { "modelo-tenant-anterior": 7 },
      indice: {
        modelos: [{ id: "modelo-tenant-anterior", carpetaId: null }],
        carpetas: [],
        recientes: ["modelo-tenant-anterior"],
      },
      busquedaOpl: "secreto clínico",
      busquedaCosasQuery: "paciente secreto",
      hoverOplRef: { tipo: "entidad", id: "entidad-secreta" },
      modalUrlsAbierto: "entidad-secreta",
      nuevaCosaPendiente: {
        entidadId: "entidad-secreta",
        aparienciaId: "apariencia-secreta",
        nombre: "Paciente secreto",
      },
      portapapelesVisual: {
        apariencias: [],
        enlaces: [],
        origenOpdId: "opd-secreto",
      },
      portapapelesWorkspace: {
        tipo: "modelo",
        itemId: "modelo-tenant-anterior",
        origenCarpetaId: null,
        cortadoEn: "2026-07-18T00:00:00.000Z",
      },
      busquedaGlobal: {
        query: "secreto",
        resultados: [{
          modeloId: "modelo-tenant-anterior",
          nombre: "Modelo secreto",
          carpetaId: null,
          rutaCarpetas: "",
          match: { campo: "nombre", resaltado: "Modelo secreto" },
        }],
        enProgreso: false,
      },
    });
    await store.getState().cerrarSesion();

    expect(store.getState().requiereLogin).toBe(true);
    expect(store.getState().modeloPersistidoId).toBeNull();
    expect(store.getState().revisionBasePorModelo).toEqual({});
    expect(store.getState().indice.modelos).toEqual([]);
    expect(Object.keys(store.getState().modelo.entidades)).toEqual([]);
    expect(store.getState().pestanasAbiertas).toHaveLength(1);
    expect(store.getState().autosalvado.activo).toBe(false);
    expect(store.getState().busquedaOpl).toBe("");
    expect(store.getState().busquedaCosasQuery).toBe("");
    expect(store.getState().busquedaGlobal).toEqual({ query: "", resultados: [], enProgreso: false });
    expect(store.getState().hoverOplRef).toBeNull();
    expect(store.getState().modalUrlsAbierto).toBeNull();
    expect(store.getState().nuevaCosaPendiente).toBeNull();
    expect(store.getState().portapapelesVisual).toBeNull();
    expect(store.getState().portapapelesWorkspace).toBeNull();
  });

  test("cerrarSesion purga datos locales antes de que responda el backend", async () => {
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    const logout = respuestaDiferida();
    globalThis.fetch = ((input: RequestInfo | URL) => {
      if (String(input).includes("/auth/logout")) return logout.promise;
      return Promise.resolve(jsonResponse({ error: "unexpected" }, 404));
    }) as typeof fetch;
    store.getState().importarJson(exportarModelo(crearModelo("Secreto tenant A")));

    const cierre = store.getState().cerrarSesion();

    expect(store.getState().requiereLogin).toBe(true);
    expect(store.getState().modelo.nombre).toBe("Modelo");
    expect(store.getState().pestanasAbiertas).toHaveLength(1);

    logout.resolve(jsonResponse({ ok: true }));
    await cierre;
  });

  test("cerrarSesion informa si el servidor no confirma el cierre remoto", async () => {
    mockFetch({
      "/auth/logout": { status: 503, body: { error: "Servicio no disponible" } },
    });
    store.getState().importarJson(exportarModelo(crearModelo("Secreto local")));

    await store.getState().cerrarSesion();

    expect(store.getState().requiereLogin).toBe(true);
    expect(store.getState().modelo.nombre).toBe("Modelo");
    expect(store.getState().mensaje).toBe(
      "Sesión local cerrada; el servidor no confirmó el cierre: No se pudo cerrar la sesión",
    );
  });

  test("login espera el logout remoto pendiente para no perder su cookie", async () => {
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    const logout = respuestaDiferida();
    let loginCalls = 0;
    globalThis.fetch = ((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/auth/logout")) return logout.promise;
      if (url.includes("/auth/login")) {
        loginCalls += 1;
        return Promise.resolve(jsonResponse({
          session: { tenantId: "tenant-b", userId: "user-b", auth: true },
        }));
      }
      if (url.endsWith("/session")) {
        return Promise.resolve(jsonResponse({
          session: { tenantId: "tenant-b", userId: "user-b", auth: true },
        }));
      }
      if (url.includes("/modelos?includePayload=1")) return Promise.resolve(jsonResponse({ modelos: [] }));
      if (url.endsWith("/workspace")) {
        return Promise.resolve(jsonResponse({
          indice: { modelos: [], carpetas: [], recientes: [] },
          revision: 0,
        }));
      }
      return Promise.resolve(jsonResponse({ error: "unexpected" }, 404));
    }) as typeof fetch;

    const cierre = store.getState().cerrarSesion();
    const login = store.getState().iniciarSesion("b@example.com", "secreto");
    await Promise.resolve();
    expect(loginCalls).toBe(0);

    logout.resolve(jsonResponse({ ok: true }));
    await cierre;
    await login;

    expect(loginCalls).toBe(1);
    expect(store.getState().requiereLogin).toBe(false);
  });

  test("una carga de la sesion anterior no revive pestañas despues de logout y login", async () => {
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    const cargaVieja = respuestaDiferida();
    const modeloViejo = crearModelo("Secreto tenant A");
    globalThis.fetch = ((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith("/modelos/modelo-a")) return cargaVieja.promise;
      if (url.includes("/auth/logout")) return Promise.resolve(jsonResponse({ ok: true }));
      if (url.includes("/auth/login")) {
        return Promise.resolve(jsonResponse({
          session: { tenantId: "tenant-b", userId: "user-b", auth: true },
        }));
      }
      if (url.endsWith("/session")) {
        return Promise.resolve(jsonResponse({
          session: { tenantId: "tenant-b", userId: "user-b", auth: true },
        }));
      }
      if (url.includes("/modelos?includePayload=1")) return Promise.resolve(jsonResponse({ modelos: [] }));
      if (url.endsWith("/workspace")) {
        return Promise.resolve(jsonResponse({
          indice: { modelos: [], carpetas: [], recientes: [] },
          revision: 0,
        }));
      }
      return Promise.resolve(jsonResponse({ error: "unexpected" }, 404));
    }) as typeof fetch;

    store.getState().abrirPestanaConModelo("modelo-a");
    await store.getState().cerrarSesion();
    await store.getState().iniciarSesion("b@example.com", "secreto");
    cargaVieja.resolve(jsonResponse({
      modelo: {
        id: "modelo-a",
        nombre: modeloViejo.nombre,
        descripcion: "",
        creadoEn: "2026-07-18T00:00:00.000Z",
        actualizadoEn: "2026-07-18T00:00:00.000Z",
        revision: 1,
        json: exportarModelo(modeloViejo),
      },
    }));
    await Promise.resolve();
    await Promise.resolve();

    expect(store.getState().requiereLogin).toBe(false);
    expect(store.getState().pestanasAbiertas).toHaveLength(1);
    expect(store.getState().modelo.nombre).toBe("Modelo");
  });

  test("verificarSesion al montar: 401 activa requiereLogin", async () => {
    mockFetch({ "/session": { status: 401, body: { error: "No autenticado" } } });
    await store.getState().verificarSesion();
    expect(store.getState().requiereLogin).toBe(true);
  });

  test("verificarSesion al montar: 200 no activa el gate", async () => {
    mockFetch({ "/session": { status: 200, body: { session: { tenantId: "t", userId: "u" } } } });
    await store.getState().verificarSesion();
    expect(store.getState().requiereLogin).toBe(false);
  });

  test("verificarSesion con backend caído no bloquea (no es un 401)", async () => {
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    globalThis.fetch = (async () => { throw new Error("network down"); }) as unknown as typeof fetch;
    await store.getState().verificarSesion();
    expect(store.getState().requiereLogin).toBe(false);
  });

  test("un 401 de cualquier operación backend purga la sesión local", async () => {
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith("/session")) {
        return Promise.resolve(jsonResponse({
          session: { tenantId: "tenant-a", userId: "user-a", auth: true },
        }));
      }
      if (url.endsWith("/workspace") && init?.method === "PUT") {
        return Promise.resolve(jsonResponse({ error: "No autenticado" }, 401));
      }
      return Promise.resolve(jsonResponse({ error: "unexpected" }, 404));
    }) as typeof fetch;
    await store.getState().verificarSesion();
    store.getState().importarJson(exportarModelo(crearModelo("Secreto tenant A")));

    const resultado = await guardarWorkspaceBackend(indiceVacio(), 0);

    expect(resultado).toEqual({ ok: false, error: "No autenticado" });
    expect(store.getState().requiereLogin).toBe(true);
    expect(store.getState().modelo.nombre).toBe("Modelo");
    expect(store.getState().modelosGuardados).toEqual([]);
  });
});

function respuestaDiferida(): {
  promise: Promise<Response>;
  resolve(response: Response): void;
} {
  let resolver = (_response: Response) => {};
  const promise = new Promise<Response>((resolve) => {
    resolver = resolve;
  });
  return { promise, resolve: resolver };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
