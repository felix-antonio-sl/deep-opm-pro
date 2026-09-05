import type { EstadoCargaSubmodelo, Id, Modelo, ReferenciaPadreSubmodelo, Resultado, SubmodeloReferencia } from "../modelo/tipos";
import { esRecord, fallo, ok } from "./validarHelpers";

export function validarSubmodelos(
  value: unknown,
  entidades: Modelo["entidades"],
  opds: Modelo["opds"],
): Resultado<Record<Id, SubmodeloReferencia>> {
  if (value === undefined) return ok({});
  if (!esRecord(value)) return fallo("Modelo inválido: submodelos");
  const refs: Record<Id, SubmodeloReferencia> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw) || raw.id !== id) return fallo(`Submodelo inválido: ${id}`);
    if (typeof raw.modeloId !== "string" || typeof raw.nombre !== "string" || !raw.nombre.trim()) return fallo(`Submodelo inválido: ${id}`);
    if (typeof raw.anchorEntidadId !== "string" || !entidades[raw.anchorEntidadId]) return fallo(`Submodelo inválido: ${id}.anchorEntidadId`);
    if (!esEstadoCargaSubmodelo(raw.estado)) return fallo(`Submodelo inválido: ${id}.estado`);
    if (raw.opdVistaId !== undefined && (typeof raw.opdVistaId !== "string" || !opds[raw.opdVistaId])) {
      return fallo(`Submodelo inválido: ${id}.opdVistaId`);
    }
    const source = validarSubmodeloSource(id, raw.source);
    if (!source.ok) return source;
    const anchor = validarSubmodeloAnchor(id, raw.anchor, entidades, opds);
    if (!anchor.ok) return anchor;
    const contrato = validarSubmodeloContrato(id, raw.contrato);
    if (!contrato.ok) return contrato;
    const materializacion = validarSubmodeloMaterializacion(id, raw.materializacion, opds);
    if (!materializacion.ok) return materializacion;
    refs[id] = {
      id,
      modeloId: raw.modeloId,
      nombre: raw.nombre.trim(),
      anchorEntidadId: raw.anchorEntidadId,
      estado: raw.estado,
      ...(raw.opdVistaId ? { opdVistaId: raw.opdVistaId } : {}),
      ...(esRecord(raw.compartidas) ? { compartidas: Object.fromEntries(Object.entries(raw.compartidas).filter(([, v]) => typeof v === "string")) as Record<Id, Id> } : {}),
      ...(source.value ? { source: source.value } : {}),
      ...(anchor.value ? { anchor: anchor.value } : {}),
      ...(contrato.value ? { contrato: contrato.value } : {}),
      ...(materializacion.value ? { materializacion: materializacion.value } : {}),
    };
  }
  return ok(refs);
}

function validarSubmodeloSource(id: Id, value: unknown): Resultado<SubmodeloReferencia["source"] | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value) || typeof value.modeloId !== "string") return fallo(`Submodelo inválido: ${id}.source`);
  return ok({
    modeloId: value.modeloId,
    ...(typeof value.nombre === "string" && value.nombre.trim() ? { nombre: value.nombre.trim() } : {}),
    ...(typeof value.revisionHash === "string" && value.revisionHash.trim() ? { revisionHash: value.revisionHash.trim() } : {}),
  });
}

function validarSubmodeloAnchor(
  id: Id,
  value: unknown,
  entidades: Modelo["entidades"],
  opds: Modelo["opds"],
): Resultado<SubmodeloReferencia["anchor"] | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value) || typeof value.entidadId !== "string" || !entidades[value.entidadId]) {
    return fallo(`Submodelo inválido: ${id}.anchor`);
  }
  if (value.opdId !== undefined && (typeof value.opdId !== "string" || !opds[value.opdId])) {
    return fallo(`Submodelo inválido: ${id}.anchor.opdId`);
  }
  return ok({ entidadId: value.entidadId, ...(typeof value.opdId === "string" ? { opdId: value.opdId } : {}) });
}

function validarSubmodeloContrato(id: Id, value: unknown): Resultado<SubmodeloReferencia["contrato"] | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo(`Submodelo inválido: ${id}.contrato`);
  return ok({
    ...(esRecord(value.compartidas) ? { compartidas: mapaStringString(value.compartidas) } : {}),
    ...(typeof value.frozenAtHash === "string" && value.frozenAtHash.trim() ? { frozenAtHash: value.frozenAtHash.trim() } : {}),
  });
}

function validarSubmodeloMaterializacion(
  id: Id,
  value: unknown,
  opds: Modelo["opds"],
): Resultado<SubmodeloReferencia["materializacion"] | undefined> {
  if (value === undefined) return ok(undefined);
  if (
    !esRecord(value) ||
    typeof value.opdVistaId !== "string" ||
    !opds[value.opdVistaId] ||
    value.scope !== "sd-root" ||
    !esRecord(value.entidadMap) ||
    !esRecord(value.estadoMap) ||
    !esRecord(value.enlaceMap) ||
    !esRecord(value.abanicoMap)
  ) {
    return fallo(`Submodelo inválido: ${id}.materializacion`);
  }
  return ok({
    opdVistaId: value.opdVistaId,
    scope: "sd-root",
    entidadMap: mapaStringString(value.entidadMap),
    estadoMap: mapaStringString(value.estadoMap),
    enlaceMap: mapaStringString(value.enlaceMap),
    abanicoMap: mapaStringString(value.abanicoMap),
    ...(typeof value.sourceHash === "string" && value.sourceHash.trim() ? { sourceHash: value.sourceHash.trim() } : {}),
    ...(typeof value.materializedAt === "string" && value.materializedAt.trim() ? { materializedAt: value.materializedAt.trim() } : {}),
  });
}

function mapaStringString(value: Record<string, unknown>): Record<Id, Id> {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => typeof v === "string")) as Record<Id, Id>;
}

export function validarReferenciaPadreSubmodelo(value: unknown, entidades: Modelo["entidades"]): Resultado<ReferenciaPadreSubmodelo | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo("Modelo inválido: referenciaPadreSubmodelo");
  if (typeof value.modeloId !== "string" || typeof value.refId !== "string") return fallo("Modelo inválido: referenciaPadreSubmodelo");
  if (typeof value.anchorEntidadId !== "string" || !entidades[value.anchorEntidadId]) return fallo("Modelo inválido: referenciaPadreSubmodelo.anchorEntidadId");
  if (!esEstadoCargaSubmodelo(value.estado)) return fallo("Modelo inválido: referenciaPadreSubmodelo.estado");
  return ok({ modeloId: value.modeloId, refId: value.refId, anchorEntidadId: value.anchorEntidadId, estado: value.estado });
}

function esEstadoCargaSubmodelo(value: unknown): value is EstadoCargaSubmodelo {
  return value === "descargado" || value === "cargado-sincronizado" || value === "cargado-no-sincronizado" || value === "desconectado";
}
