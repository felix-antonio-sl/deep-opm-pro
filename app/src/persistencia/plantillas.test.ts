import { beforeEach, describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import { exportarModelo } from "../serializacion/json";
import type { ModeloPersistido } from "./local";
import { borrarPlantilla, cargarPlantilla, guardarPlantilla, listarPlantillas, renombrarPlantilla } from "./plantillas";

describe("persistencia de plantillas privadas", () => {
  beforeEach(() => {
    instalarLocalStorage();
  });

  test("guarda plantilla con id único y permite cargarla completa", () => {
    const modelo = modeloPersistido("Plantilla base");
    const guardada = guardarPlantilla({ nombre: "Flujo base", descripcion: "bloque reusable", modeloPersistido: modelo });
    expect(guardada.ok).toBe(true);
    if (!guardada.ok) return;
    expect(guardada.value.id.startsWith("plantilla-")).toBe(true);
    expect(guardada.value.ambito).toBe("privado");

    const cargada = cargarPlantilla(guardada.value.id);
    expect(cargada.ok).toBe(true);
    if (!cargada.ok) return;
    expect(cargada.value.contenido.json).toBe(modelo.json);
  });

  test("listarPlantillas retorna índices ordenados por actualizadoEn desc", () => {
    const primera = guardarPlantilla({ nombre: "A", modeloPersistido: modeloPersistido("A") });
    expect(primera.ok).toBe(true);
    const segunda = guardarPlantilla({ nombre: "B", modeloPersistido: modeloPersistido("B") });
    expect(segunda.ok).toBe(true);
    if (!primera.ok || !segunda.ok) return;

    const listado = listarPlantillas();
    expect(listado.ok).toBe(true);
    if (!listado.ok) return;
    expect(listado.value.map((item) => item.id)).toEqual([segunda.value.id, primera.value.id]);
  });

  test("borrarPlantilla elimina documento, metadata e id de la lista", () => {
    const guardada = guardarPlantilla({ nombre: "Borrar", modeloPersistido: modeloPersistido("Borrar") });
    expect(guardada.ok).toBe(true);
    if (!guardada.ok) return;
    expect(borrarPlantilla(guardada.value.id).ok).toBe(true);
    expect(cargarPlantilla(guardada.value.id).ok).toBe(false);
    expect(listarPlantillas()).toEqual({ ok: true, value: [] });
  });

  test("rechaza ámbitos organizacional/global en MVP beta privado", () => {
    const resultado = guardarPlantilla({ nombre: "Org", modeloPersistido: modeloPersistido("Org"), ambito: "organizacional" });
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.error).toContain("multi-usuario");
  });

  test("renombrarPlantilla actualiza índice sin perder payload", () => {
    const guardada = guardarPlantilla({ nombre: "Original", modeloPersistido: modeloPersistido("Original") });
    expect(guardada.ok).toBe(true);
    if (!guardada.ok) return;
    const renombrada = renombrarPlantilla(guardada.value.id, "Renombrada", "nueva descripcion");
    expect(renombrada.ok).toBe(true);
    if (!renombrada.ok) return;
    expect(renombrada.value.nombre).toBe("Renombrada");
    const cargada = cargarPlantilla(guardada.value.id);
    expect(cargada.ok).toBe(true);
    if (!cargada.ok) return;
    expect(cargada.value.contenido.json).toBe(guardada.value.contenido.json);
  });
});

function modeloPersistido(nombre: string): ModeloPersistido {
  const ahora = new Date().toISOString();
  const modelo = crearModelo(nombre);
  return {
    id: `modelo-${nombre}`,
    nombre,
    descripcion: "",
    creadoEn: ahora,
    actualizadoEn: ahora,
    json: exportarModelo(modelo),
  };
}

function instalarLocalStorage(): void {
  const datos = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => datos.get(key) ?? null,
      setItem: (key: string, value: string) => datos.set(key, value),
      removeItem: (key: string) => datos.delete(key),
      clear: () => datos.clear(),
    },
  });
}
