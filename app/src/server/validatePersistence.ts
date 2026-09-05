import type { ModeloPersistido } from "../persistencia/modelos";
import type { WorkspaceIndice, WorkspaceWrite } from "../persistencia/workspace";
import { esPreferenciasUi, normalizarCarpetaIndice, normalizarModeloIndice } from "../persistencia/workspaceStorage";
import type { VersionResumen } from "../modelo/tipos";
import { normalizeBaseWitness } from "../mesa/baseWitness";
import { isValidTimestamp } from "../mesa/timestampOrder";
import { esRecord } from "./persistenceHttp";
import type { BackendVersionPersistida, BackendAutosaveWrite, ModelRevisionBase, ModelRevisionCommit } from "./modelPersistence";

export function validarModeloPersistido(input: unknown): ModeloPersistido {
  if (!esRecord(input)) throw new Error("Modelo persistido invalido");
  const record = esRecord(input.modelo) ? input.modelo : input;
  if (!esRecord(record)) throw new Error("Modelo persistido invalido");
  if (typeof record.id !== "string" || !record.id.trim()) throw new Error("Modelo persistido invalido: id");
  if (typeof record.nombre !== "string" || !record.nombre.trim()) throw new Error("Modelo persistido invalido: nombre");
  if (!isValidTimestamp(record.creadoEn)) throw new Error("Modelo persistido invalido: creadoEn");
  if (!isValidTimestamp(record.actualizadoEn)) throw new Error("Modelo persistido invalido: actualizadoEn");
  if (typeof record.json !== "string" || !record.json.trim()) throw new Error("Modelo persistido invalido: json");
  try {
    JSON.parse(record.json);
  } catch {
    throw new Error("Modelo persistido invalido: json");
  }
  const base: ModeloPersistido = {
    id: record.id,
    nombre: record.nombre,
    descripcion: typeof record.descripcion === "string" ? record.descripcion : "",
    creadoEn: record.creadoEn,
    actualizadoEn: record.actualizadoEn,
    json: record.json,
  };
  if (record.carpetaId === null || typeof record.carpetaId === "string") base.carpetaId = record.carpetaId;
  if (typeof record.ultimaApertura === "string") base.ultimaApertura = record.ultimaApertura;
  if (typeof record.autosalvado === "boolean") base.autosalvado = record.autosalvado;
  if (typeof record.archivado === "boolean") base.archivado = record.archivado;
  if (typeof record.archivadoEn === "string") base.archivadoEn = record.archivadoEn;
  if (typeof record.archivadoAuto === "boolean") base.archivadoAuto = record.archivadoAuto;
  if (typeof record.esBiblioteca === "boolean") base.esBiblioteca = record.esBiblioteca;
  if (typeof record.esApunte === "boolean") base.esApunte = record.esApunte;
  if (Array.isArray(record.versiones)) base.versiones = record.versiones.filter(esVersionResumen);
  if (typeof record.crearVersionAlGuardar === "boolean") base.crearVersionAlGuardar = record.crearVersionAlGuardar;
  if (typeof record.revision === "number" && Number.isInteger(record.revision) && record.revision >= 0) {
    base.revision = record.revision;
  }
  return base;
}

function validarWorkspaceIndice(input: unknown): WorkspaceIndice {
  if (!esRecord(input)) throw new Error("Workspace persistido invalido");
  const record = esRecord(input.indice) ? input.indice : input;
  if (!esRecord(record)) throw new Error("Workspace persistido invalido");
  return {
    modelos: Array.isArray(record.modelos)
      ? record.modelos.map(normalizarModeloIndice).filter((modelo): modelo is WorkspaceIndice["modelos"][number] => modelo !== null)
      : [],
    carpetas: Array.isArray(record.carpetas)
      ? record.carpetas.map(normalizarCarpetaIndice).filter((carpeta): carpeta is WorkspaceIndice["carpetas"][number] => carpeta !== null)
      : [],
    recientes: Array.isArray(record.recientes) ? record.recientes.filter((id): id is string => typeof id === "string") : [],
    ...(typeof record.busquedaGlobalUltima === "string" ? { busquedaGlobalUltima: record.busquedaGlobalUltima } : {}),
    ...(esPreferenciasUi(record.preferenciasUi) ? { preferenciasUi: record.preferenciasUi } : {}),
  };
}

export function validateWorkspaceWrite(input: unknown): WorkspaceWrite {
  if (!esRecord(input) ||
    typeof input.revisionBase !== "number" ||
    !Number.isInteger(input.revisionBase) ||
    input.revisionBase < 0) {
    throw new Error("Workspace persistido invalido: revisionBase");
  }
  return {
    indice: validarWorkspaceIndice(input),
    revisionBase: input.revisionBase,
  };
}

export function validarVersionPersistida(modeloId: string, input: unknown): BackendVersionPersistida {
  if (!esRecord(input)) throw new Error("Version persistida invalida");
  const version = esRecord(input.version) ? input.version : null;
  const json = typeof input.json === "string" ? input.json : typeof input.payload === "string" ? input.payload : "";
  if (!version || !esVersionResumen(version)) throw new Error("Version persistida invalida");
  validarJsonString(json, "Version persistida invalida: json");
  return {
    modeloId,
    version: {
      id: version.id,
      creadoEn: version.creadoEn,
      nombre: version.nombre,
      ...(typeof version.descripcion === "string" ? { descripcion: version.descripcion } : {}),
      ...(version.preservar === true ? { preservar: true } : {}),
      modeloPayloadKey: version.modeloPayloadKey,
      bytes: version.bytes,
    },
    json,
  };
}

