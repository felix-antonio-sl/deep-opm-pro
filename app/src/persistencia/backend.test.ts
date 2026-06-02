import { afterEach, describe, expect, test } from "bun:test";
import { cargarModeloLocal } from "./local";
import { listarModelosBackendConCache, persistenciaBackendHabilitada } from "./backend";

describe("persistencia backend cliente", () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, "window");
    Reflect.deleteProperty(globalThis, "localStorage");
  });

  test("lista modelos del backend y los espeja en cache local", async () => {
    instalarLocalStorage();
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    const modelo = {
      id: "backend-1",
      nombre: "Backend 1",
      descripcion: "Servidor",
      creadoEn: "2026-06-02T00:00:00.000Z",
      actualizadoEn: "2026-06-02T00:00:01.000Z",
      carpetaId: null,
      json: JSON.stringify({ formato: "deep-opm-pro.modelo.v0", modelo: { id: "m", nombre: "Backend 1" } }),
    };
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (() => Promise.resolve(new Response(JSON.stringify({ modelos: [modelo] }), {
      status: 200,
      headers: { "content-type": "application/json" },
    }))) as unknown as typeof fetch;
    try {
      expect(persistenciaBackendHabilitada()).toBe(true);
      const listado = await listarModelosBackendConCache();
      expect(listado).toEqual({ ok: true, value: [expect.objectContaining({ id: "backend-1", nombre: "Backend 1" })] });
      const local = cargarModeloLocal("backend-1");
      expect(local.ok).toBe(true);
      if (local.ok) expect(JSON.parse(local.value.json)).toEqual(JSON.parse(modelo.json));
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

function instalarLocalStorage(): void {
  const datos = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      get length() {
        return datos.size;
      },
      key: (index: number) => Array.from(datos.keys())[index] ?? null,
      getItem: (key: string) => datos.get(key) ?? null,
      setItem: (key: string, value: string) => datos.set(key, value),
      removeItem: (key: string) => datos.delete(key),
      clear: () => datos.clear(),
    },
  });
}
