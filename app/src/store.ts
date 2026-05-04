import { useEffect, useState } from "preact/hooks";
import { createStore } from "zustand/vanilla";
import { CANON } from "./modelo/constantes";
import {
  actualizarVerticesEnlace as actualizarVerticesEnlaceOp,
  cambiarAfiliacion,
  cambiarEsencia,
  crearEnlace,
  crearModelo,
  crearObjeto,
  crearProceso,
  descomponerProceso,
  desplegarObjeto,
  eliminarEntidad,
  eliminarEnlace,
  moverApariencia as moverAparienciaEntidad,
  moverAparienciaPorId,
  quitarDescomposicionProceso,
  quitarDespliegueObjeto,
  renombrarEntidad,
} from "./modelo/operaciones";
import { cambiarModoPlegado as cambiarModoPlegadoOp } from "./modelo/plegado";
import {
  borrarModeloLocal,
  cargarModeloLocal,
  guardarModeloLocal,
  listarModelosLocales,
  type ResumenModeloPersistido,
} from "./persistencia/local";
import { exportarModelo, hidratarModelo } from "./serializacion/json";
import type { Afiliacion, Apariencia, Esencia, Id, Modelo, ModoPlegado, Posicion, TipoEnlace } from "./modelo/tipos";

interface ModoEnlace {
  tipo: TipoEnlace;
  origenId: Id;
}

interface OpmStore {
  modelo: Modelo;
  opdActivoId: Id;
  seleccionId: Id | null;
  enlaceSeleccionId: Id | null;
  modoEnlace: ModoEnlace | null;
  mensaje: string | null;
  dirty: boolean;
  puedeDeshacer: boolean;
  puedeRehacer: boolean;
  modelosGuardados: ResumenModeloPersistido[];
  modeloPersistidoId: Id | null;
  limpiarMensaje: () => void;
  nuevoModelo: () => void;
  crearObjetoDemo: () => void;
  crearProcesoDemo: () => void;
  descomponerSeleccionada: () => void;
  desplegarSeleccionada: () => void;
  quitarDescomposicionSeleccionada: () => void;
  quitarDespliegueSeleccionado: () => void;
  cambiarOpdActivo: (id: Id) => void;
  seleccionarEntidad: (id: Id) => void;
  seleccionarEnlace: (id: Id) => void;
  deshacer: () => void;
  rehacer: () => void;
  elegirTipoEnlace: (tipo: TipoEnlace) => void;
  cancelarEnlace: () => void;
  renombrarSeleccionada: (nombre: string) => void;
  fijarEsenciaSeleccionada: (esencia: Esencia) => void;
  fijarAfiliacionSeleccionada: (afiliacion: Afiliacion) => void;
  cambiarModoPlegadoSeleccionado: (modo: ModoPlegado) => void;
  cambiarModoPlegadoApariencia: (aparienciaId: Id, modo: ModoPlegado) => void;
  moverEntidad: (id: Id, x: number, y: number) => void;
  moverApariencia: (aparienciaId: Id, x: number, y: number) => void;
  reordenarSubprocesoEnTimeline: (opdId: Id, aparienciaId: Id, nuevaY: number) => void;
  actualizarVerticesEnlace: (aparienciaEnlaceId: Id, vertices: Array<{ x: number; y: number }>) => void;
  eliminarSeleccion: () => void;
  exportarJson: () => string;
  importarJson: (json: string) => void;
  listarModelosGuardados: () => void;
  guardarLocal: () => void;
  cargarLocal: (id?: Id) => void;
  borrarLocal: (id: Id) => void;
  cargarDemo: () => void;
}

const modeloInicial = crearModelo();
const UNDO_LIMIT = 100;
let snapshotGuardado = exportarModelo(modeloInicial);
let undoStack: Modelo[] = [];
let redoStack: Modelo[] = [];

