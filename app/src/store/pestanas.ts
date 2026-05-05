import { crearModelo } from "../modelo/operaciones";
import type { Id, Modelo, OrigenPestana, Pestana, PestanaId, Resultado } from "../modelo/tipos";
import { exportarModelo } from "../serializacion/json";

export interface EstadoPestanas {
  pestanas: Pestana[];
  activa: PestanaId;
}

export function crearPestanaNueva(opts: { etiqueta?: string; modelo?: Modelo } = {}): Pestana {
  const modelo = clonarModelo(opts.modelo ?? crearModelo("Modelo"));
  return crearPestanaBase(modelo, {
    etiqueta: opts.etiqueta ?? "Modelo (No guardado)",
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
    etiqueta: opts.modeloId ? (opts.nombre.trim() || "Modelo (No guardado)") : "Modelo (No guardado)",
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
  const limpia = etiqueta.trim() || "Modelo (No guardado)";
  return {
    ...estado,
    pestanas: estado.pestanas.map((pestana) => pestana.id === id ? { ...pestana, etiqueta: limpia } : pestana),
  };
}

export function duplicarPestana(estado: EstadoPestanas, id: PestanaId): Resultado<EstadoPestanas> {
  const origen = estado.pestanas.find((pestana) => pestana.id === id);
  if (!origen) return fallo("Pestana no existe");
  const copia = crearPestanaDesdeModelo(origen.modelo, {
    modeloId: null,
    nombre: "Modelo (No guardado)",
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
