import type {
  Afiliacion,
  Esencia,
  ExtremoKind,
  ModoDespliegueObjeto,
  OperadorAbanico,
  TipoEnlace,
  TipoEntidad,
} from "../modelo/tipos";

/**
 * Type guards puros para el JSON OPM.
 *
 * Consumidores conocidos: validadores de serializacion y barrel
 * `serializacion/json.ts`. Anclaje: SSOT OPM ISO 19450 §3.36 enlace,
 * §3.39 objeto, §3.58 proceso, §3.68 estado y §Cardinalidades.
 */

export function esRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function esExtremoKind(value: unknown): value is ExtremoKind {
  return value === "entidad" || value === "estado";
}

export function esTipoEntidad(value: unknown): value is TipoEntidad {
  return value === "objeto" || value === "proceso";
}

export function esEsencia(value: unknown): value is Esencia {
  return value === "informacional" || value === "fisica";
}

export function esAfiliacion(value: unknown): value is Afiliacion {
  return value === "sistemica" || value === "ambiental";
}

export function esTipoEnlace(value: unknown): value is TipoEnlace {
  return (
    value === "agregacion" ||
    value === "exhibicion" ||
    value === "generalizacion" ||
    value === "clasificacion" ||
    value === "agente" ||
    value === "instrumento" ||
    value === "consumo" ||
    value === "resultado" ||
    value === "efecto" ||
    value === "invocacion"
  );
}

export function esOperadorAbanico(value: unknown): value is OperadorAbanico {
  return value === "O" || value === "XOR";
}

export function esModoDespliegue(value: unknown): value is ModoDespliegueObjeto {
  return value === "agregacion" || value === "exhibicion" || value === "generalizacion" || value === "clasificacion";
}

export function esNumeroFinito(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function esNumeroPositivo(value: unknown): value is number {
  return esNumeroFinito(value) && value > 0;
}

export function esEnteroSeguro(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value);
}
