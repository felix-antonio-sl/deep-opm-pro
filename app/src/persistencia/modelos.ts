import type { VersionResumen } from "../modelo/tipos";
import { compactarJsonDocumento } from "./compactacion";

export interface ResumenModeloPersistido {
  id: string;
  nombre: string;
  descripcion: string;
  creadoEn: string;
  actualizadoEn: string;
  carpetaId?: string | null;
  ultimaApertura?: string;
  autosalvado?: boolean;
  archivado?: boolean;
  archivadoEn?: string;
  archivadoAuto?: boolean;
  versiones?: VersionResumen[];
  crearVersionAlGuardar?: boolean;
  revision?: number;
}

export interface ModeloPersistido extends ResumenModeloPersistido {
  json: string;
}

export interface GuardarModeloInput {
  id?: string | null;
  nombre: string;
  descripcion?: string;
  json: string;
  carpetaId?: string | null;
  ultimaApertura?: string;
  autosalvado?: boolean;
  archivado?: boolean;
  archivadoEn?: string;
  archivadoAuto?: boolean;
  versiones?: VersionResumen[];
  crearVersionAlGuardar?: boolean;
  revision?: number;
}

export function construirModeloPersistido(
  input: GuardarModeloInput,
  existente?: ResumenModeloPersistido,
  ahora = new Date().toISOString(),
): ModeloPersistido {
  const nombre = input.nombre.trim() || "Modelo OPM";
  const descripcion = typeof input.descripcion === "string" ? input.descripcion.trim() : "";
  const id = input.id?.trim() || generarId();
  const resumen: ResumenModeloPersistido = {
    id,
    nombre,
    descripcion,
    creadoEn: existente?.creadoEn ?? ahora,
    actualizadoEn: ahora,
  };
  const carpetaId = input.carpetaId ?? existente?.carpetaId;
  if (carpetaId !== undefined) resumen.carpetaId = carpetaId;
  const ultimaApertura = input.ultimaApertura ?? existente?.ultimaApertura;
  if (ultimaApertura !== undefined) resumen.ultimaApertura = ultimaApertura;
  const autosalvado = input.autosalvado ?? existente?.autosalvado;
  if (autosalvado !== undefined) resumen.autosalvado = autosalvado;
  const archivado = input.archivado ?? existente?.archivado;
  if (archivado !== undefined) resumen.archivado = archivado;
  const archivadoEn = input.archivadoEn ?? existente?.archivadoEn;
  if (archivadoEn !== undefined) resumen.archivadoEn = archivadoEn;
  const archivadoAuto = input.archivadoAuto ?? existente?.archivadoAuto;
  if (archivadoAuto !== undefined) resumen.archivadoAuto = archivadoAuto;
  const versiones = input.versiones ?? existente?.versiones;
  if (versiones !== undefined) resumen.versiones = versiones;
  const crearVersionAlGuardar = input.crearVersionAlGuardar ?? existente?.crearVersionAlGuardar;
  if (crearVersionAlGuardar !== undefined) resumen.crearVersionAlGuardar = crearVersionAlGuardar;
  const revision = input.revision ?? existente?.revision;
  if (revision !== undefined) resumen.revision = revision;
  return { ...resumen, json: compactarJsonDocumento(input.json) };
}

export function resumenDesdeModeloPersistido(modelo: ModeloPersistido): ResumenModeloPersistido {
  return {
    id: modelo.id,
    nombre: modelo.nombre,
    descripcion: modelo.descripcion,
    creadoEn: modelo.creadoEn,
    actualizadoEn: modelo.actualizadoEn,
    ...(modelo.carpetaId !== undefined ? { carpetaId: modelo.carpetaId } : {}),
    ...(modelo.ultimaApertura !== undefined ? { ultimaApertura: modelo.ultimaApertura } : {}),
    ...(modelo.autosalvado !== undefined ? { autosalvado: modelo.autosalvado } : {}),
    ...(modelo.archivado !== undefined ? { archivado: modelo.archivado } : {}),
    ...(modelo.archivadoEn !== undefined ? { archivadoEn: modelo.archivadoEn } : {}),
    ...(modelo.archivadoAuto !== undefined ? { archivadoAuto: modelo.archivadoAuto } : {}),
    ...(modelo.versiones !== undefined ? { versiones: modelo.versiones } : {}),
    ...(modelo.crearVersionAlGuardar !== undefined ? { crearVersionAlGuardar: modelo.crearVersionAlGuardar } : {}),
    ...(modelo.revision !== undefined ? { revision: modelo.revision } : {}),
  };
}

function generarId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `modelo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