export function validateModelRevisionCommit(modelId: string, input: unknown): ModelRevisionCommit {
  if (!esRecord(input)) throw new Error("Revision de modelo invalida");
  const model = validarModeloPersistido(input.model);
  if (model.id !== modelId) throw new Error("Revision de modelo invalida: id");
  if (!esRecord(input.version) ||
    typeof input.version.id !== "string" ||
    !input.version.id.trim() ||
    !isValidTimestamp(input.version.creadoEn) ||
    typeof input.version.nombre !== "string" ||
    !input.version.nombre.trim()) {
    throw new Error("Revision de modelo invalida: version");
  }

  let base: ModelRevisionBase;
  let speciesOnCreate: ModelRevisionCommit["speciesOnCreate"];
  let graduation: ModelRevisionCommit["graduation"];
  let reopening: ModelRevisionCommit["reopening"];
  if (esRecord(input.base) && input.base.kind === "new") {
    base = { kind: "new" };
    if (input.speciesOnCreate !== "apunte" && input.speciesOnCreate !== "modelo") {
      throw new Error("Revision de modelo invalida: especie");
    }
    if (input.graduation !== undefined) throw new Error("Revision de modelo invalida: graduacion");
    if (input.reopening !== undefined) throw new Error("Revision de modelo invalida: reapertura");
    speciesOnCreate = input.speciesOnCreate;
  } else if (esRecord(input.base) && input.base.kind === "existing") {
    const witness = normalizeBaseWitness(input.base.witness);
    if (!witness) throw new Error("Revision de modelo invalida: base");
    if (input.speciesOnCreate !== undefined) throw new Error("Revision de modelo invalida: especie");
    if (input.graduation !== undefined) {
      if (!esRecord(input.graduation) ||
        input.graduation.kind !== "graduate" ||
        (input.graduation.role !== "work" && input.graduation.role !== "library") ||
        !(input.graduation.folderId === null ||
          (typeof input.graduation.folderId === "string" && input.graduation.folderId.trim()))) {
        throw new Error("Revision de modelo invalida: graduacion");
      }
      graduation = {
        kind: "graduate",
        folderId: input.graduation.folderId === null ? null : input.graduation.folderId.trim(),
        role: input.graduation.role,
      };
    }
    if (input.reopening !== undefined) {
      if (!esRecord(input.reopening) || input.reopening.kind !== "reopen") {
        throw new Error("Revision de modelo invalida: reapertura");
      }
      if (graduation) {
        throw new Error("Revision de modelo invalida: transiciones incompatibles");
      }
      reopening = { kind: "reopen" };
    }
    base = { kind: "existing", witness };
  } else {
    throw new Error("Revision de modelo invalida: base");
  }

  return {
    model,
    version: {
      id: input.version.id,
      creadoEn: input.version.creadoEn,
      nombre: input.version.nombre,
      ...(typeof input.version.descripcion === "string" ? { descripcion: input.version.descripcion } : {}),
      ...(input.version.preservar === true ? { preservar: true } : {}),
      modeloPayloadKey: input.version.id,
      bytes: new TextEncoder().encode(model.json).byteLength,
    },
    base,
    ...(speciesOnCreate ? { speciesOnCreate } : {}),
    ...(graduation ? { graduation } : {}),
    ...(reopening ? { reopening } : {}),
    ...(input.confirmedByOperator === true ? { confirmedByOperator: true } : {}),
  };
}

export function validarAutosalvadoPersistido(modeloId: string, input: unknown): BackendAutosaveWrite {
  if (!esRecord(input)) throw new Error("Autosalvado persistido invalido");
  const json = typeof input.json === "string" ? input.json : "";
  validarJsonString(json, "Autosalvado persistido invalido: json");
  if (typeof input.revisionBase !== "number" || !Number.isInteger(input.revisionBase) || input.revisionBase < 0) {
    throw new Error("Autosalvado persistido invalido: revisionBase");
  }
  if (input.creadoEn !== undefined && !isValidTimestamp(input.creadoEn)) {
    throw new Error("Autosalvado persistido invalido: creadoEn");
  }
  return {
    modeloId,
    creadoEn: typeof input.creadoEn === "string" ? input.creadoEn : new Date().toISOString(),
    json,
    revisionBase: input.revisionBase,
  };
}

function validarJsonString(json: string, error: string): void {
  if (!json.trim()) throw new Error(error);
  try {
    JSON.parse(json);
  } catch {
    throw new Error(error);
  }
}

function esVersionResumen(value: unknown): value is VersionResumen {
  if (!esRecord(value) ||
    typeof value.id !== "string" || !value.id.trim() ||
    !isValidTimestamp(value.creadoEn) ||
    typeof value.nombre !== "string" || !value.nombre.trim() ||
    typeof value.modeloPayloadKey !== "string" || !value.modeloPayloadKey.trim() ||
    typeof value.bytes !== "number" || !Number.isSafeInteger(value.bytes) || value.bytes < 0) {
    return false;
  }
  return true;
}
