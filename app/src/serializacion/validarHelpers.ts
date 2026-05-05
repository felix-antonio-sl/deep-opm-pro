import type { Resultado } from "../modelo/tipos";

/**
 * Helpers transversales minimos de serializacion.
 *
 * Consumidores conocidos: validadores de dominio y `serializacion/json.ts`.
 * Los guards viven en `validarGuards.ts`; normalizacion e integridad quedan
 * separadas para no recrear el monolito anterior.
 */

export * from "./validarGuards";

export function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

export function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
