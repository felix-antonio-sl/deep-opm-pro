import { useEffect, useState } from "preact/hooks";
import { createStore } from "zustand/vanilla";
import {
  actualizarVerticesEnlace as actualizarVerticesEnlaceOp,
  cambiarAfiliacion,
  cambiarEsencia,
  crearEnlace,
  crearModelo,
  crearObjeto,
  crearProceso,
  eliminarEntidad,
  eliminarEnlace,
  moverApariencia as moverAparienciaEntidad,
  moverAparienciaPorId,
  renombrarEntidad,
} from "./modelo/operaciones";
import { exportarModelo, hidratarModelo } from "./serializacion/json";
import type { Afiliacion, Esencia, Id, Modelo, TipoEnlace } from "./modelo/tipos";

interface ModoEnlace {
  tipo: TipoEnlace;
  origenId: Id;
}

interface OpmStore {
  modelo: Modelo;
  seleccionId: Id | null;
  enlaceSeleccionId: Id | null;
  modoEnlace: ModoEnlace | null;
  mensaje: string | null;
  dirty: boolean;
  puedeDeshacer: boolean;
  puedeRehacer: boolean;
  crearObjetoDemo: () => void;
  crearProcesoDemo: () => void;
  seleccionarEntidad: (id: Id) => void;
  seleccionarEnlace: (id: Id) => void;
  deshacer: () => void;
  rehacer: () => void;
  elegirTipoEnlace: (tipo: TipoEnlace) => void;
  cancelarEnlace: () => void;
  renombrarSeleccionada: (nombre: string) => void;
  fijarEsenciaSeleccionada: (esencia: Esencia) => void;
  fijarAfiliacionSeleccionada: (afiliacion: Afiliacion) => void;
  moverEntidad: (id: Id, x: number, y: number) => void;
  moverApariencia: (aparienciaId: Id, x: number, y: number) => void;
  actualizarVerticesEnlace: (aparienciaEnlaceId: Id, vertices: Array<{ x: number; y: number }>) => void;
  eliminarSeleccion: () => void;
  exportarJson: () => string;
  importarJson: (json: string) => void;
  guardarLocal: () => void;
  cargarLocal: () => void;
  cargarDemo: () => void;
}

const modeloInicial = crearModelo();
const STORAGE_KEY = "deep-opm-pro:modelo";
const UNDO_LIMIT = 100;
let snapshotGuardado = exportarModelo(modeloInicial);
let undoStack: Modelo[] = [];
let redoStack: Modelo[] = [];

