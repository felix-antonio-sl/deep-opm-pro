import { beforeEach, describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "../modelo/operaciones";
import type { Modelo, Resultado } from "../modelo/tipos";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store";

describe("law-opl-apply-undo-atomicity", () => {
  beforeEach(() => {
    instalarConfirmacion();
    store.getState().importarJson(exportarModelo(crearModelo("Leyes undo")));
  });

  test("aplicar OPL libre con varios patches entra como una unidad undoable", () => {
    const modeloBase = modeloConObjeto("Pedido");
    store.getState().importarJson(exportarModelo(modeloBase));
    const pedidoId = entidadPorNombre(store.getState().modelo, "Pedido");
    const snapshotBase = exportarModelo(store.getState().modelo);
    const undoAntes = undoStackLength();

    store.getState().aplicarEdicionOplLibre("**Orden** es un objeto físico y ambiental.");

    expect(undoStackLength() - undoAntes).toBe(1);
    expect(store.getState().modelo.entidades[pedidoId]).toMatchObject({
      nombre: "Orden",
      esencia: "fisica",
      afiliacion: "ambiental",
    });

    const snapshotAplicado = exportarModelo(store.getState().modelo);
    store.getState().deshacer();
    expect(exportarModelo(store.getState().modelo)).toBe(snapshotBase);
    expect(undoStackLength()).toBe(undoAntes);
    expect(store.getState().puedeRehacer).toBe(true);

    store.getState().rehacer();
    expect(exportarModelo(store.getState().modelo)).toBe(snapshotAplicado);
    expect(store.getState().modelo.entidades[pedidoId]).toMatchObject({
      nombre: "Orden",
      esencia: "fisica",
      afiliacion: "ambiental",
    });
  });
});

function modeloConObjeto(nombre: string): Modelo {
  return must(crearObjeto(crearModelo("Leyes undo"), "opd-1", { x: 40, y: 80 }, nombre));
}

function entidadPorNombre(modelo: Modelo, nombre: string): string {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function undoStackLength(): number {
  const estado = store.getState();
  const pestana = estado.pestanasAbiertas.find((item) => item.id === estado.pestanaActivaId);
  return pestana?.historialUndo.length ?? 0;
}

function instalarConfirmacion(): void {
  Object.defineProperty(globalThis, "confirm", {
    configurable: true,
    value: () => true,
  });
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
