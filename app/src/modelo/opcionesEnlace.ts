import {
  entidadDeExtremo,
  mismoExtremo,
  normalizarExtremo,
  type ExtremoEntrada,
} from "./extremos";
import { validarFirmaEnlace } from "./operaciones/helpers";
import type { Entidad, ExtremoEnlace, Modelo, TipoEnlace } from "./tipos";

export type DireccionEvaluacionEnlace = "saliente" | "entrante";

export const TIPOS_ENLACE_CANONICOS = [
  "agregacion",
  "exhibicion",
  "generalizacion",
  "clasificacion",
  "etiquetado",
  "etiquetadoBidireccional",
  "agente",
  "instrumento",
  "consumo",
  "resultado",
  "efecto",
  "invocacion",
  "excepcionSobretiempo",
  "excepcionSubtiempo",
  "excepcionSubSobretiempo",
] as const satisfies readonly TipoEnlace[];

export interface EvaluacionTipoEnlace {
  tipo: TipoEnlace;
  permitido: boolean;
  origen: Entidad | null;
  destino: Entidad | null;
  origenExtremo: ExtremoEnlace;
  destinoExtremo: ExtremoEnlace;
  motivo?: string;
}

/**
 * Evalua preventivamente todos los tipos candidatos contra la misma firma
 * canonica que usa `crearEnlace`. La UI puede filtrar o explicar sin abrir
 * una segunda fuente de verdad semantica.
 */
export function evaluarTiposEnlacePermitidos(
  modelo: Modelo,
  origenEntrada: ExtremoEntrada,
  destinoEntrada: ExtremoEntrada,
  direccion: DireccionEvaluacionEnlace = "saliente",
  tipos: readonly TipoEnlace[] = TIPOS_ENLACE_CANONICOS,
): EvaluacionTipoEnlace[] {
  const origenOriginal = normalizarExtremo(origenEntrada);
  const destinoOriginal = normalizarExtremo(destinoEntrada);
  const origenExtremo = direccion === "saliente" ? origenOriginal : destinoOriginal;
  const destinoExtremo = direccion === "saliente" ? destinoOriginal : origenOriginal;
  const origen = entidadDeExtremo(modelo, origenExtremo) ?? null;
  const destino = entidadDeExtremo(modelo, destinoExtremo) ?? null;

  if (!origen || !destino) {
    return tipos.map((tipo) => ({
      tipo,
      permitido: false,
      origen,
      destino,
      origenExtremo,
      destinoExtremo,
      motivo: "El enlace requiere extremos existentes",
    }));
  }

  if (mismoExtremo(origenExtremo, destinoExtremo)) {
    return tipos.map((tipo) => ({
      tipo,
      permitido: false,
      origen,
      destino,
      origenExtremo,
      destinoExtremo,
      motivo: "El enlace requiere dos extremos distintos",
    }));
  }

  return tipos.map((tipo) => {
    const firma = validarFirmaEnlace(tipo, origen, destino, {
      origen: origenExtremo,
      destino: destinoExtremo,
    });
    return {
      tipo,
      permitido: firma.ok,
      origen,
      destino,
      origenExtremo,
      destinoExtremo,
      ...(firma.ok ? {} : { motivo: firma.error }),
    };
  });
}

export function tiposEnlacePermitidos(
  modelo: Modelo,
  origenEntrada: ExtremoEntrada,
  destinoEntrada: ExtremoEntrada,
  direccion: DireccionEvaluacionEnlace = "saliente",
  tipos: readonly TipoEnlace[] = TIPOS_ENLACE_CANONICOS,
): TipoEnlace[] {
  return evaluarTiposEnlacePermitidos(modelo, origenEntrada, destinoEntrada, direccion, tipos)
    .filter((evaluacion) => evaluacion.permitido)
    .map((evaluacion) => evaluacion.tipo);
}

export function resumirMotivosTiposNoPermitidos(evaluaciones: readonly EvaluacionTipoEnlace[]): string {
  const motivos = new Set(
    evaluaciones
      .filter((evaluacion) => !evaluacion.permitido && evaluacion.motivo)
      .map((evaluacion) => evaluacion.motivo!),
  );
  return [...motivos].join(" · ");
}
