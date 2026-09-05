import type { Id, Modelo, Resultado } from "../modelo/tipos";
import { sincronizarPuertosTodosLosOpd } from "../modelo/operaciones";
import { validarEnlaces, validarAbanicos } from "./validarEnlaces";
import { validarEntidades } from "./validarEntidades";
import { esEnteroSeguro, esRecord, fallo, ok } from "./validarHelpers";
import { validarReferenciasOpd } from "./validarIntegridad";
import { normalizarModelo, normalizarVersiones } from "./validarNormalizacion";
import { validarOpds } from "./validarOpds";
import { validarEstados } from "./validarEstados";
import { validarDeclaracionesNoNucleares } from "./validarDeclaracionesNoNucleares";
import { validarFamiliasEfectosPreestado } from "./validarFamiliasEfectosPreestado";
import { validarMesaExploracion } from "./validateExploration";
import { validarSatisfaccionesRequisito, validarAnclasNormativas, validarNotasMesa } from "./validateAnnotations";
import { validarOntologiaOrganizacional, validarFichaTrabajo, validarLentesConocimiento, validarProcedencia } from "./validateAuthoring";
import { validarEstereotipos } from "./validateStereotypes";
import { validarSubmodelos, validarReferenciaPadreSubmodelo } from "./validateSubmodels";

const FORMATO = "deep-opm-pro.modelo.v0";

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
  const opdsValidados = validarOpds(opds, entidadesValidadas.value, opdRaizId);
  if (!opdsValidados.ok) return opdsValidados;
  if (!opdsValidados.value[opdRaizId]) return fallo(`OPD raíz no existe: ${opdRaizId}`);
  const enlacesValidados = validarEnlaces(enlaces, entidadesValidadas.value, estadosValidados.value);
  if (!enlacesValidados.ok) return enlacesValidados;
  const ontologiaValidada = validarOntologiaOrganizacional(value.ontologia);
  if (!ontologiaValidada.ok) return ontologiaValidada;
  const satisfaccionesValidadas = validarSatisfaccionesRequisito(value.satisfaccionesRequisito, entidadesValidadas.value, enlacesValidados.value);
  if (!satisfaccionesValidadas.ok) return satisfaccionesValidadas;
  const anclasValidadas = validarAnclasNormativas(
    value.anclasNormativas,
    entidadesValidadas.value,
    enlacesValidados.value,
    opdsValidados.value,
  );
  if (!anclasValidadas.ok) return anclasValidadas;
  const notasMesaValidadas = validarNotasMesa(
    value.notasMesa,
    entidadesValidadas.value,
    enlacesValidados.value,
    opdsValidados.value,
  );
  if (!notasMesaValidadas.ok) return notasMesaValidadas;
  const mesaExploracionValidada = validarMesaExploracion(
    value.mesaExploracion,
    opdsValidados.value,
  );
  if (!mesaExploracionValidada.ok) return mesaExploracionValidada;
  const estereotiposValidados = validarEstereotipos(value.estereotipos);
  if (!estereotiposValidados.ok) return estereotiposValidados;
  const procedenciaValidada = validarProcedencia(value.procedencia);
  if (!procedenciaValidada.ok) return procedenciaValidada;
  const fichaTrabajoValidada = validarFichaTrabajo(value.fichaTrabajo);
  if (!fichaTrabajoValidada.ok) return fichaTrabajoValidada;
  const lentesConocimientoValidadas = validarLentesConocimiento(value.lentesConocimiento);
  if (!lentesConocimientoValidadas.ok) return lentesConocimientoValidadas;
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
  const familiasValidadas = validarFamiliasEfectosPreestado(value.familiasEfectosPreestado, {
    opds: opdsValidados.value,
    entidades: entidadesValidadas.value,
    estados: estadosValidados.value,
    enlaces: enlacesValidados.value,
    abanicos: abanicosValidados.value,
  });
  if (!familiasValidadas.ok) return familiasValidadas;
  const declaracionesValidadas = validarDeclaracionesNoNucleares(value.declaracionesNoNucleares, {
    opds: opdsValidados.value,
    entidades: entidadesValidadas.value,
    estados: estadosValidados.value,
    enlaces: enlacesValidados.value,
    abanicos: abanicosValidados.value,
  });
  if (!declaracionesValidadas.ok) return declaracionesValidadas;

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
    ...(Object.keys(declaracionesValidadas.value).length > 0 ? { declaracionesNoNucleares: declaracionesValidadas.value } : {}),
    ...(Object.keys(familiasValidadas.value).length > 0 ? { familiasEfectosPreestado: familiasValidadas.value } : {}),
    ...(Object.keys(anclasValidadas.value).length > 0 ? { anclasNormativas: anclasValidadas.value } : {}),
    ...(Object.keys(notasMesaValidadas.value).length > 0 ? { notasMesa: notasMesaValidadas.value } : {}),
    ...(mesaExploracionValidada.value ? { mesaExploracion: mesaExploracionValidada.value } : {}),
    ...(Object.keys(estereotiposValidados.value).length > 0 ? { estereotipos: estereotiposValidados.value } : {}),
    ...(procedenciaValidada.value ? { procedencia: procedenciaValidada.value } : {}),
    ...(fichaTrabajoValidada.value ? { fichaTrabajo: fichaTrabajoValidada.value } : {}),
    ...(lentesConocimientoValidadas.value ? { lentesConocimiento: lentesConocimientoValidadas.value } : {}),
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
