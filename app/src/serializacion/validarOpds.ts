import type {
  Entidad,
  Id,
  ModoDespliegueObjeto,
  Opd,
  RefinamientoEntidad,
  Resultado,
  SlotRefinamiento,
  TipoRefinamiento,
} from "../modelo/tipos";
import { fallo, ok, esModoDespliegue, esNumeroFinito, esRecord } from "./validarHelpers";
import { validarApariencias, validarAparienciasEnlace } from "./validarApariencias";

/**
 * Validadores para OPDs, refinamiento y modo de despliegue.
 *
 * Consumidores conocidos: `serializacion/json.ts` y `validarEntidades.ts`.
 * Anclaje: SSOT OPM ISO 19450 §Gestion de contexto y refinamiento y
 * §Arboles OPD; OPCloud separa OPDs al serializar en
 * `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/json.model.ts:77`.
 *
 * Ronda 15.2: schema dual. La nueva forma persistida es
 * `refinamientos: Partial<Record<TipoRefinamiento, SlotRefinamiento>>`. La
 * forma legacy `refinamiento: RefinamientoEntidad` se acepta al hidratar y se
 * promueve al record nuevo (funtor faithful: ningún modelo válido pre-15.2
 * cambia su semántica).
 */

export function validarRefinamiento(entidadId: Id, value: unknown): Resultado<RefinamientoEntidad | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo(`Refinamiento inválido: ${entidadId}`);
  if (value.tipo !== "descomposicion" && value.tipo !== "despliegue") return fallo(`Refinamiento inválido: ${entidadId}.tipo`);
  if (typeof value.opdId !== "string") return fallo(`Refinamiento inválido: ${entidadId}.opdId`);
  if (value.tipo === "descomposicion") {
    if (value.modo !== undefined) return fallo(`Refinamiento inválido: ${entidadId}.modo`);
    return ok({ tipo: value.tipo, opdId: value.opdId });
  }
  const modo = validarModoDespliegue(entidadId, value.modo);
  if (!modo.ok) return modo;
  return ok({ tipo: value.tipo, opdId: value.opdId, modo: modo.value });
}

export function validarRefinamientos(
  entidadId: Id,
  raw: Record<string, unknown>,
): Resultado<Partial<Record<TipoRefinamiento, SlotRefinamiento>> | undefined> {
  const acumulado: Partial<Record<TipoRefinamiento, SlotRefinamiento>> = {};

  // Fuente 1: campo nuevo `refinamientos`.
  if (raw.refinamientos !== undefined) {
    if (!esRecord(raw.refinamientos)) return fallo(`Refinamientos inválidos: ${entidadId}`);
    for (const [tipo, slot] of Object.entries(raw.refinamientos)) {
      if (tipo !== "descomposicion" && tipo !== "despliegue") {
        return fallo(`Refinamientos inválidos: ${entidadId}.${tipo}`);
      }
      if (slot === undefined) continue;
      if (!esRecord(slot)) return fallo(`Refinamientos inválidos: ${entidadId}.${tipo}`);
      if (typeof slot.opdId !== "string") return fallo(`Refinamientos inválidos: ${entidadId}.${tipo}.opdId`);
      if (tipo === "descomposicion") {
        if (slot.modo !== undefined) return fallo(`Refinamientos inválidos: ${entidadId}.${tipo}.modo`);
        acumulado.descomposicion = { opdId: slot.opdId };
      } else {
        const modo = validarModoDespliegue(entidadId, slot.modo);
        if (!modo.ok) return modo;
        acumulado.despliegue = { opdId: slot.opdId, modo: modo.value };
      }
    }
  }

  // Fuente 2: campo legacy `refinamiento`. Promueve al record si la clave aún no fue ocupada.
  const legacy = validarRefinamiento(entidadId, raw.refinamiento);
  if (!legacy.ok) return legacy;
  if (legacy.value) {
    const tipo = legacy.value.tipo;
    if (acumulado[tipo] === undefined) {
      acumulado[tipo] = tipo === "descomposicion"
        ? { opdId: legacy.value.opdId }
        : { opdId: legacy.value.opdId, modo: legacy.value.modo ?? "agregacion" };
    }
  }

  if (Object.keys(acumulado).length === 0) return ok(undefined);
  return ok(acumulado);
}

export function validarModoDespliegue(entidadId: Id, value: unknown): Resultado<ModoDespliegueObjeto> {
  if (value === undefined) return ok("agregacion");
  if (esModoDespliegue(value)) return ok(value);
  return fallo(`Refinamiento inválido: ${entidadId}.modo`);
}

export function validarOpds(value: Record<string, unknown>, entidades: Record<Id, Entidad>): Resultado<Record<Id, Opd>> {
  const opds: Record<Id, Opd> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw)) return fallo(`OPD inválido: ${id}`);
    if (raw.id !== id) return fallo(`OPD inválido: ${id}.id`);
    if (typeof raw.nombre !== "string") return fallo(`OPD inválido: ${id}.nombre`);
    if (raw.padreId !== undefined && raw.padreId !== null && typeof raw.padreId !== "string") {
      return fallo(`OPD inválido: ${id}.padreId`);
    }
    if (!esRecord(raw.apariencias)) return fallo(`OPD inválido: ${id}.apariencias`);
    if (!esRecord(raw.enlaces)) return fallo(`OPD inválido: ${id}.enlaces`);

    const apariencias = validarApariencias(id, raw.apariencias, entidades);
    if (!apariencias.ok) return apariencias;
    const enlaces = validarAparienciasEnlace(id, raw.enlaces);
    if (!enlaces.ok) return enlaces;
    let ordenLocal: number | undefined;
    if (raw.ordenLocal !== undefined) {
      if (!esNumeroFinito(raw.ordenLocal) || raw.ordenLocal < 0) {
        return fallo(`OPD inválido: ${id}.ordenLocal`);
      }
      ordenLocal = raw.ordenLocal;
    }
    opds[id] = {
      id,
      nombre: raw.nombre,
      padreId: raw.padreId ?? null,
      apariencias: apariencias.value,
      enlaces: enlaces.value,
      ...(ordenLocal !== undefined ? { ordenLocal } : {}),
    };
  }
  return ok(opds);
}
