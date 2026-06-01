import type {
  EstadoCargaSubmodelo,
  EstadoSatisfaccionRequisito,
  Id,
  Modelo,
  OntologiaOrganizacional,
  ReferenciaPadreSubmodelo,
  Resultado,
  SatisfaccionRequisito,
  SubmodeloReferencia,
} from "../modelo/tipos";
import { sincronizarPuertosTodosLosOpd } from "../modelo/operaciones";
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
  "validarDuracionEstado",
  `kind === "estado"`,
  "vertices",
  "modoPlegado",
  "contextoRefinamiento",
  "apariencias",
  "rutaEtiqueta",
  "subtipoModificador",
  "ordenPartes",
  "probabilidad",
  "backwardTag",
  "mostrarRequisitos",
  "unidadesTasa",
  "tiempoMinimo",
  "unidadTiempoMinimo",
  "tiempoMaximo",
  "unidadTiempoMaximo",
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
  const modeloConPuertos = sincronizarPuertosTodosLosOpd(modelo);
  const normalizado = normalizarModelo(modeloConPuertos);
  const documento: DocumentoModelo = {
    formato: FORMATO,
    modelo: {
      ...normalizado,
      ...(typeof modeloConPuertos.descripcion === "string" ? { descripcion: modeloConPuertos.descripcion } : {}),
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
  const normalizado = sincronizarPuertosTodosLosOpd(normalizarModelo(documento.value.modelo));
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
  const ontologiaValidada = validarOntologiaOrganizacional(value.ontologia);
  if (!ontologiaValidada.ok) return ontologiaValidada;
  const satisfaccionesValidadas = validarSatisfaccionesRequisito(value.satisfaccionesRequisito, entidadesValidadas.value, enlacesValidados.value);
  if (!satisfaccionesValidadas.ok) return satisfaccionesValidadas;
  const submodelosValidados = validarSubmodelos(value.submodelos, entidadesValidadas.value, opdsValidados.value);
  if (!submodelosValidados.ok) return submodelosValidados;
  const padreSubmodeloValidado = validarReferenciaPadreSubmodelo(value.referenciaPadreSubmodelo, entidadesValidadas.value);
  if (!padreSubmodeloValidado.ok) return padreSubmodeloValidado;
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
    ...(ontologiaValidada.value ? { ontologia: ontologiaValidada.value } : {}),
    ...(Object.keys(satisfaccionesValidadas.value).length > 0 ? { satisfaccionesRequisito: satisfaccionesValidadas.value } : {}),
    ...(Object.keys(submodelosValidados.value).length > 0 ? { submodelos: submodelosValidados.value } : {}),
    ...(padreSubmodeloValidado.value ? { referenciaPadreSubmodelo: padreSubmodeloValidado.value } : {}),
    ...(value.archivado === true ? { archivado: true } : {}),
    ...(typeof value.archivadoEn === "string" ? { archivadoEn: value.archivadoEn } : {}),
    ...(Array.isArray(value.versiones) ? { versiones: normalizarVersiones(value.versiones) } : {}),
    ...(value.crearVersionAlGuardar === true ? { crearVersionAlGuardar: true } : {}),
  };
  const referencias = validarReferenciasOpd(modelo);
  return referencias.ok ? ok(modelo) : referencias;
}

function validarOntologiaOrganizacional(value: unknown): Resultado<OntologiaOrganizacional | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo("Modelo inválido: ontologia");
  if (value.modo !== "none" && value.modo !== "suggest" && value.modo !== "enforce") {
    return fallo("Modelo inválido: ontologia.modo");
  }
  if (!Array.isArray(value.terminos)) return fallo("Modelo inválido: ontologia.terminos");
  const terminos: OntologiaOrganizacional["terminos"] = [];
  for (const item of value.terminos) {
    if (!esRecord(item) || typeof item.canonico !== "string" || !item.canonico.trim()) {
      return fallo("Modelo inválido: ontologia.terminos");
    }
    if (item.sinonimos !== undefined && !Array.isArray(item.sinonimos)) {
      return fallo("Modelo inválido: ontologia.terminos.sinonimos");
    }
    const sinonimos = (item.sinonimos ?? []).map((sinonimo: unknown) => {
      if (typeof sinonimo !== "string") return null;
      const limpio = sinonimo.trim();
      return limpio || null;
    });
    if (sinonimos.some((sinonimo: string | null) => sinonimo === null)) {
      return fallo("Modelo inválido: ontologia.terminos.sinonimos");
    }
    terminos.push({
      canonico: item.canonico.trim(),
      ...(sinonimos.length > 0 ? { sinonimos: sinonimos as string[] } : {}),
      ...(typeof item.descripcion === "string" && item.descripcion.trim() ? { descripcion: item.descripcion.trim() } : {}),
    });
  }
  return ok({ modo: value.modo, terminos });
}

function validarSatisfaccionesRequisito(
  value: unknown,
  entidades: Modelo["entidades"],
  enlaces: Modelo["enlaces"],
): Resultado<Record<Id, SatisfaccionRequisito>> {
  if (value === undefined) return ok({});
  if (!esRecord(value)) return fallo("Modelo inválido: satisfaccionesRequisito");
  const satisfacciones: Record<Id, SatisfaccionRequisito> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw) || raw.id !== id) return fallo(`Satisfacción de requisito inválida: ${id}`);
    if (typeof raw.requisitoEntidadId !== "string" || entidades[raw.requisitoEntidadId]?.estereotipo !== "requirement") {
      return fallo(`Satisfacción de requisito inválida: ${id}.requisitoEntidadId`);
    }
    if (!esRecord(raw.target) || (raw.target.tipo !== "entidad" && raw.target.tipo !== "enlace") || typeof raw.target.id !== "string") {
      return fallo(`Satisfacción de requisito inválida: ${id}.target`);
    }
    if (raw.target.tipo === "entidad" && !entidades[raw.target.id]) return fallo(`Satisfacción de requisito inválida: ${id}.target.id`);
    if (raw.target.tipo === "enlace" && !enlaces[raw.target.id]) return fallo(`Satisfacción de requisito inválida: ${id}.target.id`);
    if (!esEstadoSatisfaccion(raw.estado)) return fallo(`Satisfacción de requisito inválida: ${id}.estado`);
    satisfacciones[id] = {
      id,
      requisitoEntidadId: raw.requisitoEntidadId,
      target: { tipo: raw.target.tipo, id: raw.target.id },
      estado: raw.estado,
      ...(typeof raw.descripcion === "string" && raw.descripcion.trim() ? { descripcion: raw.descripcion.trim() } : {}),
    };
  }
  return ok(satisfacciones);
}

function validarSubmodelos(
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
    refs[id] = {
      id,
      modeloId: raw.modeloId,
      nombre: raw.nombre.trim(),
      anchorEntidadId: raw.anchorEntidadId,
      estado: raw.estado,
      ...(raw.opdVistaId ? { opdVistaId: raw.opdVistaId } : {}),
      ...(esRecord(raw.compartidas) ? { compartidas: Object.fromEntries(Object.entries(raw.compartidas).filter(([, v]) => typeof v === "string")) as Record<Id, Id> } : {}),
    };
  }
  return ok(refs);
}

function validarReferenciaPadreSubmodelo(value: unknown, entidades: Modelo["entidades"]): Resultado<ReferenciaPadreSubmodelo | undefined> {
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

function esEstadoSatisfaccion(value: unknown): value is EstadoSatisfaccionRequisito {
  return value === "pendiente" || value === "satisface" || value === "parcial" || value === "no-satisface";
}
