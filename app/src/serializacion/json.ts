import type {
  AnclaNormativa,
  NotaMesa,
  EstadoAncla,
  EstadoCargaSubmodelo,
  EstadoRatificacion,
  EstadoSatisfaccionRequisito,
  Id,
  Modelo,
  NivelAutoridad,
  OntologiaOrganizacional,
  RatificacionAncla,
  ReferenciaNorma,
  ReferenciaPadreSubmodelo,
  Resultado,
  SatisfaccionRequisito,
  SelloProcedencia,
  SubmodeloReferencia,
} from "../modelo/tipos";
import { COMPONENTES_SELLO } from "../modelo/tipos";
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
  const procedenciaValidada = validarProcedencia(value.procedencia);
  if (!procedenciaValidada.ok) return procedenciaValidada;
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
    ...(Object.keys(anclasValidadas.value).length > 0 ? { anclasNormativas: anclasValidadas.value } : {}),
    ...(Object.keys(notasMesaValidadas.value).length > 0 ? { notasMesa: notasMesaValidadas.value } : {}),
    ...(procedenciaValidada.value ? { procedencia: procedenciaValidada.value } : {}),
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

/**
 * Valida `anclasNormativas` (W5.1). Extensión aditiva: ausente ⇒ `{}` (byte-identidad
 * sobre opcional ausente). Cada ancla exige `claveProto` presente, `estado` legal y
 * `target` RESOLUBLE contra entidades/enlaces/opds (o `tipo:"modelo"` sin id). Un target
 * irresoluble se RECHAZA con diagnóstico (no se descarta en silencio — L8 fixture negativo).
 */
function validarAnclasNormativas(
  value: unknown,
  entidades: Modelo["entidades"],
  enlaces: Modelo["enlaces"],
  opds: Modelo["opds"],
): Resultado<Record<Id, AnclaNormativa>> {
  if (value === undefined) return ok({});
  if (!esRecord(value)) return fallo("Modelo inválido: anclasNormativas");
  const anclas: Record<Id, AnclaNormativa> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw) || raw.id !== id) return fallo(`Ancla normativa inválida: ${id}`);
    if (typeof raw.claveProto !== "string" || !raw.claveProto.trim()) {
      return fallo(`Ancla normativa inválida: ${id}.claveProto`);
    }
    if (!esEstadoAncla(raw.estado)) return fallo(`Ancla normativa inválida: ${id}.estado`);
    const target = validarTargetAncla(id, raw.target, entidades, enlaces, opds);
    if (!target.ok) return target;
    const referencias = validarReferenciasNorma(id, raw.referencias);
    if (!referencias.ok) return referencias;
    const ratificacion = validarRatificacionAncla(id, raw.ratificacion);
    if (!ratificacion.ok) return ratificacion;
    anclas[id] = {
      id,
      claveProto: raw.claveProto.trim(),
      target: target.value,
      estado: raw.estado,
      ...(referencias.value.length > 0 ? { referencias: referencias.value } : {}),
      ...(typeof raw.nota === "string" && raw.nota.trim() ? { nota: raw.nota.trim() } : {}),
      ...(ratificacion.value ? { ratificacion: ratificacion.value } : {}),
    };
  }
  return ok(anclas);
}

/**
 * Valida `notasMesa` (W6.5-a). Extensión aditiva: ausente ⇒ `{}` (byte-identidad sobre
 * opcional ausente). Cada nota exige `texto` y `fecha` presentes y `target` RESOLUBLE
 * (mismo contrato que las anclas: irresoluble se RECHAZA con diagnóstico, no silencio).
 */
function validarNotasMesa(
  value: unknown,
  entidades: Modelo["entidades"],
  enlaces: Modelo["enlaces"],
  opds: Modelo["opds"],
): Resultado<Record<Id, NotaMesa>> {
  if (value === undefined) return ok({});
  if (!esRecord(value)) return fallo("Modelo inválido: notasMesa");
  const notas: Record<Id, NotaMesa> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw) || raw.id !== id) return fallo(`Nota de mesa inválida: ${id}`);
    if (typeof raw.texto !== "string" || !raw.texto.trim()) return fallo(`Nota de mesa inválida: ${id}.texto`);
    if (typeof raw.fecha !== "string" || !raw.fecha.trim()) return fallo(`Nota de mesa inválida: ${id}.fecha`);
    const target = validarTargetAncla(id, raw.target, entidades, enlaces, opds);
    if (!target.ok) return target;
    notas[id] = { id, target: target.value, texto: raw.texto.trim(), fecha: raw.fecha.trim() };
  }
  return ok(notas);
}

/**
 * Valida `procedencia` (W5.3/L6). Extensión aditiva: ausente ⇒ undefined (byte-identidad
 * sobre opcional ausente). Presente ⇒ las 3 componentes del sello deben ser strings no
 * vacíos; un sello malformado se RECHAZA con diagnóstico (no se descarta en silencio).
 */
