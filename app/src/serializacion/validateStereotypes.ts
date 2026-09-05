import type { Estereotipo, AparienciaPlantilla, PlantillaEstereotipo, Id, Resultado } from "../modelo/tipos";
import { validarEnlaces } from "./validarEnlaces";
import { validarEntidades } from "./validarEntidades";
import { esNumeroFinito, esRecord, fallo, ok } from "./validarHelpers";
import { validarEstados } from "./validarEstados";

/**
 * Valida `estereotipos` (D6, catálogo). Extensión aditiva: ausente ⇒ `{}` (byte-identidad
 * sobre opcional ausente). Cada entrada exige `id` coincidente con la clave, `nombre` no
 * vacío y `propositoDeModelado` opcional string-no-vacío. Mismo contrato de rechazo ruidoso
 * que `validarAnclasNormativas` (no silencio). La RESOLUCIÓN de `Entidad.estereotipoId`
 * contra este catálogo + la fábrica es el contrato de import en `validarReferenciasOpd`.
 */
export function validarEstereotipos(value: unknown): Resultado<Record<Id, Estereotipo>> {
  if (value === undefined) return ok({});
  if (!esRecord(value)) return fallo("Modelo inválido: estereotipos");
  const estereotipos: Record<Id, Estereotipo> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw) || raw.id !== id) return fallo(`Estereotipo inválido: ${id}`);
    if (typeof raw.nombre !== "string" || !raw.nombre.trim()) return fallo(`Estereotipo inválido: ${id}.nombre`);
    if (raw.propositoDeModelado !== undefined && (typeof raw.propositoDeModelado !== "string" || !raw.propositoDeModelado.trim())) {
      return fallo(`Estereotipo inválido: ${id}.propositoDeModelado`);
    }
    const plantilla = validarPlantillaEstereotipo(id, raw.plantilla);
    if (!plantilla.ok) return plantilla;
    estereotipos[id] = {
      id,
      nombre: raw.nombre.trim(),
      ...(typeof raw.propositoDeModelado === "string" && raw.propositoDeModelado.trim() ? { propositoDeModelado: raw.propositoDeModelado.trim() } : {}),
      ...(plantilla.value ? { plantilla: plantilla.value } : {}),
    };
  }
  return ok(estereotipos);
}

/**
 * Valida `estereotipo.plantilla` (D6.2). Extensión aditiva: ausente ⇒ undefined
 * (byte-identidad sobre opcional ausente). REUSA los validadores nucleares
 * (`validarEntidades/validarEstados/validarEnlaces`) sobre el subgrafo de ids
 * LOCALES — autocontenido, sin tocar `modelo.entidades`. `apariencias` exige
 * números finitos y clave = entidad de la plantilla; `anclaLocalId` (si presente)
 * debe ser una entidad de la plantilla. Subgrafo colgante (enlace con extremo
 * inexistente, apariencia de entidad inexistente) se RECHAZA con diagnóstico.
 */
function validarPlantillaEstereotipo(estId: Id, value: unknown): Resultado<PlantillaEstereotipo | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo(`Estereotipo inválido: ${estId}.plantilla`);
  if (!esRecord(value.entidades)) return fallo(`Estereotipo inválido: ${estId}.plantilla.entidades`);
  if (!esRecord(value.estados)) return fallo(`Estereotipo inválido: ${estId}.plantilla.estados`);
  if (!esRecord(value.enlaces)) return fallo(`Estereotipo inválido: ${estId}.plantilla.enlaces`);
  if (!esRecord(value.apariencias)) return fallo(`Estereotipo inválido: ${estId}.plantilla.apariencias`);

  const entidades = validarEntidades(value.entidades);
  if (!entidades.ok) return fallo(`Estereotipo inválido: ${estId}.plantilla.entidades (${entidades.error})`);
  const estados = validarEstados(value.estados, entidades.value);
  if (!estados.ok) return fallo(`Estereotipo inválido: ${estId}.plantilla.estados (${estados.error})`);
  const enlaces = validarEnlaces(value.enlaces, entidades.value, estados.value);
  if (!enlaces.ok) return fallo(`Estereotipo inválido: ${estId}.plantilla.enlaces (${enlaces.error})`);

  const apariencias: Record<Id, AparienciaPlantilla> = {};
  for (const [entidadId, raw] of Object.entries(value.apariencias)) {
    if (!entidades.value[entidadId]) return fallo(`Estereotipo inválido: ${estId}.plantilla.apariencias.${entidadId} (entidad inexistente)`);
    if (
      !esRecord(raw) ||
      !esNumeroFinito(raw.x) ||
      !esNumeroFinito(raw.y) ||
      !esNumeroFinito(raw.width) ||
      !esNumeroFinito(raw.height)
    ) {
      return fallo(`Estereotipo inválido: ${estId}.plantilla.apariencias.${entidadId}`);
    }
    apariencias[entidadId] = { x: raw.x, y: raw.y, width: raw.width, height: raw.height };
  }

  if (value.anclaLocalId !== undefined) {
    if (typeof value.anclaLocalId !== "string" || !entidades.value[value.anclaLocalId]) {
      return fallo(`Estereotipo inválido: ${estId}.plantilla.anclaLocalId`);
    }
  }

  return ok({
    entidades: entidades.value,
    estados: estados.value,
    enlaces: enlaces.value,
    apariencias,
    ...(typeof value.anclaLocalId === "string" ? { anclaLocalId: value.anclaLocalId } : {}),
  });
}
