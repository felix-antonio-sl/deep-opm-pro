import { esEnlaceEstructuralFundamental, esEnlaceExcepcionTemporal } from "../constantes";
import { extremoEntidad } from "../extremos";
import { entidadVisibleEnOpd } from "../politicaApariciones";
import type { Entidad, ExtremoEnlace, Id, Modelo, Resultado, TipoEnlace } from "../tipos";

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

export { entidadVisibleEnOpd };

export function validarFirmaEnlace(
  tipo: TipoEnlace,
  origen: Entidad,
  destino: Entidad,
  extremos: { origen?: ExtremoEnlace; destino?: ExtremoEnlace } = {},
): Resultado<true> {
  const origenExtremo = extremos.origen ?? extremoEntidad(origen.id);
  const destinoExtremo = extremos.destino ?? extremoEntidad(destino.id);
  const tieneEstado = origenExtremo.kind === "estado" || destinoExtremo.kind === "estado";
  if (tieneEstado && esEnlaceEstructuralFundamental(tipo)) {
    return fallo("Los enlaces estructurales no aceptan extremos Estado [V-237][V-239]");
  }
  if (tipo === "etiquetado") {
    return ok(true);
  }
  if (tipo === "etiquetadoBidireccional") {
    return destinoExtremo.kind === "estado" && origenExtremo.kind !== "estado"
      ? fallo("El etiquetado bidireccional no admite estado solo en destino [V-30]")
      : ok(true);
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
    if (origen.tipo === "proceso" && destino.tipo === "objeto") return ok(true);
    if (origenExtremo.kind === "estado" && origen.tipo === "objeto" && destino.tipo === "proceso") return ok(true);
    return fallo("Efecto requiere Proceso -> Objeto; usa Estado -> Proceso solo para efecto de entrada");
  }
  if (tipo === "invocacion") {
    return origen.tipo === "proceso" && destino.tipo === "proceso"
      ? ok(true)
      : fallo("Invocación requiere Proceso -> Proceso");
  }
  if (esEnlaceExcepcionTemporal(tipo)) {
    if (tieneEstado) return fallo("Los enlaces de excepción temporal conectan Proceso -> Proceso, sin extremos Estado [opm-visual-es §4.4]");
    return origen.tipo === "proceso" && destino.tipo === "proceso"
      ? ok(true)
      : fallo("Excepción temporal requiere Proceso fuente -> Proceso de manejo [opm-iso-19450-es §Enlaces de excepción]");
  }
  return fallo(`Tipo de enlace no soportado: ${tipo satisfies never}`);
}
