import { afterEach, describe, expect, test } from "bun:test";
import {
  cargarWorkspaceBackend,
  guardarAutosalvadoBackend,
  guardarModeloBackend,
  guardarVersionBackend,
  guardarWorkspaceBackend,
  listarModelosBackend,
  obtenerSesionBackend,
  persistenciaBackendHabilitada,
} from "./backend";

describe("persistencia backend cliente", () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, "window");
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
    const calls: Array<{ url: string; method: string }> = [];
    globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? "GET";
      calls.push({ url, method });
      if (url === "/__deep-opm/session") {
        return Promise.resolve(jsonResponse({ session: { tenantId: "tenant", userId: "user" } }));
      }
      if (url === "/__deep-opm/workspace" && method === "GET") {
        return Promise.resolve(jsonResponse({ indice }));
      }
      if (url === "/__deep-opm/workspace" && method === "PUT") {
        return Promise.resolve(jsonResponse({ indice: JSON.parse(String(init?.body)).indice }));
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
      expect(await cargarWorkspaceBackend()).toEqual({ ok: true, value: indice });
      expect(await guardarWorkspaceBackend(indice)).toEqual({ ok: true, value: indice });
      const json = JSON.stringify({ formato: "deep-opm-pro.modelo.v0", modelo: { id: "m1" } });
      expect(await guardarVersionBackend("m1", version, json)).toEqual({ ok: true, value: { modeloId: "m1", version, json } });
      expect(await guardarAutosalvadoBackend("m1", json, "2026-06-03T00:00:01.000Z")).toEqual({
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
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
