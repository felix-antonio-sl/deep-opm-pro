import { beforeEach, describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import { guardarModeloLocal } from "../persistencia/local";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store";

describe("slice persistencia", () => {
  beforeEach(() => {
    instalarLocalStorage();
    store.getState().activarReadOnly(false);
    store.getState().importarJson(exportarModelo(crearModelo()));
  });

  test("listarModelosGuardados conserva el contrato de arreglo publico", () => {
    store.getState().listarModelosGuardados();
    expect(Array.isArray(store.getState().modelosGuardados)).toBe(true);
  });

  test("guardarLocal en read-only redirige a Guardar Como y deja copia editable", () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Modelo publicado" });
    const idPublicado = store.getState().modeloPersistidoId;
    expect(idPublicado).toBeTruthy();

    store.getState().activarReadOnly(true);
    store.getState().guardarLocal();

    expect(store.getState().readOnly).toBe(false);
    expect(store.getState().modeloPersistidoId).not.toBe(idPublicado);
    expect(store.getState().modelo.nombre).toBe("Modelo publicado copia");
    expect(store.getState().mensaje).toBe("Modelo en solo lectura — guardando como copia nueva");
    expect(store.getState().modelosGuardados.map((modelo) => modelo.nombre).sort()).toEqual([
      "Modelo publicado",
      "Modelo publicado copia",
    ]);
  });

  test("BUG-20260602T014326Z-6ce450: Guardar como permite actualizar el modelo actual con su mismo nombre", () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "HODOM completo v14", descripcion: "Base" });
    const idPersistido = store.getState().modeloPersistidoId;
    expect(idPersistido).toBeTruthy();

    store.getState().crearProcesoDemo();
    expect(store.getState().dirty).toBe(true);
    store.getState().abrirGuardarComo();
    store.getState().guardarComoLocalConDescripcion({
      nombre: "HODOM completo v14",
      descripcion: "Actualizado desde Guardar como",
    });

    expect(store.getState().dialogoGuardarComoAbierto).toBe(false);
    expect(store.getState().modeloPersistidoId).toBe(idPersistido);
    expect(store.getState().dirty).toBe(false);
    expect(store.getState().descripcionModeloLocal).toBe("Actualizado desde Guardar como");
    expect(store.getState().modelosGuardados.filter((modelo) => modelo.nombre === "HODOM completo v14")).toHaveLength(1);
  });

  test("permite guardar modelos importados con version semantica en el nombre", () => {
    store.getState().importarJson(exportarModelo(crearModelo("HODOM completo v1.4")));

    store.getState().guardarComoLocalConDescripcion({
      nombre: "HODOM completo v1.4",
      descripcion: "Importado",
    });

    expect(store.getState().mensaje).toBe("Modelo guardado exitosamente");
    expect(store.getState().modeloPersistidoId).toBeTruthy();
    expect(store.getState().modelosGuardados).toContainEqual(expect.objectContaining({
      nombre: "HODOM completo v1.4",
      descripcion: "Importado",
    }));
  });

  test("guardar como usa backend sin depender de localStorage cuando localStorage falla", async () => {
    instalarLocalStorage({ rechazarEscrituras: true });
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    const originalFetch = globalThis.fetch;
    const llamadas: Array<{ url: string; method: string; body?: unknown }> = [];
    globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? "GET";
      const body = init?.body ? JSON.parse(String(init.body)) : undefined;
      llamadas.push({ url, method, body });
      if (url === "/__deep-opm/modelos" && method === "POST") {
        return Promise.resolve(jsonResponse({ modelo: body?.modelo }));
      }
      if (url === "/__deep-opm/workspace" && method === "PUT") {
        return Promise.resolve(jsonResponse({ indice: body?.indice }));
      }
      return Promise.resolve(jsonResponse({ error: "unexpected" }, 404));
    }) as unknown as typeof fetch;
    try {
      store.getState().guardarComoLocalConDescripcion({
        nombre: "Modelo backend primero",
        descripcion: "No cabe en localStorage",
      });
      await esperar(() => store.getState().mensaje !== "Guardando modelo en servidor...");

      expect(llamadas.map((llamada) => `${llamada.method} ${llamada.url}`)).toContain("POST /__deep-opm/modelos");
      expect(store.getState().mensaje).toBe("Modelo guardado exitosamente");
      expect(store.getState().modeloPersistidoId).toBeTruthy();
      expect(store.getState().modelosGuardados).toContainEqual(expect.objectContaining({
        nombre: "Modelo backend primero",
        descripcion: "No cabe en localStorage",
      }));
    } finally {
      globalThis.fetch = originalFetch;
      Reflect.deleteProperty(globalThis, "window");
    }
  });

  test("cargar modelo con backend ignora una copia local obsoleta", async () => {
    const modeloLocal = crearModelo("Copia local vieja");
    const modeloServidor = crearModelo("Copia backend vigente");
    guardarModeloLocal({
      id: "modelo-stale",
      nombre: "Copia local vieja",
      descripcion: "stale",
      json: exportarModelo(modeloLocal),
    });
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    const originalFetch = globalThis.fetch;
    globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? "GET";
      if (url === "/__deep-opm/modelos/modelo-stale" && method === "GET") {
        return Promise.resolve(jsonResponse({
          modelo: {
            id: "modelo-stale",
            nombre: "Copia backend vigente",
            descripcion: "server",
            creadoEn: "2026-06-06T00:00:00.000Z",
            actualizadoEn: "2026-06-06T00:00:01.000Z",
            carpetaId: null,
            json: exportarModelo(modeloServidor),
          },
        }));
      }
      if (url === "/__deep-opm/modelos" && method === "POST") {
        return Promise.resolve(jsonResponse({ modelo: JSON.parse(String(init?.body)).modelo }));
      }
      if (url === "/__deep-opm/workspace" && method === "PUT") {
        return Promise.resolve(jsonResponse({ indice: JSON.parse(String(init?.body)).indice }));
      }
      return Promise.resolve(jsonResponse({ error: "unexpected" }, 404));
    }) as unknown as typeof fetch;
    try {
      store.setState({ modelosGuardados: [{
        id: "modelo-stale",
        nombre: "Copia backend vigente",
        descripcion: "server",
        creadoEn: "2026-06-06T00:00:00.000Z",
        actualizadoEn: "2026-06-06T00:00:01.000Z",
      }] });
      store.getState().cargarLocal("modelo-stale");
      await esperar(() => store.getState().mensaje === "Modelo cargado: Copia backend vigente");

      expect(store.getState().modelo.nombre).toBe("Copia backend vigente");
      expect(store.getState().descripcionModeloLocal).toBe("server");
    } finally {
      globalThis.fetch = originalFetch;
      Reflect.deleteProperty(globalThis, "window");
    }
  });
});

function instalarLocalStorage(opts: { rechazarEscrituras?: boolean } = {}): void {
  const datos = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => datos.get(key) ?? null,
      setItem: (key: string, value: string) => {
        if (opts.rechazarEscrituras) throw new Error("quota");
        datos.set(key, value);
      },
      removeItem: (key: string) => datos.delete(key),
      clear: () => datos.clear(),
    },
  });
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function esperar(condicion: () => boolean): Promise<void> {
  for (let intento = 0; intento < 20; intento += 1) {
    if (condicion()) return;
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}
