import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { exportarModelo } from "../serializacion/json";
import { crearModelo } from "../modelo/operaciones";
import { store } from "../store";
import {
  confirmarEliminacionOpd,
  crearIdModeloLocal,
  escribirIndiceWorkspace,
  fijarRuntimeEffects,
  fusionarPreferenciasBootstrap,
  leerIndiceWorkspace,
  resetRuntimeEffects,
} from "./runtime";
import { indiceVacio } from "../persistencia/workspace";
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
  // Higiene del singleton: otros archivos de test pueden dejar el modo
  // simulación activo (readOnly forzado) y commitModelo lo detecta.
  store.getState().salirModoSimulacion();
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

  test("workspace sin backend no persiste en storage navegador", () => {
    const indice = {
      modelos: [{ id: "modelo-1", carpetaId: null }],
      carpetas: [],
      recientes: ["modelo-1"],
    };

    escribirIndiceWorkspace(indice);

    expect(leerIndiceWorkspace()).toEqual({
      modelos: [],
      carpetas: [],
      recientes: [],
    });
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
  test("commitModelo bloquea mutaciones cuando el OPD activo es una vista derivada read-only", () => {
    const base = crearModelo();
    const opdId = base.opdRaizId;
    const opd = base.opds[opdId]!;
    const modeloVista = {
      ...base,
      opds: {
        ...base.opds,
        [opdId]: {
          ...opd,
          vista: {
            kind: "requirement-view" as const,
            requisitoEntidadId: "req-control",
            readOnly: true as const,
          },
        },
      },
    };
    store.setState({
      modelo: modeloVista,
      opdActivoId: opdId,
      readOnly: false,
      mensaje: null,
    });
    const antes = exportarModelo(store.getState().modelo);

    store.getState().crearObjetoDemo();

    expect(exportarModelo(store.getState().modelo)).toBe(antes);
    expect(store.getState().mensaje).toBe("Vista derivada en solo lectura. Cambia al OPD fuente para editar.");
  });

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
    randomUUID: () => null,
    random: () => 0,
    ...overrides,
  };
}

describe("fusionarPreferenciasBootstrap", () => {
  test("load fresco (sin prefs locales): el backend gana", () => {
    const backend = { ...indiceVacio(), preferenciasUi: { oplEsenciaVisibilidad: "oculta" as const } };
    const local = indiceVacio();
    expect(fusionarPreferenciasBootstrap(backend, local).preferenciasUi).toEqual({ oplEsenciaVisibilidad: "oculta" });
  });

  test("cambio en-sesión: la pref local pisa la del backend por clave (anti-race)", () => {
    const backend = { ...indiceVacio(), preferenciasUi: { oplEsenciaVisibilidad: "siempre" as const, anchoPanelInspector: 360 } };
    const local = { ...indiceVacio(), preferenciasUi: { oplEsenciaVisibilidad: "oculta" as const } };
    const fusion = fusionarPreferenciasBootstrap(backend, local).preferenciasUi;
    expect(fusion?.oplEsenciaVisibilidad).toBe("oculta"); // local gana
    expect(fusion?.anchoPanelInspector).toBe(360); // backend conservado en claves no tocadas
  });

  test("preserva el resto del índice del backend (modelos/recientes)", () => {
    const backend = { ...indiceVacio(), recientes: ["m-1"], preferenciasUi: { oplMinimizado: true } };
    const local = { ...indiceVacio(), preferenciasUi: { oplEsenciaVisibilidad: "oculta" as const } };
    const fusion = fusionarPreferenciasBootstrap(backend, local);
    expect(fusion.recientes).toEqual(["m-1"]);
    expect(fusion.preferenciasUi).toEqual({ oplMinimizado: true, oplEsenciaVisibilidad: "oculta" });
  });
});
