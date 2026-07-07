import { crearModelo } from "../modelo/operaciones";
import type { Id, Modelo, OrigenPestana, Pestana, PestanaId, Resultado } from "../modelo/tipos";
import { exportarModelo } from "../serializacion/json";

export interface EstadoPestanas {
  pestanas: Pestana[];
  activa: PestanaId;
}

/**
 * Identidad UNIFICADA del modelo en pestaña. Fuente única para etiqueta de
 * pestaña, header y otras superficies que muestren "qué modelo estás
 * editando".
 *
 * Corte 3.5 sustracción de chrome: la etiqueta retorna SOLO el nombre real
 * del modelo (o "Modelo" como placeholder cuando no hay nombre). El estado
 * de persistencia y dirty vive exclusivamente en `ChipPersistencia`, no se
 * duplica en el label de la pestaña.
 */
export function etiquetaPestana(opts: { nombre: string | undefined; modeloId: Id | null }): string {
  const nombre = (opts.nombre ?? "").trim();
  if (opts.modeloId) return nombre || "Modelo";
  return nombre || "Modelo";
}

export function crearPestanaNueva(opts: { etiqueta?: string; modelo?: Modelo } = {}): Pestana {
  const modelo = clonarModelo(opts.modelo ?? crearModelo("Modelo"));
  return crearPestanaBase(modelo, {
    etiqueta: opts.etiqueta ?? etiquetaPestana({ nombre: modelo.nombre, modeloId: null }),
    modeloId: null,
    cargadoDesde: "nuevo",
    dirty: false,
  });
}

export function crearPestanaDesdeModelo(
  modelo: Modelo,
  opts: { modeloId: Id | null; nombre: string; cargadoDesde?: OrigenPestana; dirty?: boolean; descripcion?: string },
): Pestana {
  const base = {
    etiqueta: etiquetaPestana({ nombre: opts.nombre, modeloId: opts.modeloId }),
    modeloId: opts.modeloId,
    cargadoDesde: opts.cargadoDesde ?? (opts.modeloId ? "persistido" : "importado"),
    dirty: opts.dirty ?? false,
    ...(opts.descripcion !== undefined ? { descripcionModeloLocal: opts.descripcion } : {}),
  };
  return crearPestanaBase(clonarModelo(modelo), base);
}

export function abrirPestana(estado: EstadoPestanas, pestana: Pestana): EstadoPestanas {
  return {
    pestanas: [...estado.pestanas, pestana],
    activa: pestana.id,
  };
}

export function cerrarPestana(
  estado: EstadoPestanas,
  id: PestanaId,
  opts: { forzar?: boolean } = {},
): Resultado<EstadoPestanas> {
  if (estado.pestanas.length <= 1) return fallo("No se puede cerrar la ultima pestana");
  const indice = estado.pestanas.findIndex((pestana) => pestana.id === id);
  if (indice < 0) return ok(estado);
  const pestana = estado.pestanas[indice];
  if (pestana?.dirty && !opts.forzar) return fallo("Pestana sin guardar");
  const pestanas = estado.pestanas.filter((item) => item.id !== id);
  if (estado.activa !== id) return ok({ pestanas, activa: estado.activa });
  const siguiente = pestanas[Math.min(indice, pestanas.length - 1)] ?? pestanas[pestanas.length - 1];
  return ok({ pestanas, activa: siguiente?.id ?? pestanas[0]!.id });
}

export function cambiarActiva(estado: EstadoPestanas, id: PestanaId): EstadoPestanas {
  if (!estado.pestanas.some((pestana) => pestana.id === id)) return estado;
  return { ...estado, activa: id };
}

export function reordenarPestanas(estado: EstadoPestanas, idsOrdenados: PestanaId[]): Resultado<EstadoPestanas> {
  if (idsOrdenados.length !== estado.pestanas.length) return fallo("Orden de pestanas invalido");
  const esperados = new Set(estado.pestanas.map((pestana) => pestana.id));
  const vistos = new Set(idsOrdenados);
  if (vistos.size !== idsOrdenados.length) return fallo("Orden de pestanas invalido");
  if (idsOrdenados.some((id) => !esperados.has(id))) return fallo("Orden de pestanas invalido");
  const porId = new Map(estado.pestanas.map((pestana) => [pestana.id, pestana]));
  return ok({
    pestanas: idsOrdenados.map((id) => porId.get(id)!),
    activa: estado.activa,
  });
}

