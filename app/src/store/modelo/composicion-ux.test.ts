import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto, crearProceso } from "../../modelo/operaciones";
import type { Id, Modelo, Resultado } from "../../modelo/tipos";
import type { ModeloPersistido } from "../../persistencia/modelos";
import { exportarModelo } from "../../serializacion/json";
import { store } from "../../store";

let originalFetch: typeof fetch;
let backend: BackendMock;

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function entidadId(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

beforeEach(() => {
  backend = instalarBackendMock();
  store.getState().importarJson(exportarModelo(crearModelo("Base")));
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  Reflect.deleteProperty(globalThis, "window");
});

describe("componerConModeloGuardado — UX del Piso 1", () => {
  test("abre y cierra el diálogo de composición", () => {
    store.getState().abrirDialogoComposicion();
    expect(store.getState().dialogoComposicionAbierto).toBe(true);

    store.getState().cerrarDialogoComposicion();
    expect(store.getState().dialogoComposicionAbierto).toBe(false);
  });

  test("carga un modelo guardado, aplica compartidas y materializa el compuesto en el modelo activo", async () => {
    let a = crearModelo("Modelo A");
    a = must(crearObjeto(a, a.opdRaizId, { x: 20, y: 80 }, "Cliente"));
    a = must(crearProceso(a, a.opdRaizId, { x: 220, y: 80 }, "Comprar"));
    a = must(crearEnlace(a, a.opdRaizId, entidadId(a, "Cliente"), entidadId(a, "Comprar"), "consumo"));

    let b = crearModelo("Modelo B");
    b = must(crearObjeto(b, b.opdRaizId, { x: 20, y: 80 }, "Cliente"));
    b = must(crearObjeto(b, b.opdRaizId, { x: 300, y: 80 }, "Factura"));
    const clienteA = entidadId(a, "Cliente");
    const clienteB = entidadId(b, "Cliente");

    store.getState().importarJson(exportarModelo(a));
    guardarModeloEnBackendMock({
      id: "modelo-b",
      nombre: "Modelo B",
      json: exportarModelo(b),
    });
    store.getState().abrirDialogoComposicion();

    store.getState().componerConModeloGuardado({
      modeloId: "modelo-b",
      compartidas: { [clienteB]: clienteA },
    });
    await esperar(() => store.getState().mensaje?.startsWith("Modelo compuesto") === true);

    const estado = store.getState();
    expect(estado.dialogoComposicionAbierto).toBe(false);
    expect(estado.opdActivoId).toBe(estado.modelo.opdRaizId);
    expect(estado.puedeDeshacer).toBe(true);
    expect(estado.mensaje).toContain("Modelo compuesto");
    expect(Object.values(estado.modelo.entidades).filter((entidad) => entidad.nombre === "Cliente")).toHaveLength(1);
    expect(Object.values(estado.modelo.entidades).some((entidad) => entidad.nombre === "Factura")).toBe(true);
  });

  test("informa error si el modelo backend no existe y no muta el modelo activo", async () => {
    const antes = exportarModelo(store.getState().modelo);

    store.getState().componerConModeloGuardado({ modeloId: "inexistente", compartidas: {} });
    await esperar(() => store.getState().mensaje === "Modelo no encontrado en servidor");

    expect(exportarModelo(store.getState().modelo)).toBe(antes);
    expect(store.getState().mensaje).toBe("Modelo no encontrado en servidor");
  });

  test("advierte cuando la composición crea un conflicto de recurso lineal", async () => {
    // Objeto lineal "Bateria" consumido en A y en B; al fusionarlo quedan DOS
    // consumidores del mismo recurso lineal -> estado inválido. La capacidad
    // verificarLinealidad existía pero no se reflejaba en la UX (fusión silenciosa).
    let a = crearModelo("Lineal A");
    a = must(crearObjeto(a, a.opdRaizId, { x: 20, y: 80 }, "Bateria"));
    const objA = entidadId(a, "Bateria");
    a = { ...a, entidades: { ...a.entidades, [objA]: { ...a.entidades[objA]!, lineal: true } } };
    a = must(crearProceso(a, a.opdRaizId, { x: 220, y: 80 }, "Motor A"));
    a = must(crearEnlace(a, a.opdRaizId, objA, entidadId(a, "Motor A"), "consumo"));

    let b = crearModelo("Lineal B");
    b = must(crearObjeto(b, b.opdRaizId, { x: 20, y: 80 }, "Bateria"));
    const objB = entidadId(b, "Bateria");
    b = { ...b, entidades: { ...b.entidades, [objB]: { ...b.entidades[objB]!, lineal: true } } };
    b = must(crearProceso(b, b.opdRaizId, { x: 220, y: 80 }, "Motor B"));
    b = must(crearEnlace(b, b.opdRaizId, objB, entidadId(b, "Motor B"), "consumo"));

    store.getState().importarJson(exportarModelo(a));
    guardarModeloEnBackendMock({ id: "lineal-b", nombre: "Lineal B", json: exportarModelo(b) });
    store.getState().componerConModeloGuardado({ modeloId: "lineal-b", compartidas: { [objB]: objA } });
    await esperar(() => store.getState().mensaje?.includes("linealidad") === true);

    expect(store.getState().mensaje).toContain("linealidad");
  });
});

interface BackendMock {
  modelos: Map<string, ModeloPersistido>;
}

function guardarModeloEnBackendMock(input: Pick<ModeloPersistido, "id" | "nombre" | "json"> & Partial<ModeloPersistido>): void {
  const ahora = "2026-06-06T00:00:00.000Z";
  backend.modelos.set(input.id, {
    descripcion: "",
    creadoEn: ahora,
    actualizadoEn: ahora,
    carpetaId: null,
    revision: 1,
    ...input,
  });
}

function instalarBackendMock(): BackendMock {
  Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
  originalFetch = globalThis.fetch;
  const mock: BackendMock = { modelos: new Map() };
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? "GET";
    if (url.startsWith("/__deep-opm/modelos/") && method === "GET") {
      const id = decodeURIComponent(url.split("/").pop() ?? "");
      const modelo = mock.modelos.get(id);
      return Promise.resolve(modelo
        ? jsonResponse({ modelo })
        : jsonResponse({ error: "Modelo no encontrado en servidor" }, 404));
    }
    return Promise.resolve(jsonResponse({ error: "unexpected" }, 404));
  }) as unknown as typeof fetch;
  return mock;
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
