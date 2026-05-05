import { esDesignacionEstado } from "../modelo/estadosDesignaciones";
import { esUnidadTiempo, validarDuracion } from "../modelo/objetoDuracion";
import type {
  DesignacionEstado,
  DuracionTemporal,
  Entidad,
  Estado,
  Id,
  Resultado,
} from "../modelo/tipos";
import { fallo, ok, esNumeroFinito, esRecord } from "./validarHelpers";

/**
 * Validadores para estados, designaciones y duracion temporal.
 *
 * Consumidores conocidos: `serializacion/json.ts`. Anclaje: SSOT OPM ISO
 * 19450 §3.68 estado, §3.71a designacion y §3.45 estado-funcion.
 */

export function validarEstados(value: unknown, entidades: Record<Id, Entidad>): Resultado<Record<Id, Estado>> {
  if (value === undefined) return ok({});
  if (!esRecord(value)) return fallo("Modelo inválido: estados");

  const estados: Record<Id, Estado> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw)) return fallo(`Estado inválido: ${id}`);
    if (raw.id !== id) return fallo(`Estado inválido: ${id}.id`);
    if (typeof raw.entidadId !== "string") return fallo(`Estado inválido: ${id}.entidadId`);
    const entidad = entidades[raw.entidadId];
    if (!entidad) return fallo(`Estado inválido: ${id}.entidadId`);
    if (entidad.tipo !== "objeto") return fallo(`Estado inválido: ${id}.entidadId`);
    if (typeof raw.nombre !== "string" || raw.nombre.trim().length === 0) {
      return fallo(`Estado inválido: ${id}.nombre`);
    }
    if (raw.esInicial !== undefined && typeof raw.esInicial !== "boolean") {
      return fallo(`Estado inválido: ${id}.esInicial`);
    }
    if (raw.esFinal !== undefined && typeof raw.esFinal !== "boolean") {
      return fallo(`Estado inválido: ${id}.esFinal`);
    }
    const designaciones = validarDesignacionesEstado(id, raw.designaciones);
    if (!designaciones.ok) return designaciones;
    const duracion = validarDuracionEstado(id, raw.duracion);
    if (!duracion.ok) return duracion;
    if (raw.suprimido !== undefined && typeof raw.suprimido !== "boolean") {
      return fallo(`Estado inválido: ${id}.suprimido`);
    }
    estados[id] = {
      id,
      entidadId: raw.entidadId,
      nombre: raw.nombre.trim(),
      ...(raw.esInicial ? { esInicial: true } : {}),
      ...(raw.esFinal ? { esFinal: true } : {}),
      ...(designaciones.value.length > 0 ? { designaciones: designaciones.value } : {}),
      ...(duracion.value ? { duracion: duracion.value } : {}),
      ...(raw.suprimido ? { suprimido: true } : {}),
    };
  }

  for (const entidad of Object.values(entidades).filter((item) => item.tipo === "objeto")) {
    const estadosObjeto = Object.values(estados).filter((estado) => estado.entidadId === entidad.id);
    if (estadosObjeto.length === 1) return fallo(`Estado inválido: ${entidad.id}.axioma`);
    const nombres = new Set<string>();
    for (const estado of estadosObjeto) {
      const normalizado = estado.nombre.toLocaleLowerCase("es");
      if (nombres.has(normalizado)) return fallo(`Estado inválido: ${entidad.id}.nombre`);
      nombres.add(normalizado);
    }
    if (estadosObjeto.filter((estado) => estado.designaciones?.includes("default")).length > 1) {
      return fallo(`Estado inválido: ${entidad.id}.default`);
    }
    if (estadosObjeto.filter((estado) => estado.designaciones?.includes("current")).length > 1) {
      return fallo(`Estado inválido: ${entidad.id}.current`);
    }
  }

  return ok(estados);
}

export function validarDesignacionesEstado(estadoId: Id, value: unknown): Resultado<DesignacionEstado[]> {
  if (value === undefined) return ok([]);
  if (!Array.isArray(value)) return fallo(`Estado inválido: ${estadoId}.designaciones`);
  const designaciones = value.filter(esDesignacionEstado);
  if (designaciones.length !== value.length) return fallo(`Estado inválido: ${estadoId}.designaciones`);
  if (new Set(designaciones).size !== designaciones.length) return fallo(`Estado inválido: ${estadoId}.designaciones`);
  if (designaciones.includes("default") && designaciones.includes("current")) {
    return fallo(`Estado inválido: ${estadoId}.designaciones`);
  }
  return ok(designaciones);
}

export function validarDuracionEstado(estadoId: Id, value: unknown): Resultado<DuracionTemporal | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo(`Estado inválido: ${estadoId}.duracion`);
  if (!esUnidadTiempo(value.unidad)) return fallo(`Estado inválido: ${estadoId}.duracion.unidad`);
  if (!esNumeroFinito(value.min)) return fallo(`Estado inválido: ${estadoId}.duracion.min`);
  if (!esNumeroFinito(value.nominal)) return fallo(`Estado inválido: ${estadoId}.duracion.nominal`);
  if (!esNumeroFinito(value.max)) return fallo(`Estado inválido: ${estadoId}.duracion.max`);
  const duracion: DuracionTemporal = {
    unidad: value.unidad,
    min: value.min,
    nominal: value.nominal,
    max: value.max,
  };
  const validada = validarDuracion(duracion);
  if (!validada.ok) return fallo(`Estado inválido: ${estadoId}.duracion`);
  return ok(duracion);
}