export function actualizarEtiquetaPestana(estado: EstadoPestanas, id: PestanaId, etiqueta: string): EstadoPestanas {
  const limpia = etiqueta.trim() || "Modelo";
  return {
    ...estado,
    pestanas: estado.pestanas.map((pestana) => pestana.id === id ? { ...pestana, etiqueta: limpia } : pestana),
  };
}

/**
 * Reconcilia la etiqueta de una pestaña con el estado actual del modelo
 * (nombre + persistencia). Útil cuando el nombre del modelo cambia tras
 * importar JSON, cargar fixture, renombrar o guardar.
 */
export function reconciliarEtiquetaPestana(pestana: Pestana, modelo: Modelo, modeloId: Id | null): Pestana {
  const etiqueta = etiquetaPestana({ nombre: modelo.nombre, modeloId });
  if (pestana.etiqueta === etiqueta) return pestana;
  return { ...pestana, etiqueta };
}

export function duplicarPestana(estado: EstadoPestanas, id: PestanaId): Resultado<EstadoPestanas> {
  const origen = estado.pestanas.find((pestana) => pestana.id === id);
  if (!origen) return fallo("Pestana no existe");
  // P0-1: la copia toma el nombre real del modelo origen, no un placeholder.
  // Resulta en "System Diagram (No guardado)" en vez de "Modelo (No
  // guardado)" — el operador sabe qué duplicó.
  const copia = crearPestanaDesdeModelo(origen.modelo, {
    modeloId: null,
    nombre: origen.modelo.nombre,
    cargadoDesde: origen.cargadoDesde,
    dirty: true,
  });
  return ok(abrirPestana(estado, copia));
}

export function clonarModelo(modelo: Modelo): Modelo {
  if (typeof structuredClone === "function") return structuredClone(modelo);
  return JSON.parse(JSON.stringify(modelo)) as Modelo;
}

function crearPestanaBase(
  modelo: Modelo,
  opts: {
    etiqueta: string;
    modeloId: Id | null;
    cargadoDesde: OrigenPestana;
    dirty: boolean;
    descripcionModeloLocal?: string;
  },
): Pestana {
  return {
    id: generarIdPestana(),
    etiqueta: opts.etiqueta,
    modeloId: opts.modeloId,
    modelo,
    cargadoDesde: opts.cargadoDesde,
    dirty: opts.dirty,
    historialUndo: [],
    cursorUndo: 0,
    vistaMapaActivaPestana: false,
    snapshotJson: exportarModelo(modelo),
    ...(opts.descripcionModeloLocal !== undefined ? { descripcionModeloLocal: opts.descripcionModeloLocal } : {}),
  };
}

