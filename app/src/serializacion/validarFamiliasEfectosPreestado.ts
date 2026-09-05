import { validarSemanticaFamiliasPreestado } from "../modelo/familiasEfectosPreestado";
import type { FamiliaEfectosPreestado, Id, Modelo, Resultado } from "../modelo/tipos";
import { esRecord, fallo, ok } from "./validarHelpers";

export function validarFamiliasEfectosPreestado(
  value: unknown,
  contexto: Pick<Modelo, "opds" | "entidades" | "estados" | "enlaces" | "abanicos">,
): Resultado<Record<Id, FamiliaEfectosPreestado>> {
  if (value === undefined) return ok({});
  if (!esRecord(value)) return fallo("Modelo inválido: familiasEfectosPreestado");
  const familias: Record<Id, FamiliaEfectosPreestado> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw) || !id || raw.id !== id) {
      return fallo(`Familia de efectos por preestado inválida: ${id}`);
    }
    if (
      raw.tipo !== "particion-preestado"
      || raw.estatuto !== "extension-declarada"
      || raw.aplicacion !== "exactamente-uno-por-preestado"
      || (raw.cobertura !== "total" && raw.cobertura !== "parcial")
      || typeof raw.opdId !== "string"
      || typeof raw.procesoId !== "string"
      || typeof raw.objetoId !== "string"
      || !sonIds(raw.enlaceIds)
      || !sonIds(raw.dominioEstadoIds)
    ) {
      return fallo(`Familia de efectos por preestado inválida: ${id}`);
    }
    familias[id] = {
      id,
      tipo: raw.tipo,
      estatuto: raw.estatuto,
      opdId: raw.opdId,
      procesoId: raw.procesoId,
      objetoId: raw.objetoId,
      enlaceIds: raw.enlaceIds,
      dominioEstadoIds: raw.dominioEstadoIds,
      cobertura: raw.cobertura,
      aplicacion: raw.aplicacion,
    };
  }
  const semantica = validarSemanticaFamiliasPreestado(familias, contexto);
  if (!semantica.ok) return semantica;
  return ok(familias);
}

function sonIds(value: unknown): value is Id[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.length > 0);
}
