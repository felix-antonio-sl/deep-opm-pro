import { afterEach, describe, expect, test } from "bun:test";
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
    store.setState({ requiereLogin: false, mensaje: null });
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
      "/workspace": { status: 200, body: { indice: { modelos: [], carpetas: [], recientes: [] } } },
    });
    store.setState({ requiereLogin: true });
    await store.getState().iniciarSesion("a@b.c", "buena");
    expect(store.getState().requiereLogin).toBe(false);
  });

  test("cerrarSesion vuelve a requiereLogin", async () => {
    mockFetch({ "/auth/logout": { status: 200, body: { ok: true } } });
    await store.getState().cerrarSesion();
    expect(store.getState().requiereLogin).toBe(true);
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
});