function generarIdPestana(): PestanaId {
  if (typeof globalThis.crypto?.randomUUID === "function") return `pestana-${globalThis.crypto.randomUUID()}`;
  return `pestana-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo<T = never>(error: string): Resultado<T> {
  return { ok: false, error };
}


import type { CrearSlice, PestanasSlice } from "./tipos";
import { activarEstadoPestanas, activarPestanaNueva, conBaseRevision, estadoModelo, resetHistorial } from "./runtime";
import { cargarModeloBackend, persistenciaBackendHabilitada } from "../persistencia/backend";
import { workspaceDesdeModelo } from "../persistencia/workspace";
import { hidratarModelo } from "../serializacion/json";

const pestanaInicial = crearPestanaNueva();
const cerrarPestanaEstado = cerrarPestana;
const cambiarPestanaActivaEstado = cambiarActiva;
const reordenarPestanasEstado = reordenarPestanas;
const duplicarPestanaEstado = duplicarPestana;

export const createPestanasSlice: CrearSlice<PestanasSlice> = (set, get) => ({
  pestanasAbiertas: [pestanaInicial],
  pestanaActivaId: pestanaInicial.id,

  abrirPestanaNueva() {
    const pestana = crearPestanaNueva();
    activarPestanaNueva(set, get, pestana, "Nueva pestana");
    get().gobernarAperturaBiblioteca(false);
  },

  abrirPestanaImportandoJson(json) {
    const resultado = hidratarModelo(json);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    // P0-1: identidad de modelo unificada. La pestaña adopta el nombre real
    // del JSON importado (no "Modelo (No guardado)") para que header,
    // pestana y selector cuenten la misma historia desde el primer paint.
    const pestana = crearPestanaDesdeModelo(resultado.value, {
      modeloId: null,
      nombre: resultado.value.nombre,
      cargadoDesde: "importado",
      dirty: false,
    });
    activarPestanaNueva(set, get, pestana, "Modelo importado en pestana");
    get().gobernarAperturaBiblioteca(false);
  },

  abrirPestanaConModelo(modeloId) {
    if (persistenciaBackendHabilitada()) {
      set({ mensaje: "Cargando modelo desde servidor..." });
      void cargarModeloBackend(modeloId).then((cargado) => {
        if (!cargado.ok) {
          set({ mensaje: cargado.error });
          return;
        }
        const resultado = hidratarModelo(cargado.value.json);
        if (!resultado.ok) {
          set({ mensaje: resultado.error });
          return;
        }
        const pestana = crearPestanaDesdeModelo(resultado.value, {
          modeloId: cargado.value.id,
          nombre: cargado.value.nombre,
          cargadoDesde: "persistido",
          dirty: false,
          descripcion: cargado.value.descripcion,
        });
        activarPestanaNueva(set, get, pestana, `Modelo abierto en pestana: ${cargado.value.nombre}`);
        // A′-vitrina: la base = revisión con que abro este modelo en pestaña.
        set({ revisionBasePorModelo: conBaseRevision(get().revisionBasePorModelo, cargado.value.id, cargado.value.revision) });
        // B5: abrir una biblioteca en pestaña la pone en solo-lectura + cinta.
        get().gobernarAperturaBiblioteca(cargado.value.esBiblioteca === true);
      });
      return;
    }
    set({ mensaje: "Backend de modelos no disponible" });
  },

  duplicarPestana(id) {
    const resultado = duplicarPestanaEstado({ pestanas: get().pestanasAbiertas, activa: get().pestanaActivaId }, id);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    activarEstadoPestanas(set, resultado.value, "Pestana duplicada");
  },

  cerrarPestana(id, opts) {
    const resultado = cerrarPestanaEstado({ pestanas: get().pestanasAbiertas, activa: get().pestanaActivaId }, id, opts);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    activarEstadoPestanas(set, resultado.value, "Pestana cerrada");
  },

  cambiarPestanaActiva(id) {
    const actual = cambiarPestanaActivaEstado({ pestanas: get().pestanasAbiertas, activa: get().pestanaActivaId }, id);
    activarEstadoPestanas(set, actual, null);
    // Re-gobierna la solo-lectura POR PESTAÑA: si el modelo activado es una biblioteca
    // (según el índice), entra en solo-lectura; si no, queda editable. Sin esto, cambiar
    // entre una pestaña-biblioteca y un modelo normal arrastraría el `readOnly` de la
    // pestaña previa (B5 lo dejó como deuda; aquí se resuelve sin tocar `PestanaAbierta`).
    const modeloActivoId = get().modelo.id;
    const esBiblioteca = get().indice.modelos.some((m) => m.id === modeloActivoId && m.esBiblioteca === true);
    get().gobernarAperturaBiblioteca(esBiblioteca);
  },

  reordenarPestanas(idsOrdenados) {
    const resultado = reordenarPestanasEstado({ pestanas: get().pestanasAbiertas, activa: get().pestanaActivaId }, idsOrdenados);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    set({ pestanasAbiertas: resultado.value.pestanas, mensaje: null });
  },

  renombrarPestana(id, etiqueta) {
    set({
      pestanasAbiertas: get().pestanasAbiertas.map((pestana) => (
        pestana.id === id ? { ...pestana, etiqueta: etiqueta.trim() || "Modelo" } : pestana
      )),
      mensaje: null,
    });
  }
});
