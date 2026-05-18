/**
 * Unit tests EstadoVacioOpm — Corte 3.5 sustracción de chrome.
 *
 * Cubre:
 *  1. `sugerirEnlaceResultado` aplica reglas de visibilidad del nudge.
 *  2. La accion canonica `crearEntidadEnCanvas` (que la toolbar invoca tras
 *     este corte) produce apariencia 135x60 y deja el modelo dirty desde un
 *     OPD vacio.
 *
 * El bloque centrado "Iniciar SD" con sus 3 botones primarios + asistente
 * fue eliminado en el corte 3.5 — el render activo se valida via E2E
 * (`app/e2e/21-estado-vacio-opm.spec.ts`).
 */
import { beforeEach, describe, expect, test } from "bun:test";
import type { Entidad } from "../modelo/tipos";
import { crearModelo } from "../modelo/operaciones";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store";
import { sugerirEnlaceResultado } from "../app/viewmodels/estadoVacioOpmViewModel";

describe("EstadoVacioOpm · sugerirEnlaceResultado", () => {
  test("retorna null cuando no hay 2 entidades", () => {
    expect(sugerirEnlaceResultado([], 0)).toBeNull();
    expect(sugerirEnlaceResultado([entidad("p1", "proceso", "Procesar")], 0)).toBeNull();
    expect(sugerirEnlaceResultado([
      entidad("p1", "proceso", "P"),
      entidad("o1", "objeto", "O"),
      entidad("o2", "objeto", "O2"),
    ], 0)).toBeNull();
  });

  test("retorna null cuando ya hay enlaces en el OPD", () => {
    const sugerencia = sugerirEnlaceResultado([
      entidad("p1", "proceso", "Procesar"),
      entidad("o1", "objeto", "Objeto"),
    ], 1);
    expect(sugerencia).toBeNull();
  });

  test("retorna null cuando ambas entidades son del mismo tipo", () => {
    expect(sugerirEnlaceResultado([
      entidad("o1", "objeto", "A"),
      entidad("o2", "objeto", "B"),
    ], 0)).toBeNull();
    expect(sugerirEnlaceResultado([
      entidad("p1", "proceso", "P1"),
      entidad("p2", "proceso", "P2"),
    ], 0)).toBeNull();
  });

  test("retorna proceso+objeto cuando firma resultado es legal", () => {
    const proceso = entidad("p1", "proceso", "Procesar");
    const objeto = entidad("o1", "objeto", "Resultado");
    const sugerencia = sugerirEnlaceResultado([proceso, objeto], 0);
    expect(sugerencia).not.toBeNull();
    expect(sugerencia!.proceso.id).toBe("p1");
    expect(sugerencia!.objeto.id).toBe("o1");
  });

  test("orden de las entidades no importa", () => {
    const proceso = entidad("p1", "proceso", "Procesar");
    const objeto = entidad("o1", "objeto", "Resultado");
    const sugerencia = sugerirEnlaceResultado([objeto, proceso], 0);
    expect(sugerencia).not.toBeNull();
    expect(sugerencia!.proceso.tipo).toBe("proceso");
    expect(sugerencia!.objeto.tipo).toBe("objeto");
  });
});

describe("EstadoVacioOpm · accion canonica desde canvas vacio", () => {
  beforeEach(() => {
    instalarLocalStorage();
    instalarConfirmacion();
    store.getState().importarJson(exportarModelo(crearModelo()));
  });

  test("crearEntidadEnCanvas('proceso') desde vacio produce apariencia 135x60 y dirty", () => {
    const stateInicial = store.getState();
    expect(stateInicial.dirty).toBe(false);
    const opdActivoId = stateInicial.opdActivoId;
    expect(Object.keys(stateInicial.modelo.opds[opdActivoId]?.apariencias ?? {})).toHaveLength(0);

    // Posicion centrada canonica: la misma que usaria el empty state via
    // `posicionLibre`. Aqui usamos un valor concreto para aislar la prueba
    // del helper de layout.
    store.getState().crearEntidadEnCanvas("proceso", { x: 300, y: 90 });

    const final = store.getState();
    expect(final.dirty).toBe(true);
    expect(final.puedeDeshacer).toBe(true);
    expect(final.nuevaCosaPendiente).not.toBeNull();
    const apariencias = Object.values(final.modelo.opds[opdActivoId]?.apariencias ?? {});
    expect(apariencias).toHaveLength(1);
    const apariencia = apariencias[0];
    if (!apariencia) throw new Error("apariencia esperada");
    expect(apariencia.width).toBe(135);
    expect(apariencia.height).toBe(60);
    const entidad = final.modelo.entidades[apariencia.entidadId];
    expect(entidad?.tipo).toBe("proceso");
  });

  test("crearEntidadEnCanvas('objeto') desde vacio produce apariencia 135x60 y dirty", () => {
    const stateInicial = store.getState();
    const opdActivoId = stateInicial.opdActivoId;

    store.getState().crearEntidadEnCanvas("objeto", { x: 80, y: 90 });

    const final = store.getState();
    expect(final.dirty).toBe(true);
    const apariencias = Object.values(final.modelo.opds[opdActivoId]?.apariencias ?? {});
    expect(apariencias).toHaveLength(1);
    const apariencia = apariencias[0];
    if (!apariencia) throw new Error("apariencia esperada");
    expect(apariencia.width).toBe(135);
    expect(apariencia.height).toBe(60);
    expect(final.modelo.entidades[apariencia.entidadId]?.tipo).toBe("objeto");
  });

  test("iniciarAsistente desde canvas vacio activa el flujo asistente sin tocar modelo", () => {
    expect(store.getState().asistente).toBeNull();
    const aparienciasAntes = Object.keys(
      store.getState().modelo.opds[store.getState().opdActivoId]?.apariencias ?? {},
    ).length;

    store.getState().iniciarAsistente();

    expect(store.getState().asistente).not.toBeNull();
    expect(store.getState().asistente!.etapaActual).toBe(0);
    const aparienciasDespues = Object.keys(
      store.getState().modelo.opds[store.getState().opdActivoId]?.apariencias ?? {},
    ).length;
    expect(aparienciasDespues).toBe(aparienciasAntes);
    expect(store.getState().dirty).toBe(false);
  });
});

function entidad(id: string, tipo: "proceso" | "objeto", nombre: string): Entidad {
  return {
    id,
    tipo,
    nombre,
    esencia: "informacional",
    afiliacion: "sistemica",
  };
}

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

function instalarConfirmacion(): void {
  Object.defineProperty(globalThis, "confirm", {
    configurable: true,
    value: () => true,
  });
}
