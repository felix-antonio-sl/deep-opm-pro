import { esColorEstilo, normalizarEstiloApariencia } from "../modelo/estilos";
import type {
  Apariencia,
  AparienciaEnlace,
  Entidad,
  Id,
  ModoPlegado,
  OrdenPartesPlegado,
  Resultado,
} from "../modelo/tipos";
import { fallo, ok, esNumeroFinito, esNumeroPositivo, esRecord } from "./validarHelpers";

/**
 * Validadores para apariencias visuales de cosas y enlaces.
 *
 * Consumidores conocidos: `validarOpds.ts`. Anclaje: SSOT OPM ISO 19450
 * §Gestion de contexto y refinamiento: despliegue/plegado, y OPCloud
 * serializa visual elements por OPD en
 * `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/json.model.ts:82`.
 */

export function validarApariencias(
  opdId: Id,
  value: Record<string, unknown>,
  entidades: Record<Id, Entidad>,
): Resultado<Record<Id, Apariencia>> {
  const apariencias: Record<Id, Apariencia> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw)) return fallo(`Apariencia inválida: ${id}`);
    if (raw.id !== id) return fallo(`Apariencia inválida: ${id}.id`);
    if (raw.opdId !== opdId) return fallo(`Apariencia inválida: ${id}.opdId`);
    if (typeof raw.entidadId !== "string" || !entidades[raw.entidadId]) {
      return fallo(`Apariencia inválida: ${id}.entidadId`);
    }
    if (!esNumeroFinito(raw.x)) return fallo(`Apariencia inválida: ${id}.x`);
    if (!esNumeroFinito(raw.y)) return fallo(`Apariencia inválida: ${id}.y`);
    if (!esNumeroPositivo(raw.width)) return fallo(`Apariencia inválida: ${id}.width`);
    if (!esNumeroPositivo(raw.height)) return fallo(`Apariencia inválida: ${id}.height`);
    const modoPlegado = validarModoPlegado(id, raw.modoPlegado);
    if (!modoPlegado.ok) return modoPlegado;
    const estilo = validarEstiloApariencia(id, raw.estilo);
    if (!estilo.ok) return estilo;
    const ordenPartes = validarOrdenPartes(id, raw.ordenPartes);
    if (!ordenPartes.ok) return ordenPartes;
    const parteExtraidaDe = validarParteExtraidaDe(id, raw.parteExtraidaDe);
    if (!parteExtraidaDe.ok) return parteExtraidaDe;
    apariencias[id] = {
      id,
      entidadId: raw.entidadId,
      opdId,
      x: raw.x,
      y: raw.y,
      width: raw.width,
      height: raw.height,
      ...(estilo.value ? { estilo: estilo.value } : {}),
      modoPlegado: modoPlegado.value,
      ...(ordenPartes.value ? { ordenPartes: ordenPartes.value } : {}),
      ...(parteExtraidaDe.value ? { parteExtraidaDe: parteExtraidaDe.value } : {}),
    };
  }
  return ok(apariencias);
}

export function validarEstiloApariencia(
  aparienciaId: Id,
  value: unknown,
): Resultado<Apariencia["estilo"] | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo(`Apariencia inválida: ${aparienciaId}.estilo`);
  if (value.fill !== undefined && (typeof value.fill !== "string" || !esColorEstilo(value.fill))) {
    return fallo(`Apariencia inválida: ${aparienciaId}.estilo.fill`);
  }
  if (value.borderColor !== undefined && (typeof value.borderColor !== "string" || !esColorEstilo(value.borderColor))) {
    return fallo(`Apariencia inválida: ${aparienciaId}.estilo.borderColor`);
  }
  return ok(normalizarEstiloApariencia(value));
}

export function validarParteExtraidaDe(
  aparienciaId: Id,
  value: unknown,
): Resultado<Apariencia["parteExtraidaDe"] | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo(`Apariencia inválida: ${aparienciaId}.parteExtraidaDe`);
  if (typeof value.padreAparienciaId !== "string") return fallo(`Apariencia inválida: ${aparienciaId}.parteExtraidaDe.padreAparienciaId`);
  if (typeof value.parteEntidadId !== "string") return fallo(`Apariencia inválida: ${aparienciaId}.parteExtraidaDe.parteEntidadId`);
  return ok({
    padreAparienciaId: value.padreAparienciaId,
    parteEntidadId: value.parteEntidadId,
  });
}

export function validarModoPlegado(aparienciaId: Id, value: unknown): Resultado<ModoPlegado> {
  if (value === undefined) return ok("completo");
  if (value === "completo" || value === "parcial" || value === "plegado" || value === "desplegado") return ok(value);
  return fallo(`Apariencia inválida: ${aparienciaId}.modoPlegado`);
}

export function validarOrdenPartes(aparienciaId: Id, value: unknown): Resultado<OrdenPartesPlegado | undefined> {
  if (value === undefined) return ok(undefined);
  if (value === "alfabetico" || value === "creacion") return ok(value);
  return fallo(`Apariencia inválida: ${aparienciaId}.ordenPartes`);
}

export function validarAparienciasEnlace(opdId: Id, value: Record<string, unknown>): Resultado<Record<Id, AparienciaEnlace>> {
  const apariencias: Record<Id, AparienciaEnlace> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw)) return fallo(`Apariencia de enlace inválida: ${id}`);
    if (raw.id !== id) return fallo(`Apariencia de enlace inválida: ${id}.id`);
    if (raw.opdId !== opdId) return fallo(`Apariencia de enlace inválida: ${id}.opdId`);
    if (typeof raw.enlaceId !== "string") return fallo(`Apariencia de enlace inválida: ${id}.enlaceId`);
    if (!Array.isArray(raw.vertices)) return fallo(`Apariencia de enlace inválida: ${id}.vertices`);
    const vertices = validarVertices(id, raw.vertices);
    if (!vertices.ok) return vertices;
    apariencias[id] = { id, enlaceId: raw.enlaceId, opdId, vertices: vertices.value };
  }
  return ok(apariencias);
}

export function validarVertices(aparienciaId: Id, value: unknown[]): Resultado<Array<{ x: number; y: number }>> {
  const vertices: Array<{ x: number; y: number }> = [];
  for (const [index, raw] of value.entries()) {
    if (!esRecord(raw)) return fallo(`Vértice inválido: ${aparienciaId}[${index}]`);
    if (!esNumeroFinito(raw.x) || !esNumeroFinito(raw.y)) {
      return fallo(`Vértice inválido: ${aparienciaId}[${index}]`);
    }
    vertices.push({ x: raw.x, y: raw.y });
  }
  return ok(vertices);
}
