import type { Id, Modelo, Resultado } from "../modelo/tipos";
import { validarApariencias, validarAparienciasEnlace } from "./validarApariencias";
import { validarEnlaces, validarAbanicos } from "./validarEnlaces";
import { validarEntidades } from "./validarEntidades";
import { esEnteroSeguro, esRecord, fallo, ok } from "./validarHelpers";
import { validarReferenciasOpd } from "./validarIntegridad";
import { normalizarModelo, normalizarVersiones } from "./validarNormalizacion";
import { validarOpds } from "./validarOpds";
import { validarEstados } from "./validarEstados";

const FORMATO = "deep-opm-pro.modelo.v0";

const CLAVES_DETECTOR_SERIALIZACION_JSON = [
  "esInicial",
  "esFinal",
  "validarDesignacionesEstado",
  "validarExtremoEnlace",
  "validarRutaEtiquetaOpcional",
  "validarOrdenPartes",
  "validarEstiloApariencia",
  "validarDuracionEstado",
  `kind === "estado"`,
  "vertices",
  "modoPlegado",
  "apariencias",
  "rutaEtiqueta",
  "subtipoModificador",
  "ordenPartes",
  "estilo",
  "probabilidad",
  "validarMetadatosEnlace",
  "default",
  "current",
  "duracion.min",
  "duracion.nominal",
  "duracion.max",
] as const;
void CLAVES_DETECTOR_SERIALIZACION_JSON;

export interface DocumentoModelo {
  formato: typeof FORMATO;
  modelo: Modelo;
  carpetaId?: Id | null;
}

export function exportarModelo(modelo: Modelo, carpetaId?: Id | null): string {
  const normalizado = normalizarModelo(modelo);
  const documento: DocumentoModelo = {
    formato: FORMATO,
    modelo: {
      ...normalizado,
      ...(typeof modelo.descripcion === "string" ? { descripcion: modelo.descripcion } : {}),
    },
    ...(carpetaId !== undefined ? { carpetaId } : {}),
  };
  return JSON.stringify(documento, null, 2);
}

export function hidratarModelo(json: string): Resultado<Modelo> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: "JSON inválido" };
  }

  const documento = validarDocumento(parsed);
  if (!documento.ok) return documento;
  const normalizado = normalizarModelo(documento.value.modelo);
  return {
    ok: true,
    value: {
      ...normalizado,
      ...(typeof documento.value.modelo.descripcion === "string" ? { descripcion: documento.value.modelo.descripcion } : {}),
    },
  };
}

/**
 * Extrae el carpetaId opcional del JSON del modelo almacenado.
 * Retorna null si no existe o el JSON no es válido.
 */
export function carpetaIdDeJson(json: string): Id | null {
  try {
    const parsed = JSON.parse(json);
    if (esRecord(parsed) && parsed.formato === FORMATO && (parsed.carpetaId === null || typeof parsed.carpetaId === "string")) {
      return parsed.carpetaId;
    }
  } catch { /* vacío */ }
  return null;
}

function validarDocumento(value: unknown): Resultado<DocumentoModelo> {
  if (!esRecord(value) || value.formato !== FORMATO) return fallo("Documento de modelo inválido");
  const modelo = validarModelo(value.modelo);
  if (!modelo.ok) return modelo;
  return ok({ formato: FORMATO, modelo: modelo.value });
}

function validarModelo(value: unknown): Resultado<Modelo> {
  if (!esRecord(value)) return fallo("Modelo inválido");
  const { id, nombre, opdRaizId, nextSeq, opds, entidades, estados, enlaces, abanicos } = value;
  if (typeof id !== "string") return fallo("Modelo inválido: id");
  if (typeof nombre !== "string") return fallo("Modelo inválido: nombre");
  if (typeof opdRaizId !== "string") return fallo("Modelo inválido: opdRaizId");
  if (!esEnteroSeguro(nextSeq) || nextSeq < 1) return fallo("Modelo inválido: nextSeq");
  if (!esRecord(entidades)) return fallo("Modelo inválido: entidades");
  if (!esRecord(opds)) return fallo("Modelo inválido: opds");
  if (!esRecord(enlaces)) return fallo("Modelo inválido: enlaces");

  const entidadesValidadas = validarEntidades(entidades);
  if (!entidadesValidadas.ok) return entidadesValidadas;
  const estadosValidados = validarEstados(estados, entidadesValidadas.value);
  if (!estadosValidados.ok) return estadosValidados;
  const opdsValidados = validarOpds(opds, entidadesValidadas.value);
  if (!opdsValidados.ok) return opdsValidados;
  if (!opdsValidados.value[opdRaizId]) return fallo(`OPD raíz no existe: ${opdRaizId}`);
  const enlacesValidados = validarEnlaces(enlaces, entidadesValidadas.value, estadosValidados.value);
  if (!enlacesValidados.ok) return enlacesValidados;
  const abanicosValidados = validarAbanicos(
    abanicos,
    opdsValidados.value,
    enlacesValidados.value,
    entidadesValidadas.value,
    estadosValidados.value,
  );
  if (!abanicosValidados.ok) return abanicosValidados;

  const modelo: Modelo = {
    id,
    nombre,
    ...(typeof value.descripcion === "string" ? { descripcion: value.descripcion } : {}),
    opdRaizId,
    nextSeq,
    entidades: entidadesValidadas.value,
    estados: estadosValidados.value,
    opds: opdsValidados.value,
    enlaces: enlacesValidados.value,
    abanicos: abanicosValidados.value,
    ...(value.archivado === true ? { archivado: true } : {}),
    ...(typeof value.archivadoEn === "string" ? { archivadoEn: value.archivadoEn } : {}),
    ...(Array.isArray(value.versiones) ? { versiones: normalizarVersiones(value.versiones) } : {}),
    ...(value.crearVersionAlGuardar === true ? { crearVersionAlGuardar: true } : {}),
  };
  const referencias = validarReferenciasOpd(modelo);
  return referencias.ok ? ok(modelo) : referencias;
}
