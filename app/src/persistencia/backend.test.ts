import { afterEach, describe, expect, test } from "bun:test";
import {
  cargarWorkspaceBackend,
  cerrarSesionBackend,
  forgetObservedBackendSession,
  guardarAutosalvadoBackend,
  iniciarSesionBackend,
  onBackendUnauthorized,
  obtenerEstadoSesionBackend,
  guardarModeloBackend,
  guardarVersionBackend,
  guardarWorkspaceBackend,
  listarModelosBackend,
  obtenerSesionBackend,
  persistenciaBackendHabilitada,
} from "./backend";
import {
  encodeSessionIdentity,
  SESSION_IDENTITY_HEADER,
} from "./sessionIdentity";

describe("persistencia backend cliente", () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, "window");
    forgetObservedBackendSession();
  });

  test("lista modelos del backend sin requerir storage navegador", async () => {
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    const modelo = {
      id: "backend-1",
      nombre: "Backend 1",
      descripcion: "Servidor",
      creadoEn: "2026-06-02T00:00:00.000Z",
      actualizadoEn: "2026-06-02T00:00:01.000Z",
      carpetaId: null,
      revision: 7,
      json: JSON.stringify({ formato: "deep-opm-pro.modelo.v0", modelo: { id: "m", nombre: "Backend 1" } }),
    };
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (() => Promise.resolve(new Response(JSON.stringify({ modelos: [modelo] }), {
      status: 200,
      headers: { "content-type": "application/json" },
    }))) as unknown as typeof fetch;
    try {
      expect(persistenciaBackendHabilitada()).toBe(true);
      const listado = await listarModelosBackend();
      expect(listado).toEqual({ ok: true, value: [expect.objectContaining({ id: "backend-1", nombre: "Backend 1", revision: 7 })] });
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("guardar modelo backend no requiere storage navegador", async () => {
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    const modelo = {
      id: "backend-storage-falla",
      nombre: "Backend sin storage local",
      descripcion: "",
      creadoEn: "2026-06-06T00:00:00.000Z",
      actualizadoEn: "2026-06-06T00:00:01.000Z",
      carpetaId: null,
      json: JSON.stringify({ formato: "deep-opm-pro.modelo.v0", modelo: { id: "m", nombre: "Backend sin storage local" } }),
    };
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (() => Promise.resolve(jsonResponse({ modelo }))) as unknown as typeof fetch;
    try {
      const resultado = await guardarModeloBackend(modelo);
      expect(resultado).toEqual({ ok: true, value: modelo });
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("opera sesion, workspace, versiones y autosave contra endpoints backend", async () => {
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    const indice = {
      modelos: [{ id: "m1", carpetaId: "c1" }],
      carpetas: [{ id: "c1", nombre: "Carpeta", padreId: null, creadoEn: 1 }],
      recientes: ["m1"],
    };
    const version = {
      id: "v1",
      creadoEn: "2026-06-03T00:00:00.000Z",
      nombre: "Snapshot",
      modeloPayloadKey: "m1:v1",
      bytes: 100,
    };
    const originalFetch = globalThis.fetch;
    const calls: Array<{ url: string; method: string; sessionIdentity: string | null }> = [];
    globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? "GET";
      calls.push({
        url,
        method,
        sessionIdentity: new Headers(init?.headers).get(SESSION_IDENTITY_HEADER),
      });
      if (url === "/__deep-opm/session") {
        return Promise.resolve(jsonResponse({ session: { tenantId: "tenant", userId: "user" } }));
      }
      if (url === "/__deep-opm/workspace" && method === "GET") {
        return Promise.resolve(jsonResponse({ indice, revision: 4 }));
      }
      if (url === "/__deep-opm/workspace" && method === "PUT") {
        const body = JSON.parse(String(init?.body));
        expect(body.revisionBase).toBe(4);
        return Promise.resolve(jsonResponse({ indice: body.indice, revision: 5 }));
      }
      if (url === "/__deep-opm/modelos/m1/versiones" && method === "POST") {
        const body = JSON.parse(String(init?.body));
        return Promise.resolve(jsonResponse({ modeloId: "m1", version: body.version, json: body.json }));
      }
      if (url === "/__deep-opm/modelos/m1/autosave" && method === "PUT") {
        const body = JSON.parse(String(init?.body));
        return Promise.resolve(jsonResponse({ modeloId: "m1", creadoEn: body.creadoEn, json: body.json }));
      }
      return Promise.resolve(jsonResponse({ error: "unexpected" }, 404));
    }) as unknown as typeof fetch;
    try {
      expect(await obtenerSesionBackend()).toEqual({ ok: true, value: { tenantId: "tenant", userId: "user" } });
      expect(await cargarWorkspaceBackend()).toEqual({
        ok: true,
        value: { indice, revision: 4 },
      });
      expect(await guardarWorkspaceBackend(indice, 4)).toEqual({
        ok: true,
        value: { indice, revision: 5 },
      });
      const json = JSON.stringify({ formato: "deep-opm-pro.modelo.v0", modelo: { id: "m1" } });
      expect(await guardarVersionBackend("m1", version, json)).toEqual({ ok: true, value: { modeloId: "m1", version, json } });
      expect(await guardarAutosalvadoBackend("m1", json, 7, "2026-06-03T00:00:01.000Z")).toEqual({
        ok: true,
        value: { modeloId: "m1", creadoEn: "2026-06-03T00:00:01.000Z", json },
      });
      expect(calls.map((call) => `${call.method} ${call.url}`)).toEqual([
        "GET /__deep-opm/session",
        "GET /__deep-opm/workspace",
        "PUT /__deep-opm/workspace",
        "POST /__deep-opm/modelos/m1/versiones",
        "PUT /__deep-opm/modelos/m1/autosave",
      ]);
      expect(calls[0]?.sessionIdentity).toBeNull();
      expect(calls.slice(1).map((call) => call.sessionIdentity)).toEqual(
        Array(4).fill(encodeSessionIdentity({ tenantId: "tenant", userId: "user" })),
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("coalesce el bootstrap concurrente de sesión sin reutilizar respuestas resueltas", async () => {
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    const originalFetch = globalThis.fetch;
    let fetchCalls = 0;
    globalThis.fetch = (() => {
      fetchCalls += 1;
      return Promise.resolve(jsonResponse({
        session: { tenantId: "tenant-bootstrap", userId: "user-bootstrap" },
      }));
    }) as unknown as typeof fetch;
    try {
      const [estado, sesion] = await Promise.all([
        obtenerEstadoSesionBackend(),
        obtenerSesionBackend(),
      ]);

      expect(fetchCalls).toBe(1);
      expect(estado).toEqual({
        estado: "autenticada",
        session: { tenantId: "tenant-bootstrap", userId: "user-bootstrap" },
      });
      expect(sesion).toEqual({
        ok: true,
        value: { tenantId: "tenant-bootstrap", userId: "user-bootstrap" },
      });

      await obtenerEstadoSesionBackend();
      expect(fetchCalls).toBe(2);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("no coalesce una sesión pendiente a través de un login nuevo", async () => {
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    const originalFetch = globalThis.fetch;
    const oldSession = deferredResponse();
    let sessionCalls = 0;
    globalThis.fetch = ((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith("/auth/login")) {
        return Promise.resolve(jsonResponse({
          session: { tenantId: "tenant-b", userId: "user-b" },
        }));
      }
      if (url.endsWith("/session")) {
        sessionCalls += 1;
        if (sessionCalls === 1) {
          return Promise.resolve(jsonResponse({
            session: { tenantId: "tenant-a", userId: "user-a" },
          }));
        }
        if (sessionCalls === 2) return oldSession.promise;
        return Promise.resolve(jsonResponse({
          session: { tenantId: "tenant-b", userId: "user-b" },
        }));
      }
      return Promise.resolve(jsonResponse({ error: "unexpected" }, 404));
    }) as unknown as typeof fetch;
    try {
      expect((await obtenerEstadoSesionBackend()).estado).toBe("autenticada");
      const staleRequest = obtenerEstadoSesionBackend();
      expect(await iniciarSesionBackend("b@example.com", "secreto")).toEqual({
        ok: true,
        value: { tenantId: "tenant-b", userId: "user-b" },
      });
      expect(await obtenerEstadoSesionBackend()).toEqual({
        estado: "autenticada",
        session: { tenantId: "tenant-b", userId: "user-b" },
      });
      oldSession.resolve(jsonResponse({
        session: { tenantId: "tenant-a", userId: "user-a" },
      }));
      expect(await staleRequest).toEqual({ estado: "requiere-login" });
      expect(sessionCalls).toBe(3);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("un 401 en cualquier operación invalida la sesión observada y notifica", async () => {
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    const originalFetch = globalThis.fetch;
    let unauthorizedCount = 0;
    const unsubscribe = onBackendUnauthorized(() => {
      unauthorizedCount += 1;
    });
    globalThis.fetch = (() => Promise.resolve(jsonResponse({ error: "No autenticado" }, 401))) as unknown as typeof fetch;
    try {
      expect(await listarModelosBackend()).toEqual({ ok: false, error: "No autenticado" });
      expect(unauthorizedCount).toBe(1);
    } finally {
      unsubscribe();
      globalThis.fetch = originalFetch;
    }
  });

  test("una sesión distinta a la ya observada se trata como transición no autorizada", async () => {
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    const originalFetch = globalThis.fetch;
    let tenant = "tenant-a";
    let unauthorizedCount = 0;
    const unsubscribe = onBackendUnauthorized(() => {
      unauthorizedCount += 1;
    });
    globalThis.fetch = (() => Promise.resolve(jsonResponse({
      session: { tenantId: tenant, userId: `user-${tenant}` },
    }))) as unknown as typeof fetch;
    try {
      expect((await obtenerEstadoSesionBackend()).estado).toBe("autenticada");
      tenant = "tenant-b";
      expect(await obtenerEstadoSesionBackend()).toEqual({ estado: "requiere-login" });
      expect(unauthorizedCount).toBe(1);
    } finally {
      unsubscribe();
      globalThis.fetch = originalFetch;
    }
  });
});

// Auth v1 (spec §4): el cliente distingue 401 (login obligatorio) de backend caído.
describe("auth v1 — cliente de sesión", () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, "window");
    forgetObservedBackendSession();
  });

  async function conFetch<T>(status: number, body: unknown, fn: () => Promise<T>): Promise<T> {
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (() => Promise.resolve(jsonResponse(body, status))) as unknown as typeof fetch;
    try {
      return await fn();
    } finally {
      globalThis.fetch = originalFetch;
    }
  }

  test("obtenerEstadoSesionBackend: 200 ⇒ autenticada", async () => {
    const estado = await conFetch(200, { session: { tenantId: "t", userId: "u", auth: true } }, obtenerEstadoSesionBackend);
    expect(estado).toEqual({ estado: "autenticada", session: { tenantId: "t", userId: "u" } });
  });

  test("obtenerEstadoSesionBackend: 401 ⇒ requiere-login", async () => {
    const estado = await conFetch(401, { error: "No autenticado" }, obtenerEstadoSesionBackend);
    expect(estado).toEqual({ estado: "requiere-login" });
  });

  test("iniciarSesionBackend: 401 ⇒ error con mensaje del backend", async () => {
    const resultado = await conFetch(401, { error: "Credenciales inválidas" }, () => iniciarSesionBackend("a@b.c", "x"));
    expect(resultado).toEqual({ ok: false, error: "Credenciales inválidas" });
  });

  test("iniciarSesionBackend: 200 ⇒ sesión", async () => {
    const resultado = await conFetch(200, { session: { tenantId: "t", userId: "u", auth: true } }, () => iniciarSesionBackend("a@b.c", "x"));
    expect(resultado).toEqual({ ok: true, value: { tenantId: "t", userId: "u" } });
  });

  test("cerrarSesionBackend: 200 ⇒ ok", async () => {
    const resultado = await conFetch(200, { ok: true }, cerrarSesionBackend);
    expect(resultado).toEqual({ ok: true, value: undefined });
  });
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function deferredResponse(): {
  promise: Promise<Response>;
  resolve(response: Response): void;
} {
  let resolve = (_response: Response) => {};
  const promise = new Promise<Response>((resolver) => {
    resolve = resolver;
  });
  return { promise, resolve };
}
