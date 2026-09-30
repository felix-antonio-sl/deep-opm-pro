import type { MesaExploracionV1, Id, Modelo, Resultado } from "../modelo/tipos";
import { MAX_MARKDOWN_SOURCE_BYTES, MESA_EXPLORACION_SCHEMA } from "../modelo/tipos";
import { esRecord, fallo, ok } from "./validarHelpers";

/**
 * Valida la extensión meta de exploración sin promoverla al núcleo OPM. Las
 * referencias internas se resuelven de forma cerrada: fuente→trazo→propuesta y
 * confirmación→recibo. El target OPM de un recibo es histórico y puede estar
 * ausente si el hecho fue borrado después; se conserva para no perder fuente
 * ni procedencia.
 */
export function validarMesaExploracion(
  value: unknown,
  opds: Modelo["opds"],
): Resultado<MesaExploracionV1 | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value) || value.schema !== MESA_EXPLORACION_SCHEMA) {
    return fallo("Modelo inválido: mesaExploracion.schema");
  }
  if (!esRecord(value.fuentes)) return fallo("Modelo inválido: mesaExploracion.fuentes");
  if (!esRecord(value.trazos)) return fallo("Modelo inválido: mesaExploracion.trazos");
  if (!esRecord(value.propuestas)) return fallo("Modelo inválido: mesaExploracion.propuestas");
  if (!esRecord(value.confirmaciones)) return fallo("Modelo inválido: mesaExploracion.confirmaciones");

  const fuentes: MesaExploracionV1["fuentes"] = {};
  for (const [id, raw] of Object.entries(value.fuentes)) {
    if (!esRecord(raw) || raw.id !== id || raw.tipo !== "texto") {
      return fallo(`Fuente de exploración inválida: ${id}`);
    }
    if (typeof raw.contenido !== "string" || !raw.contenido.trim()) {
      return fallo(`Fuente de exploración inválida: ${id}.contenido`);
    }
    if (raw.mediaType !== undefined && raw.mediaType !== "text/markdown") {
      return fallo(`Fuente de exploración inválida: ${id}.mediaType`);
    }
    if (raw.mediaType === "text/markdown" && new TextEncoder().encode(raw.contenido).byteLength > MAX_MARKDOWN_SOURCE_BYTES) {
      return fallo(`Fuente de exploración inválida: ${id}.contenido supera el límite de 128 kB`);
    }
    if (typeof raw.creadaEn !== "string" || !raw.creadaEn.trim()) {
      return fallo(`Fuente de exploración inválida: ${id}.creadaEn`);
    }
    if (raw.titulo !== undefined && (typeof raw.titulo !== "string" || !raw.titulo.trim())) {
      return fallo(`Fuente de exploración inválida: ${id}.titulo`);
    }
    fuentes[id] = {
      id,
      tipo: "texto",
      ...(raw.mediaType === "text/markdown" ? { mediaType: "text/markdown" as const } : {}),
      ...(typeof raw.titulo === "string" ? { titulo: raw.titulo.trim() } : {}),
      contenido: raw.contenido,
      creadaEn: raw.creadaEn.trim(),
    };
  }

  const trazos: MesaExploracionV1["trazos"] = {};
  for (const [id, raw] of Object.entries(value.trazos)) {
    if (!esRecord(raw) || raw.id !== id) return fallo(`Trazo de exploración inválido: ${id}`);
    const fuenteIds = validarIdsMeta(raw.fuenteIds, `Trazo de exploración inválido: ${id}.fuenteIds`);
    if (!fuenteIds.ok) return fuenteIds;
    if (fuenteIds.value.length === 0) return fallo(`Trazo de exploración inválido: ${id}.fuenteIds vacío`);
    for (const fuenteId of fuenteIds.value) {
      if (!fuentes[fuenteId]) return fallo(`Trazo de exploración inválido: ${id}.fuenteIds referencia fuente inexistente: ${fuenteId}`);
    }
    if (typeof raw.texto !== "string" || !raw.texto.trim()) {
      return fallo(`Trazo de exploración inválido: ${id}.texto`);
    }
    if (typeof raw.creadoEn !== "string" || !raw.creadoEn.trim()) {
      return fallo(`Trazo de exploración inválido: ${id}.creadoEn`);
    }
    if (raw.editadoEn !== undefined && (typeof raw.editadoEn !== "string" || !raw.editadoEn.trim())) {
      return fallo(`Trazo de exploración inválido: ${id}.editadoEn`);
    }
    trazos[id] = {
      id,
      fuenteIds: fuenteIds.value,
      texto: raw.texto.trim(),
      creadoEn: raw.creadoEn.trim(),
      ...(typeof raw.editadoEn === "string" ? { editadoEn: raw.editadoEn.trim() } : {}),
    };
  }

  const propuestas: MesaExploracionV1["propuestas"] = {};
  for (const [id, raw] of Object.entries(value.propuestas)) {
    if (!esRecord(raw) || raw.id !== id) return fallo(`Propuesta OPM inválida: ${id}`);
    const trazoIds = validarIdsMeta(raw.trazoIds, `Propuesta OPM inválida: ${id}.trazoIds`);
    if (!trazoIds.ok) return trazoIds;
    if (trazoIds.value.length === 0) return fallo(`Propuesta OPM inválida: ${id}.trazoIds vacío`);
    for (const trazoId of trazoIds.value) {
      if (!trazos[trazoId]) return fallo(`Propuesta OPM inválida: ${id}.trazoIds referencia trazo inexistente: ${trazoId}`);
    }
    if (typeof raw.baseFirmaSemantica !== "string" || !raw.baseFirmaSemantica.trim()) {
      return fallo(`Propuesta OPM inválida: ${id}.baseFirmaSemantica`);
    }
    if (!esRecord(raw.operacion) || raw.operacion.tipo !== "crear-entidad") {
      return fallo(`Propuesta OPM inválida: ${id}.operacion`);
    }
    if (raw.operacion.entidadTipo !== "objeto" && raw.operacion.entidadTipo !== "proceso") {
      return fallo(`Propuesta OPM inválida: ${id}.operacion.entidadTipo`);
    }
    if (typeof raw.operacion.nombre !== "string" || !raw.operacion.nombre.trim()) {
      return fallo(`Propuesta OPM inválida: ${id}.operacion.nombre`);
    }
    if (typeof raw.operacion.opdId !== "string" || !raw.operacion.opdId.trim()) {
      return fallo(`Propuesta OPM inválida: ${id}.operacion.opdId`);
    }
    if (raw.estado !== "pendiente" && raw.estado !== "confirmada") {
      return fallo(`Propuesta OPM inválida: ${id}.estado`);
    }
    if (raw.estado === "pendiente" && !opds[raw.operacion.opdId.trim()]) {
      return fallo(`Propuesta OPM inválida: ${id}.operacion.opdId inexistente`);
    }
    if (typeof raw.creadaEn !== "string" || !raw.creadaEn.trim()) {
      return fallo(`Propuesta OPM inválida: ${id}.creadaEn`);
    }
    if (raw.estado === "pendiente" && raw.confirmacionId !== undefined) {
      return fallo(`Propuesta OPM inválida: ${id}.confirmacionId inesperada`);
    }
    if (raw.estado === "confirmada" && (typeof raw.confirmacionId !== "string" || !raw.confirmacionId.trim())) {
      return fallo(`Propuesta OPM inválida: ${id}.confirmacionId`);
    }
    propuestas[id] = {
      id,
      trazoIds: trazoIds.value,
      baseFirmaSemantica: raw.baseFirmaSemantica.trim(),
      operacion: {
        tipo: "crear-entidad",
        entidadTipo: raw.operacion.entidadTipo,
        nombre: raw.operacion.nombre.trim(),
        opdId: raw.operacion.opdId,
      },
      estado: raw.estado,
      creadaEn: raw.creadaEn.trim(),
      ...(typeof raw.confirmacionId === "string" ? { confirmacionId: raw.confirmacionId.trim() } : {}),
    };
  }

  const confirmaciones: MesaExploracionV1["confirmaciones"] = {};
  for (const [id, raw] of Object.entries(value.confirmaciones)) {
    if (!esRecord(raw) || raw.id !== id) return fallo(`Confirmación de exploración inválida: ${id}`);
    if (typeof raw.propuestaId !== "string" || !propuestas[raw.propuestaId]) {
      return fallo(`Confirmación de exploración inválida: ${id}.propuestaId`);
    }
    const propuesta = propuestas[raw.propuestaId]!;
    if (propuesta.estado !== "confirmada" || propuesta.confirmacionId !== id) {
      return fallo(`Confirmación de exploración inválida: ${id} no coincide con su propuesta`);
    }
    const fuenteIds = validarIdsMeta(raw.fuenteIds, `Confirmación de exploración inválida: ${id}.fuenteIds`);
    if (!fuenteIds.ok) return fuenteIds;
    for (const fuenteId of fuenteIds.value) {
      if (!fuentes[fuenteId]) return fallo(`Confirmación de exploración inválida: ${id}.fuenteIds referencia fuente inexistente`);
    }
    const trazoIds = validarIdsMeta(raw.trazoIds, `Confirmación de exploración inválida: ${id}.trazoIds`);
    if (!trazoIds.ok) return trazoIds;
    for (const trazoId of trazoIds.value) {
      if (!trazos[trazoId]) return fallo(`Confirmación de exploración inválida: ${id}.trazoIds referencia trazo inexistente`);
    }
    if (!mismosIds(trazoIds.value, propuesta.trazoIds)) {
      return fallo(`Confirmación de exploración inválida: ${id}.trazoIds diverge de la propuesta`);
    }
    const fuenteIdsDerivadas = [
      ...new Set(trazoIds.value.flatMap((trazoId) => trazos[trazoId]!.fuenteIds)),
    ];
    if (!mismosIds(fuenteIds.value, fuenteIdsDerivadas)) {
      return fallo(`Confirmación de exploración inválida: ${id}.fuenteIds diverge de sus trazos`);
    }
    if (!Array.isArray(raw.targets) || raw.targets.length !== 1) {
      return fallo(`Confirmación de exploración inválida: ${id}.targets requiere un solo target en v1`);
    }
    const target = raw.targets[0];
    if (!esRecord(target) || target.tipo !== "entidad" || typeof target.id !== "string" || !target.id.trim()) {
      return fallo(`Confirmación de exploración inválida: ${id}.target`);
    }
    if (typeof target.opdId !== "string" || !target.opdId.trim()) {
      return fallo(`Confirmación de exploración inválida: ${id}.target.opdId`);
    }
    const targets: MesaExploracionV1["confirmaciones"][Id]["targets"] = [
      { tipo: "entidad", id: target.id.trim(), opdId: target.opdId.trim() },
    ];
    if (typeof raw.confirmadoEn !== "string" || !raw.confirmadoEn.trim()) {
      return fallo(`Confirmación de exploración inválida: ${id}.confirmadoEn`);
    }
    confirmaciones[id] = {
      id,
      propuestaId: raw.propuestaId,
      targets,
      fuenteIds: fuenteIds.value,
      trazoIds: trazoIds.value,
      confirmadoEn: raw.confirmadoEn.trim(),
    };
  }

  for (const propuesta of Object.values(propuestas)) {
    if (propuesta.estado === "confirmada" && !confirmaciones[propuesta.confirmacionId!]) {
      return fallo(`Propuesta OPM inválida: ${propuesta.id}.confirmacionId inexistente`);
    }
  }

  return ok({
    schema: MESA_EXPLORACION_SCHEMA,
    fuentes,
    trazos,
    propuestas,
    confirmaciones,
  });
}

function validarIdsMeta(value: unknown, error: string): Resultado<Id[]> {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || !item.trim())) {
    return fallo(error);
  }
  const ids = value.map((item) => (item as string).trim());
  if (new Set(ids).size !== ids.length) return fallo(`${error} contiene duplicados`);
  return ok(ids);
}

function mismosIds(a: readonly Id[], b: readonly Id[]): boolean {
  return a.length === b.length && a.every((id) => b.includes(id));
}