export const store = createStore<OpmStore>((set, get) => ({
  modelo: modeloInicial,
  seleccionId: null,
  enlaceSeleccionId: null,
  modoEnlace: null,
  mensaje: null,
  dirty: false,
  puedeDeshacer: false,
  puedeRehacer: false,

  crearObjetoDemo() {
    const { modelo } = get();
    const count = Object.keys(modelo.entidades).length;
    const resultado = crearObjeto(modelo, modelo.opdRaizId, { x: 80 + count * 24, y: 90 + count * 18 });
    if (resultado.ok) commitModelo(set, modelo, resultado.value, { seleccionId: entidadNueva(modelo, resultado.value), enlaceSeleccionId: null, mensaje: null });
  },

  crearProcesoDemo() {
    const { modelo } = get();
    const count = Object.keys(modelo.entidades).length;
    const resultado = crearProceso(modelo, modelo.opdRaizId, { x: 300 + count * 24, y: 120 + count * 18 });
    if (resultado.ok) commitModelo(set, modelo, resultado.value, { seleccionId: entidadNueva(modelo, resultado.value), enlaceSeleccionId: null, mensaje: null });
  },

  seleccionarEntidad(id) {
    const { modelo, modoEnlace } = get();
    if (!modoEnlace) {
      set({ seleccionId: id, enlaceSeleccionId: null, mensaje: null });
      return;
    }

    const resultado = crearEnlace(modelo, modelo.opdRaizId, modoEnlace.origenId, id, modoEnlace.tipo);
    if (!resultado.ok) {
      set({ seleccionId: id, enlaceSeleccionId: null, mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: id,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  seleccionarEnlace(id) {
    const { modelo } = get();
    const enlace = modelo.enlaces[id];
    if (!enlace) {
      set({ mensaje: `Enlace no existe: ${id}` });
      return;
    }
    set({ seleccionId: null, enlaceSeleccionId: id, modoEnlace: null, mensaje: null });
  },

  elegirTipoEnlace(tipo) {
    const { modelo, seleccionId } = get();
    if (!seleccionId || !modelo.entidades[seleccionId]) {
      set({ mensaje: "Selecciona primero la entidad origen del enlace" });
      return;
    }
    set({ modoEnlace: { tipo, origenId: seleccionId }, mensaje: "Selecciona la entidad destino" });
  },

  cancelarEnlace() {
    set({ modoEnlace: null, mensaje: null });
  },

  deshacer() {
    const { modelo } = get();
    const previo = undoStack.pop();
    if (!previo) {
      set({ mensaje: "No hay cambios para deshacer", puedeDeshacer: false });
      return;
    }
    redoStack = [modelo, ...redoStack].slice(0, UNDO_LIMIT);
    set(estadoModelo(previo, { seleccionId: null, enlaceSeleccionId: null, modoEnlace: null, mensaje: "Cambio deshecho" }));
  },

  rehacer() {
    const { modelo } = get();
    const siguiente = redoStack.shift();
    if (!siguiente) {
      set({ mensaje: "No hay cambios para rehacer", puedeRehacer: false });
      return;
    }
    undoStack = [...undoStack, modelo].slice(-UNDO_LIMIT);
    set(estadoModelo(siguiente, { seleccionId: null, enlaceSeleccionId: null, modoEnlace: null, mensaje: "Cambio rehecho" }));
  },

  renombrarSeleccionada(nombre) {
    const { modelo, seleccionId } = get();
    if (!seleccionId) return;
    const resultado = renombrarEntidad(modelo, seleccionId, nombre);
    if (resultado.ok) commitModelo(set, modelo, resultado.value, { mensaje: null });
  },

  fijarEsenciaSeleccionada(esencia) {
    const { modelo, seleccionId } = get();
    if (!seleccionId) return;
    const resultado = cambiarEsencia(modelo, seleccionId, esencia);
    if (resultado.ok) commitModelo(set, modelo, resultado.value, { mensaje: null });
  },

  fijarAfiliacionSeleccionada(afiliacion) {
    const { modelo, seleccionId } = get();
    if (!seleccionId) return;
    const resultado = cambiarAfiliacion(modelo, seleccionId, afiliacion);
    if (resultado.ok) commitModelo(set, modelo, resultado.value, { mensaje: null });
  },

  moverEntidad(id, x, y) {
    const { modelo } = get();
    const resultado = moverAparienciaEntidad(modelo, modelo.opdRaizId, id, { x, y });
    if (resultado.ok) commitModelo(set, modelo, resultado.value);
  },

  moverApariencia(aparienciaId, x, y) {
    const { modelo } = get();
    const resultado = moverAparienciaPorId(modelo, modelo.opdRaizId, aparienciaId, { x, y });
    if (resultado.ok) commitModelo(set, modelo, resultado.value);
  },

  actualizarVerticesEnlace(aparienciaEnlaceId, vertices) {
    const { modelo } = get();
    const resultado = actualizarVerticesEnlaceOp(modelo, modelo.opdRaizId, aparienciaEnlaceId, vertices);
    if (resultado.ok) commitModelo(set, modelo, resultado.value);
  },

  eliminarSeleccion() {
    const { modelo, seleccionId, enlaceSeleccionId } = get();
    if (enlaceSeleccionId) {
      const resultado = eliminarEnlace(modelo, enlaceSeleccionId);
      if (resultado.ok) {
        commitModelo(set, modelo, resultado.value, { seleccionId: null, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
      }
      return;
    }
    if (!seleccionId) {
      set({ mensaje: "Selecciona una entidad o enlace para eliminar" });
      return;
    }
    const resultado = eliminarEntidad(modelo, seleccionId);
    if (resultado.ok) {
      commitModelo(set, modelo, resultado.value, { seleccionId: null, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
    }
  },

  exportarJson() {
    return exportarModelo(get().modelo);
  },

  importarJson(json) {
    const resultado = hidratarModelo(json);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    resetHistorial(resultado.value);
    set(estadoModelo(resultado.value, { seleccionId: null, enlaceSeleccionId: null, modoEnlace: null, mensaje: "Modelo importado" }));
  },

  guardarLocal() {
    if (typeof localStorage === "undefined") return;
    const { modelo } = get();
    localStorage.setItem(STORAGE_KEY, exportarModelo(modelo));
    snapshotGuardado = exportarModelo(modelo);
    set({ mensaje: "Modelo guardado localmente", dirty: false });
  },

  cargarLocal() {
    if (typeof localStorage === "undefined") return;
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) {
      set({ mensaje: "No hay modelo guardado" });
      return;
    }
    get().importarJson(json);
  },

  cargarDemo() {
    const modelo = crearDemo();
    resetHistorial(modelo);
    set(estadoModelo(modelo, { seleccionId: null, enlaceSeleccionId: null, modoEnlace: null, mensaje: "Demo cargado" }));
  },
}));

export function useOpmStore<T>(selector: (state: OpmStore) => T): T {
  const [selected, setSelected] = useState(() => selector(store.getState()));
  useEffect(() => store.subscribe((state) => {
    const next = selector(state);
    setSelected((current) => (Object.is(current, next) ? current : next));
  }), [selector]);
  return selected;
}

function entidadNueva(previo: Modelo, siguiente: Modelo): Id | null {
  const previos = new Set(Object.keys(previo.entidades));
  return Object.keys(siguiente.entidades).find((id) => !previos.has(id)) ?? null;
}

function commitModelo(
  set: (partial: Partial<OpmStore>) => void,
  previo: Modelo,
  siguiente: Modelo,
  extra: Partial<OpmStore> = {},
): void {
  if (previo === siguiente || exportarModelo(previo) === exportarModelo(siguiente)) {
    set(extra);
    return;
  }
  undoStack = [...undoStack, previo].slice(-UNDO_LIMIT);
  redoStack = [];
  set(estadoModelo(siguiente, extra));
}

function resetHistorial(modelo: Modelo): void {
  undoStack = [];
  redoStack = [];
  snapshotGuardado = exportarModelo(modelo);
}

function estadoModelo(modelo: Modelo, extra: Partial<OpmStore> = {}): Partial<OpmStore> {
  return {
    modelo,
    dirty: exportarModelo(modelo) !== snapshotGuardado,
    puedeDeshacer: undoStack.length > 0,
    puedeRehacer: redoStack.length > 0,
    ...extra,
  };
}

function crearDemo(): Modelo {
  let modelo = crearModelo("OnStar mínimo");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 90, y: 90 }, "Driver"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 330, y: 90 }, "OnStar System"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 230 }, "Driver Rescuing"));

  const driver = entidadPorNombre(modelo, "Driver");
  const sistema = entidadPorNombre(modelo, "OnStar System");
  const rescate = entidadPorNombre(modelo, "Driver Rescuing");

  modelo = must(cambiarEsencia(modelo, driver, "fisica"));
  modelo = must(cambiarAfiliacion(modelo, driver, "ambiental"));
  modelo = must(cambiarEsencia(modelo, sistema, "fisica"));
  modelo = must(cambiarEsencia(modelo, rescate, "fisica"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, driver, rescate, "agente"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, rescate, sistema, "efecto"));
  return modelo;
}

function entidadPorNombre(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad demo no encontrada: ${nombre}`);
  return entidad.id;
}

function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