function validarProcedencia(value: unknown): Resultado<SelloProcedencia | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo("Modelo inválido: procedencia");
  // Glosario eliminado 2026-06-09: el sello vigente tiene 3 componentes. Un
  // `glosarioHash` presente en bundles viejos se TOLERA (no se valida ni se
  // copia → el campo huérfano se descarta sin romper la hidratación).
  for (const componente of COMPONENTES_SELLO) {
    const v = value[componente];
    if (typeof v !== "string" || !v.trim()) return fallo(`Modelo inválido: procedencia.${componente}`);
  }
  const sello: SelloProcedencia = {
    protoHash: (value.protoHash as string).trim(),
    autoriaVersion: (value.autoriaVersion as string).trim(),
    layoutVersion: (value.layoutVersion as string).trim(),
  };
  // doctrinaVersion (corte C2, D-DOCTRINA): testigo OPCIONAL y ROLLBACK-FREE. Se
  // valida SOLO si está presente; un sello legacy de 3 componentes hidrata sin
  // ella. Presente pero no string-no-vacío ⇒ RECHAZO (no se descarta en silencio).
  if (value.doctrinaVersion !== undefined) {
    const dv = value.doctrinaVersion;
    if (typeof dv !== "string" || !dv.trim()) return fallo("Modelo inválido: procedencia.doctrinaVersion");
    sello.doctrinaVersion = dv.trim();
  }
  return ok(sello);
}

function validarTargetAncla(
  id: Id,
  value: unknown,
  entidades: Modelo["entidades"],
  enlaces: Modelo["enlaces"],
  opds: Modelo["opds"],
): Resultado<AnclaNormativa["target"]> {
  if (!esRecord(value)) return fallo(`Ancla normativa inválida: ${id}.target`);
  if (value.tipo === "modelo") return ok({ tipo: "modelo" });
  if (typeof value.id !== "string") return fallo(`Ancla normativa inválida: ${id}.target`);
  if (value.tipo === "entidad") {
    if (!entidades[value.id]) return fallo(`Ancla normativa con target irresoluble: ${id}.target.id (entidad ${value.id})`);
    return ok({ tipo: "entidad", id: value.id });
  }
  if (value.tipo === "enlace") {
    if (!enlaces[value.id]) return fallo(`Ancla normativa con target irresoluble: ${id}.target.id (enlace ${value.id})`);
    return ok({ tipo: "enlace", id: value.id });
  }
  if (value.tipo === "opd") {
    if (!opds[value.id]) return fallo(`Ancla normativa con target irresoluble: ${id}.target.id (opd ${value.id})`);
    return ok({ tipo: "opd", id: value.id });
  }
  return fallo(`Ancla normativa inválida: ${id}.target.tipo`);
}

function validarReferenciasNorma(id: Id, value: unknown): Resultado<ReferenciaNorma[]> {
  if (value === undefined) return ok([]);
  if (!Array.isArray(value)) return fallo(`Ancla normativa inválida: ${id}.referencias`);
  const referencias: ReferenciaNorma[] = [];
  for (const item of value) {
    if (!esRecord(item) || typeof item.norma !== "string" || !item.norma.trim()) {
      return fallo(`Ancla normativa inválida: ${id}.referencias.norma`);
    }
    if (item.articulos !== undefined && (!Array.isArray(item.articulos) || item.articulos.some((a: unknown) => typeof a !== "string"))) {
      return fallo(`Ancla normativa inválida: ${id}.referencias.articulos`);
    }
    const articulos = Array.isArray(item.articulos) ? (item.articulos as string[]).map((a) => a.trim()).filter((a) => a) : [];
    referencias.push({
      norma: item.norma.trim(),
      ...(articulos.length > 0 ? { articulos } : {}),
      ...(typeof item.seccion === "string" && item.seccion.trim() ? { seccion: item.seccion.trim() } : {}),
    });
  }
  return ok(referencias);
}

function validarRatificacionAncla(id: Id, value: unknown): Resultado<RatificacionAncla | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo(`Ancla normativa inválida: ${id}.ratificacion`);
  if (!esNivelAutoridad(value.nivelAutoridad)) return fallo(`Ancla normativa inválida: ${id}.ratificacion.nivelAutoridad`);
  if (!esEstadoRatificacion(value.estadoRatificacion)) return fallo(`Ancla normativa inválida: ${id}.ratificacion.estadoRatificacion`);
  // `ratificado-con-fuente` exige fuente (C1): el salto a hecho confirmado no existe sin fuente.
  if (value.estadoRatificacion === "ratificado-con-fuente" && (typeof value.fuente !== "string" || !value.fuente.trim())) {
    return fallo(`Ancla normativa inválida: ${id}.ratificacion.fuente (obligatoria para ratificado-con-fuente)`);
  }
  return ok({
    nivelAutoridad: value.nivelAutoridad,
    estadoRatificacion: value.estadoRatificacion,
    ...(typeof value.fuente === "string" && value.fuente.trim() ? { fuente: value.fuente.trim() } : {}),
    ...(typeof value.responsable === "string" && value.responsable.trim() ? { responsable: value.responsable.trim() } : {}),
    ...(typeof value.anotadoEn === "string" && value.anotadoEn.trim() ? { anotadoEn: value.anotadoEn.trim() } : {}),
    ...(typeof value.ratificadoEn === "string" && value.ratificadoEn.trim() ? { ratificadoEn: value.ratificadoEn.trim() } : {}),
  });
}

function esEstadoAncla(value: unknown): value is EstadoAncla {
  return value === "vigente" || value === "pendiente-ratificacion";
}

function esNivelAutoridad(value: unknown): value is NivelAutoridad {
  return value === "operador-modelado" || value === "mesa" || value === "dt-seremi-legal";
}

function esEstadoRatificacion(value: unknown): value is EstadoRatificacion {
  return value === "pendiente" || value === "anotado-en-mesa" || value === "ratificado-con-fuente";
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
