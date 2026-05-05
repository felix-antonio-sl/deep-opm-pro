import type { DuracionTemporal, Id, Modelo, Resultado, UnidadTiempo } from "./tipos";

export const UNIDADES_TIEMPO: readonly UnidadTiempo[] = ["ms", "s", "min", "h", "dia", "sem", "mes", "año"] as const;

export function fijarDuracion(modelo: Modelo, estadoId: Id, duracion: DuracionTemporal): Resultado<Modelo> {
  const validacion = validarDuracion(duracion);
  if (!validacion.ok) return validacion;
  const estado = modelo.estados[estadoId];
  if (!estado) return fallo(`Estado no existe: ${estadoId}`);
  return ok({
    ...modelo,
    estados: {
      ...modelo.estados,
      [estadoId]: { ...estado, duracion },
    },
  });
}

export function quitarDuracion(modelo: Modelo, estadoId: Id): Resultado<Modelo> {
  const estado = modelo.estados[estadoId];
  if (!estado) return fallo(`Estado no existe: ${estadoId}`);
  if (!estado.duracion) return ok(modelo);
  const actualizado = { ...estado };
  delete actualizado.duracion;
  return ok({
    ...modelo,
    estados: {
      ...modelo.estados,
      [estadoId]: actualizado,
    },
  });
}

export function validarDuracion(duracion: DuracionTemporal): Resultado<void> {
  if (!esUnidadTiempo(duracion.unidad)) return fallo("Unidad de duración inválida");
  if (![duracion.min, duracion.nominal, duracion.max].every((valor) => typeof valor === "number" && Number.isFinite(valor))) {
    return fallo("La duración requiere valores numéricos finitos");
  }
  if (duracion.min < 0) return fallo("La duración mínima no puede ser negativa");
  if (duracion.min > duracion.nominal) return fallo("La duración mínima no puede superar la nominal");
  if (duracion.nominal > duracion.max) return fallo("La duración nominal no puede superar la máxima");
  return ok(undefined);
}

export function esUnidadTiempo(value: unknown): value is UnidadTiempo {
  return typeof value === "string" && (UNIDADES_TIEMPO as readonly string[]).includes(value);
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
