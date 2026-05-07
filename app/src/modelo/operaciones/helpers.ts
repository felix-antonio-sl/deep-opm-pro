import { naturalezaDeEnlace } from "../constantes";
import { extremoEntidad } from "../extremos";
import type { Entidad, ExtremoEnlace, Id, Modelo, Opd, Resultado, TipoEnlace } from "../tipos";

/**
 * Helpers compartidos entre los sub-archivos de `modelo/operaciones/`.
 * Solo `validarFirmaEnlace` se re-exporta desde el barrel `operaciones.ts` por ser API pública;
 * el resto son helpers privados al subdirectorio.
 *
 * Refs: SSOT opm-iso-19450-es.md (firmas de enlace),
 *       opm-extracted/src/app/models/components/commands/edit-alias.ts:5-30 (patrón comando puro).
 */

export function siguienteId(modelo: Modelo, prefijo: string): Id {
  return `${prefijo}-${modelo.nextSeq}`;
}

export function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

export function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}

export function entidadVisibleEnOpd(opd: Opd, entidadId: Id): boolean {
  return Object.values(opd.apariencias).some((apariencia) => apariencia.entidadId === entidadId);
}

export function validarFirmaEnlace(
  tipo: TipoEnlace,
  origen: Entidad,
  destino: Entidad,
  extremos: { origen?: ExtremoEnlace; destino?: ExtremoEnlace } = {},
): Resultado<true> {
  const origenExtremo = extremos.origen ?? extremoEntidad(origen.id);
  const destinoExtremo = extremos.destino ?? extremoEntidad(destino.id);
  const tieneEstado = origenExtremo.kind === "estado" || destinoExtremo.kind === "estado";
  if (tieneEstado && naturalezaDeEnlace(tipo) === "estructural") {
    return fallo("Los enlaces estructurales no aceptan extremos Estado [V-237][V-239]");
  }
  if (tipo === "agregacion") {
    return origen.tipo === destino.tipo
      ? ok(true)
      : fallo("Agregación requiere entidades de la misma clase OPM");
  }
  if (tipo === "exhibicion") {
    return ok(true);
  }
  if (tipo === "generalizacion") {
    return origen.tipo === destino.tipo
      ? ok(true)
      : fallo("Generalización requiere entidades de la misma clase OPM");
  }
  if (tipo === "clasificacion") {
    return origen.tipo === destino.tipo
      ? ok(true)
      : fallo("Clasificación requiere entidades de la misma clase OPM");
  }
  if (tipo === "agente") {
    return origen.tipo === "objeto" && destino.tipo === "proceso" && origen.esencia === "fisica"
      ? ok(true)
      : fallo("Agente requiere Objeto físico -> Proceso");
  }
  if (tipo === "instrumento") {
    return origen.tipo === "objeto" && destino.tipo === "proceso"
      ? ok(true)
      : fallo("Instrumento requiere Objeto -> Proceso");
  }
  if (tipo === "consumo") {
    return origen.tipo === "objeto" && destino.tipo === "proceso"
      ? ok(true)
      : fallo("Consumo requiere Objeto -> Proceso");
  }
  if (tipo === "resultado") {
    return origen.tipo === "proceso" && destino.tipo === "objeto"
      ? ok(true)
      : fallo("Resultado requiere Proceso -> Objeto");
  }
  if (tipo === "efecto") {
    return origen.tipo !== destino.tipo && (origen.tipo === "objeto" || destino.tipo === "objeto")
      ? ok(true)
      : fallo("Efecto requiere Objeto <-> Proceso");
  }
  if (tipo === "invocacion") {
    return origen.tipo === "proceso" && destino.tipo === "proceso"
      ? ok(true)
      : fallo("Invocación requiere Proceso -> Proceso");
  }
  return fallo(`Tipo de enlace no soportado: ${tipo satisfies never}`);
}
