import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { exportarModelo } from "../serializacion/json";
import { crearModelo } from "../modelo/operaciones";
import { store } from "../store";
import {
  confirmarEliminacionOpd,
  crearIdModeloLocal,
  escribirIndiceWorkspace,
  fijarRuntimeEffects,
  leerIndiceWorkspace,
  resetRuntimeEffects,
} from "./runtime";
import type { RuntimeEffects } from "./runtimeEffects";

/**
 * Tests de runtime singleton: undo per-pestaña, dirty/snapshot.
 *
 * Ronda 9 L4: confirma que `commitModelo` + `deshacerRuntime` + `rehacerRuntime`
 * operan sobre el `historialUndo` de la pestaña activa, no contaminan otras
 * pestañas, y `redoStack` se limpia al cambiar de pestaña (Alt A: redo es
 * sesión continua de la pestaña activa).
 */

beforeEach(() => {
  resetRuntimeEffects();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      length: 0,
      key: () => null,
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
      clear: () => undefined,
    },
  });
  store.getState().importarJson(exportarModelo(crearModelo()));
  store.getState().listarModelosGuardados();
});

afterEach(() => {
  resetRuntimeEffects();
});

describe("runtime effects", () => {
  test("confirm inyectado controla confirmacion de eliminacion OPD", () => {
    const mensajes: string[] = [];
    fijarRuntimeEffects(fakeRuntimeEffects({
      confirm: (message) => {
        mensajes.push(message);
        return false;
      },
    }));

    expect(confirmarEliminacionOpd("Vista hija")).toBe(false);
    expect(mensajes).toEqual(["Eliminar OPD \"Vista hija\"? Esta acción se puede deshacer."]);

    fijarRuntimeEffects(fakeRuntimeEffects({ confirm: () => true }));
    expect(confirmarEliminacionOpd("Vista hija")).toBe(true);
  });

  test("storage inyectado aísla indice workspace de localStorage global", () => {
    const storage = new Map<string, string>();
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get() {
        throw new Error("runtime con storage fake no debe tocar localStorage global");
      },
    });
    fijarRuntimeEffects(fakeRuntimeEffects({
      readLocalStorage: (key) => storage.get(key) ?? null,
      writeLocalStorage: (key, value) => {
        storage.set(key, value);
      },
    }));

    const indice = {
      modelos: [{ id: "modelo-1", carpetaId: null }],
      carpetas: [],
      recientes: ["modelo-1"],
    };

    escribirIndiceWorkspace(indice);

    expect(storage.size).toBe(1);
    expect(leerIndiceWorkspace()).toEqual(indice);
  });

  test("ids locales usan runtime effects para reloj, UUID y random", () => {
    fijarRuntimeEffects(fakeRuntimeEffects({
      randomUUID: () => "uuid-controlado",
      random: () => {
        throw new Error("random no se usa cuando crypto provee UUID");
      },
    }));
    expect(crearIdModeloLocal()).toBe("uuid-controlado");

    fijarRuntimeEffects(fakeRuntimeEffects({
      randomUUID: () => null,
      random: () => 0.5,
    }));
    expect(crearIdModeloLocal()).toBe("modelo-moupz400-i");
  });
});

describe("runtime undo per-pestaña", () => {
  test("commit en pestaña A no contamina historial de pestaña B", () => {
    const idA = store.getState().pestanaActivaId;
    store.getState().crearObjetoDemo();
    expect(store.getState().puedeDeshacer).toBe(true);
    expect(Object.values(store.getState().modelo.entidades)).toHaveLength(1);

    store.getState().abrirPestanaNueva();
    const idB = store.getState().pestanaActivaId;
    expect(idB).not.toBe(idA);

    // En B no hay historial heredado
    expect(store.getState().puedeDeshacer).toBe(false);
    expect(Object.values(store.getState().modelo.entidades)).toHaveLength(0);

    store.getState().crearProcesoDemo();
    expect(store.getState().puedeDeshacer).toBe(true);

    // Volver a A: el modelo de A se restaura, su historial sigue intacto
    store.getState().cambiarPestanaActiva(idA);
    expect(store.getState().pestanaActivaId).toBe(idA);
    expect(Object.values(store.getState().modelo.entidades).map((e) => e.tipo)).toEqual(["objeto"]);
    expect(store.getState().puedeDeshacer).toBe(true);

    store.getState().deshacer();
    expect(Object.values(store.getState().modelo.entidades)).toHaveLength(0);
    expect(store.getState().puedeDeshacer).toBe(false);

    // Cambiar a B: su modelo y su historial deberían ser independientes
    store.getState().cambiarPestanaActiva(idB);
    expect(store.getState().pestanaActivaId).toBe(idB);
    expect(Object.values(store.getState().modelo.entidades).map((e) => e.tipo)).toEqual(["proceso"]);
    expect(store.getState().puedeDeshacer).toBe(true);

    store.getState().deshacer();
    expect(Object.values(store.getState().modelo.entidades)).toHaveLength(0);
    expect(store.getState().puedeDeshacer).toBe(false);
  });

  test("redoStack se limpia al cambiar de pestaña (Alt A: redo es sesión continua)", () => {
    const idA = store.getState().pestanaActivaId;
    store.getState().crearObjetoDemo();
    store.getState().deshacer();
    expect(store.getState().puedeRehacer).toBe(true);

    store.getState().abrirPestanaNueva();
    expect(store.getState().puedeRehacer).toBe(false);

    store.getState().cambiarPestanaActiva(idA);
    // Al volver a A, el redo se perdió porque al cambiar a B ya se limpió.
    // Esto es la decisión Alt A documentada en docs/instrucciones-lineas-dev/ronda9/linea-4-undo-per-pestana.md.
    expect(store.getState().puedeRehacer).toBe(false);
  });

  test("undo per-pestaña: dirty se compute por pestaña", () => {
    store.getState().crearObjetoDemo();
    const idA = store.getState().pestanaActivaId;
    expect(store.getState().dirty).toBe(true);

    store.getState().abrirPestanaNueva();
    const idB = store.getState().pestanaActivaId;
    // Pestaña B nueva sin commits → dirty falsy
    expect(store.getState().dirty).toBe(false);

    store.getState().cambiarPestanaActiva(idA);
    expect(store.getState().pestanaActivaId).toBe(idA);
    // A sigue dirty porque tenía commit local
    expect(store.getState().dirty).toBe(true);

    store.getState().cambiarPestanaActiva(idB);
    expect(store.getState().dirty).toBe(false);
  });
});

function fakeRuntimeEffects(overrides: Partial<RuntimeEffects> = {}): RuntimeEffects {
  return {
    now: () => new Date("2026-05-07T00:00:00.000Z"),
    confirm: () => true,
    readLocalStorage: () => null,
    writeLocalStorage: () => undefined,
    randomUUID: () => null,
    random: () => 0,
    ...overrides,
  };
}