export const store = createStore<OpmStore>((set, get) => ({
  modelo: modeloInicial,
  opdActivoId: modeloInicial.opdRaizId,
  seleccionId: null,
  enlaceSeleccionId: null,
  modoEnlace: null,
  mensaje: null,
  dirty: false,
  puedeDeshacer: false,
  puedeRehacer: false,
  modelosGuardados: [],
  modeloPersistidoId: null,

  limpiarMensaje() {
    set({ mensaje: null });
  },

  nuevoModelo() {
    const modelo = crearModelo();
    resetHistorial(modelo);
    set(estadoModelo(modelo, {
      opdActivoId: modelo.opdRaizId,
      seleccionId: null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      modeloPersistidoId: null,
      mensaje: "Nuevo modelo",
    }));
  },

  crearObjetoDemo() {
    const { modelo, opdActivoId } = get();
    const resultado = crearObjeto(modelo, opdActivoId, posicionLibre(modelo, opdActivoId, "objeto"));
    if (resultado.ok) commitModelo(set, modelo, resultado.value, { seleccionId: entidadNueva(modelo, resultado.value), enlaceSeleccionId: null, mensaje: null });
  },

  crearProcesoDemo() {
    const { modelo, opdActivoId } = get();
    const resultado = crearProceso(modelo, opdActivoId, posicionLibre(modelo, opdActivoId, "proceso"));
    if (resultado.ok) commitModelo(set, modelo, resultado.value, { seleccionId: entidadNueva(modelo, resultado.value), enlaceSeleccionId: null, mensaje: null });
  },

  descomponerSeleccionada() {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) {
      set({ mensaje: "Selecciona un proceso para descomponer" });
      return;
    }
    const entidad = modelo.entidades[seleccionId];
    if (!entidad || entidad.tipo !== "proceso") {
      set({ mensaje: "Selecciona un proceso para descomponer" });
      return;
    }

    const resultado = descomponerProceso(modelo, opdActivoId, seleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value.modelo, {
      opdActivoId: resultado.value.opdId,
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: resultado.value.creado ? "OPD hijo creado" : null,
    });
  },

  desplegarSeleccionada() {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) {
      set({ mensaje: "Selecciona un objeto para desplegar" });
      return;
    }
    const entidad = modelo.entidades[seleccionId];
    if (!entidad || entidad.tipo !== "objeto") {
      set({ mensaje: "Selecciona un objeto para desplegar" });
      return;
    }

    const resultado = desplegarObjeto(modelo, opdActivoId, seleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value.modelo, {
      opdActivoId: resultado.value.opdId,
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: resultado.value.creado ? "OPD de despliegue creado" : null,
    });
  },

  quitarDescomposicionSeleccionada() {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) {
      set({ mensaje: "Selecciona un proceso descompuesto" });
      return;
    }
    const entidad = modelo.entidades[seleccionId];
    if (!entidad || entidad.tipo !== "proceso" || entidad.refinamiento?.tipo !== "descomposicion") {
      set({ mensaje: "Selecciona un proceso descompuesto" });
      return;
    }

    const resultado = quitarDescomposicionProceso(modelo, seleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      opdActivoId: opdActivoSeguro(resultado.value, opdActivoId),
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: "Descomposición eliminada",
    });
  },

  quitarDespliegueSeleccionado() {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) {
      set({ mensaje: "Selecciona un objeto desplegado" });
      return;
    }
    const entidad = modelo.entidades[seleccionId];
    if (!entidad || entidad.tipo !== "objeto" || entidad.refinamiento?.tipo !== "despliegue") {
      set({ mensaje: "Selecciona un objeto desplegado" });
      return;
    }

    const resultado = quitarDespliegueObjeto(modelo, seleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      opdActivoId: opdActivoSeguro(resultado.value, opdActivoId),
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: "Despliegue eliminado",
    });
  },

  cambiarOpdActivo(id) {
    const { modelo, opdActivoId } = get();
    if (!modelo.opds[id]) {
      set({ mensaje: `OPD no existe: ${id}` });
      return;
    }
    if (id === opdActivoId) {
      set({ mensaje: null });
      return;
    }
    set({ opdActivoId: id, seleccionId: null, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  seleccionarEntidad(id) {
    const { modelo, modoEnlace, opdActivoId } = get();
    if (!modoEnlace) {
      set({ seleccionId: id, enlaceSeleccionId: null, mensaje: null });
      return;
    }

    const resultado = crearEnlace(modelo, opdActivoId, modoEnlace.origenId, id, modoEnlace.tipo);
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
    const { modelo, seleccionId, modoEnlace } = get();
    const origenId = modoEnlace?.origenId ?? seleccionId;
    if (!origenId || !modelo.entidades[origenId]) {
      set({ mensaje: "Selecciona primero la entidad origen del enlace" });
      return;
    }
    set({ modoEnlace: { tipo, origenId }, mensaje: "Selecciona la entidad destino" });
  },

  cancelarEnlace() {
    set({ modoEnlace: null, mensaje: null });
  },

  deshacer() {
    const { modelo, opdActivoId } = get();
    const previo = undoStack.pop();
    if (!previo) {
      set({ mensaje: "No hay cambios para deshacer", puedeDeshacer: false });
      return;
    }
    redoStack = [modelo, ...redoStack].slice(0, UNDO_LIMIT);
    set(estadoModelo(previo, {
      opdActivoId: opdActivoSeguro(previo, opdActivoId),
      seleccionId: null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: "Cambio deshecho",
    }));
  },

  rehacer() {
    const { modelo, opdActivoId } = get();
    const siguiente = redoStack.shift();
    if (!siguiente) {
      set({ mensaje: "No hay cambios para rehacer", puedeRehacer: false });
      return;
    }
    undoStack = [...undoStack, modelo].slice(-UNDO_LIMIT);
    set(estadoModelo(siguiente, {
      opdActivoId: opdActivoSeguro(siguiente, opdActivoId),
      seleccionId: null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: "Cambio rehecho",
    }));
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

  cambiarModoPlegadoSeleccionado(modo) {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) return;
    const apariencia = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {})
      .find((item) => item.entidadId === seleccionId);
    if (!apariencia) {
      set({ mensaje: "La entidad seleccionada no tiene apariencia en el OPD activo" });
      return;
    }
    const resultado = cambiarModoPlegadoOp(modelo, opdActivoId, apariencia.id, modo);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  cambiarModoPlegadoApariencia(aparienciaId, modo) {
    const { modelo, opdActivoId } = get();
    const resultado = cambiarModoPlegadoOp(modelo, opdActivoId, aparienciaId, modo);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const apariencia = modelo.opds[opdActivoId]?.apariencias[aparienciaId];
    commitModelo(set, modelo, resultado.value, {
      seleccionId: apariencia?.entidadId ?? null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  moverEntidad(id, x, y) {
    const { modelo, opdActivoId } = get();
    const resultado = moverAparienciaEntidad(modelo, opdActivoId, id, { x, y });
    if (resultado.ok) commitModelo(set, modelo, resultado.value);
  },

  moverApariencia(aparienciaId, x, y) {
    const { modelo, opdActivoId } = get();
    const resultado = moverAparienciaPorId(modelo, opdActivoId, aparienciaId, { x, y });
    if (resultado.ok) commitModelo(set, modelo, resultado.value);
  },

  reordenarSubprocesoEnTimeline(opdId, aparienciaId, nuevaY) {
    const { modelo } = get();
    const validado = validarSubprocesoTimeline(modelo, opdId, aparienciaId);
    if (!validado.ok) {
      set({ mensaje: validado.error });
      return;
    }
    if (!Number.isFinite(nuevaY)) {
      set({ mensaje: "Y de timeline inválida" });
      return;
    }
    const { apariencia, contorno } = validado;
    const y = limitar(nuevaY, contorno.y, contorno.y + contorno.height - apariencia.height);
    const resultado = moverAparienciaPorId(modelo, opdId, aparienciaId, { x: apariencia.x, y });
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: apariencia.entidadId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  actualizarVerticesEnlace(aparienciaEnlaceId, vertices) {
    const { modelo, opdActivoId } = get();
    const resultado = actualizarVerticesEnlaceOp(modelo, opdActivoId, aparienciaEnlaceId, vertices);
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
    set(estadoModelo(resultado.value, {
      opdActivoId: resultado.value.opdRaizId,
      seleccionId: null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      modeloPersistidoId: null,
      mensaje: "Modelo importado",
    }));
  },

  listarModelosGuardados() {
    const listado = listarModelosLocales();
    if (!listado.ok) {
      set({ modelosGuardados: [], mensaje: listado.error });
      return;
    }
    set({ modelosGuardados: listado.value });
  },

  guardarLocal() {
    const { modelo, modeloPersistidoId } = get();
    const json = exportarModelo(modelo);
    const guardado = guardarModeloLocal({
      id: modeloPersistidoId,
      nombre: modelo.nombre,
      json,
    });
    if (!guardado.ok) {
      set({ mensaje: guardado.error });
      return;
    }
    snapshotGuardado = json;
    set({
      mensaje: "Modelo guardado exitosamente",
      dirty: false,
      modeloPersistidoId: guardado.value.id,
      modelosGuardados: listarModelosGuardadosSeguro(),
    });
  },

  cargarLocal(id) {
    const modeloId = id ?? get().modelosGuardados[0]?.id ?? listarModelosGuardadosSeguro()[0]?.id;
    if (!modeloId) {
      set({ mensaje: "No hay modelos guardados" });
      return;
    }
    const cargado = cargarModeloLocal(modeloId);
    if (!cargado.ok) {
      set({ mensaje: cargado.error, modelosGuardados: listarModelosGuardadosSeguro() });
      return;
    }
    const resultado = hidratarModelo(cargado.value.json);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    resetHistorial(resultado.value);
    set(estadoModelo(resultado.value, {
      opdActivoId: resultado.value.opdRaizId,
      seleccionId: null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      modeloPersistidoId: cargado.value.id,
      modelosGuardados: listarModelosGuardadosSeguro(),
      mensaje: `Modelo cargado: ${cargado.value.nombre}`,
    }));
  },

  borrarLocal(id) {
    const borrado = borrarModeloLocal(id);
    if (!borrado.ok) {
      set({ mensaje: borrado.error });
      return;
    }
    const extra: Partial<OpmStore> = {
      modelosGuardados: listarModelosGuardadosSeguro(),
      mensaje: "Modelo local borrado",
    };
    if (get().modeloPersistidoId === id) {
      snapshotGuardado = "";
      extra.modeloPersistidoId = null;
      extra.dirty = true;
    }
    set(extra);
  },

  cargarDemo() {
    const modelo = crearDemo();
    resetHistorial(modelo);
    set(estadoModelo(modelo, {
      opdActivoId: modelo.opdRaizId,
      seleccionId: null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      modeloPersistidoId: null,
      mensaje: "Demo cargado",
    }));
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

function posicionLibre(modelo: Modelo, opdId: Id, tipo: "objeto" | "proceso"): Posicion {
  const contenedor = contenedorRefinamiento(modelo, opdId);
  const columnas = contenedor
    ? columnasDentroDe(contenedor, tipo)
    : tipo === "proceso" ? [300, 80, 520, 740] : [80, 300, 520, 740];
  const yInicial = contenedor ? contenedor.y + 68 : 90;
  const yMax = contenedor ? contenedor.y + contenedor.height - CANON.dims.cosaHeight - 24 : Number.POSITIVE_INFINITY;
  const apariencias = Object.values(modelo.opds[opdId]?.apariencias ?? {});
  for (let fila = 0; fila < 20; fila += 1) {
    for (const x of columnas) {
      const candidata = { x, y: yInicial + fila * 88 };
      if (candidata.y > yMax) continue;
      if (!apariencias.some((apariencia) => solapa(candidata, apariencia))) return candidata;
    }
  }
  return { x: columnas[0] ?? 80, y: Math.min(yInicial + apariencias.length * 88, yMax) };
}

function solapa(posicion: Posicion, apariencia: { x: number; y: number; width: number; height: number }): boolean {
  if (esContornoRefinamiento(apariencia)) return false;
  const margen = 18;
  const a = {
    left: posicion.x - margen,
    right: posicion.x + CANON.dims.cosaWidth + margen,
    top: posicion.y - margen,
    bottom: posicion.y + CANON.dims.cosaHeight + margen,
  };
  const b = {
    left: apariencia.x - margen,
    right: apariencia.x + apariencia.width + margen,
    top: apariencia.y - margen,
    bottom: apariencia.y + apariencia.height + margen,
  };
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function contenedorRefinamiento(modelo: Modelo, opdId: Id): { x: number; y: number; width: number; height: number } | null {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return null;
  return Object.values(opd.apariencias).find((apariencia) => {
    const entidad = modelo.entidades[apariencia.entidadId];
    return entidad?.refinamiento?.opdId === opdId;
  }) ?? null;
}

function validarSubprocesoTimeline(
  modelo: Modelo,
  opdId: Id,
  aparienciaId: Id,
): { ok: true; apariencia: Apariencia; contorno: Apariencia } | { ok: false; error: string } {
  const opd = modelo.opds[opdId];
  if (!opd) return { ok: false, error: `OPD no existe: ${opdId}` };
  if (!opd.padreId || !modelo.opds[opd.padreId]) {
    return { ok: false, error: "Timeline disponible sólo en OPDs hijos" };
  }
  const contorno = Object.values(opd.apariencias).find((apariencia) => {
    const entidad = modelo.entidades[apariencia.entidadId];
    return entidad?.tipo === "proceso" && entidad.refinamiento?.tipo === "descomposicion" && entidad.refinamiento.opdId === opdId;
  });
  if (!contorno) return { ok: false, error: "Timeline requiere una descomposición de proceso activa" };
  const apariencia = opd.apariencias[aparienciaId];
  if (!apariencia) return { ok: false, error: `Apariencia no existe: ${aparienciaId}` };
  const entidad = modelo.entidades[apariencia.entidadId];
  if (!entidad || entidad.tipo !== "proceso" || apariencia.entidadId === contorno.entidadId) {
    return { ok: false, error: "Timeline sólo reordena subprocesos internos" };
  }
  if (!dentroDeApariencia(apariencia, contorno)) {
    return { ok: false, error: "El subproceso no pertenece al contorno de descomposición" };
  }
  return { ok: true, apariencia, contorno };
}

function dentroDeApariencia(apariencia: Apariencia, contorno: Apariencia): boolean {
  return (
    apariencia.x >= contorno.x &&
    apariencia.y >= contorno.y &&
    apariencia.x + apariencia.width <= contorno.x + contorno.width &&
    apariencia.y + apariencia.height <= contorno.y + contorno.height
  );
}

function limitar(valor: number, minimo: number, maximo: number): number {
  return Math.max(minimo, Math.min(maximo, valor));
}

function columnasDentroDe(
  contenedor: { x: number; width: number },
  tipo: "objeto" | "proceso",
): number[] {
  const left = contenedor.x + 36;
  const center = contenedor.x + Math.max(36, (contenedor.width - CANON.dims.cosaWidth) / 2);
  const right = contenedor.x + contenedor.width - CANON.dims.cosaWidth - 36;
  return tipo === "proceso" ? [center, left, right] : [left, center, right];
}

function esContornoRefinamiento(apariencia: { width: number; height: number }): boolean {
  return apariencia.width > CANON.dims.cosaWidth || apariencia.height > CANON.dims.cosaHeight;
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

function listarModelosGuardadosSeguro(): ResumenModeloPersistido[] {
  const listado = listarModelosLocales();
  return listado.ok ? listado.value : [];
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

function opdActivoSeguro(modelo: Modelo, opdActivoId: Id): Id {
  return modelo.opds[opdActivoId] ? opdActivoId : modelo.opdRaizId;
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
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, sistema, rescate, "efecto"));
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
