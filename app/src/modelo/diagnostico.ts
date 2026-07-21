import { verificarMetodologia } from "./checkers";
import { listarAvisosVisuales } from "./diagnosticoVisual";
import { nombreExtremo } from "./extremos";
import { tituloDeRegla } from "./tituloRegla";
import type { Aviso, ElementoAvisoTipo, SeveridadAviso } from "./validaciones";
import { validarModelo } from "./validaciones";
import type { AvisoMetodologico, CodigoChecker, Id, Modelo, NavegacionAviso } from "./tipos";

export type OrigenAvisoDiagnostico = "validacion" | "metodologia" | "visual";

/**
 * `titulo`: leyenda humana de la regla, mapeada en
 * {@link import("./tituloRegla").tituloDeRegla}. Es solo para presentación;
 * los testids y la serialización siguen usando `testIdCodigo` / `codigo` /
 * `reglaId` sin cambios (ronda23 L2 #2).
 */
export interface AvisoDiagnostico {
  id: string;
  origen: OrigenAvisoDiagnostico;
  reglaId: string;
  codigo: string;
  codigoVisible: string;
  testIdCodigo: string;
  titulo: string;
  severidad: SeveridadAviso;
  mensaje: string;
  destino: string;
  cita: string;
  citaSSOT: string;
  /** Fuente normativa separada del fundamento y de las acciones para que la
   * UI pueda revelar el criterio progresivamente, sin concatenar una pared de texto. */
  fuente?: string;
  fundamento?: string;
  acciones?: string[];
  avisoNavegable: Aviso | null;
  elementoTipo?: ElementoAvisoTipo;
  elementoId?: Id;
  opdId?: Id;
  navegarA?: NavegacionAviso;
}

export type AlcanceAvisosDiagnostico =
  | { tipo: "opd"; opdId: Id }
  | { tipo: "modelo" };

const CODIGOS_EQUIVALENTES: Readonly<Record<string, string>> = {
  "proceso-sin-entrada-ni-salida": "PROCESO_NO_TRANSFORMA",
  "visual-subproceso-sin-transformado": "PROCESO_NO_TRANSFORMA",
  "consumo-doble-mismo-objeto": "PAR_TRANSFORMADOR_DUPLICADO",
};

/** Identidad de regla compartida por panel, árbol y badges inline. Distintos
 * productores que observan el mismo hecho deben converger en una sola regla. */
export function codigoDiagnosticoCanonico(codigo: string): string {
  return CODIGOS_EQUIVALENTES[codigo] ?? codigo;
}

export function listarAvisosDiagnostico(modelo: Modelo, alcance: AlcanceAvisosDiagnostico): AvisoDiagnostico[] {
  // `validarModelo` ya barre el modelo completo; ejecutarlo una vez por OPD era
  // O(OPDs²) y después ocultaba las repeticiones con deduplicación.
  const opdPrioritario = alcance.tipo === "opd" ? alcance.opdId : modelo.opdRaizId;
  const avisosValidacion = validarModelo(modelo, opdPrioritario);
  const avisosVisuales = alcance.tipo === "modelo"
    ? Object.keys(modelo.opds).flatMap((opdId) => listarAvisosVisuales(modelo, opdId))
    : listarAvisosVisuales(modelo, alcance.opdId);
  const avisos = [
    ...avisosValidacion.map((aviso, index) => diagnosticoDesdeValidacion(modelo, aviso, index)),
    ...avisosVisuales.map((aviso, index) => diagnosticoDesdeVisual(modelo, aviso, index)),
    ...verificarMetodologia(modelo).map((aviso, index) => diagnosticoDesdeMetodologia(modelo, aviso, index)),
  ];
  const enAlcance = alcance.tipo === "modelo"
    ? avisos
    : avisos.filter((aviso) => avisoAfectaOpd(modelo, alcance.opdId, aviso));
  return deduplicarAvisosDiagnostico(enAlcance);
}

function diagnosticoDesdeValidacion(modelo: Modelo, aviso: Aviso, index: number): AvisoDiagnostico {
  const testIdCodigo = codigoDiagnosticoCanonico(aviso.reglaId);
  return {
    id: identidadDiagnostico("validacion", testIdCodigo, aviso, index, aviso.reglaId),
    origen: "validacion",
    reglaId: aviso.reglaId,
    codigo: aviso.reglaId,
    codigoVisible: aviso.reglaId,
    testIdCodigo,
    titulo: tituloDeRegla(aviso.reglaId),
    severidad: aviso.severidad,
    mensaje: aviso.mensaje,
    destino: etiquetaElemento(modelo, aviso),
    cita: aviso.citaSSOT,
    citaSSOT: aviso.citaSSOT,
    fuente: aviso.citaSSOT,
    acciones: [],
    avisoNavegable: aviso,
    ...(aviso.elementoTipo ? { elementoTipo: aviso.elementoTipo } : {}),
    ...(aviso.elementoId ? { elementoId: aviso.elementoId } : {}),
    ...(aviso.opdId ? { opdId: aviso.opdId } : {}),
  };
}

function diagnosticoDesdeVisual(modelo: Modelo, aviso: Aviso, index: number): AvisoDiagnostico {
  const testIdCodigo = codigoDiagnosticoCanonico(aviso.reglaId);
  return {
    id: identidadDiagnostico("visual", testIdCodigo, aviso, index, aviso.reglaId),
    origen: "visual",
    reglaId: aviso.reglaId,
    codigo: aviso.reglaId,
    codigoVisible: aviso.reglaId,
    testIdCodigo,
    titulo: tituloDeRegla(aviso.reglaId),
    severidad: aviso.severidad,
    mensaje: aviso.mensaje,
    destino: etiquetaElemento(modelo, aviso),
    cita: aviso.citaSSOT,
    citaSSOT: aviso.citaSSOT,
    fuente: aviso.citaSSOT,
    acciones: [],
    avisoNavegable: aviso,
    ...(aviso.elementoTipo ? { elementoTipo: aviso.elementoTipo } : {}),
    ...(aviso.elementoId ? { elementoId: aviso.elementoId } : {}),
    ...(aviso.opdId ? { opdId: aviso.opdId } : {}),
  };
}

function diagnosticoDesdeMetodologia(modelo: Modelo, aviso: AvisoMetodologico, index: number): AvisoDiagnostico {
  const navegable = adaptarAvisoMetodologico(aviso);
  const destino = resolverDestino(aviso);
  const testIdCodigo = codigoDiagnosticoCanonico(aviso.codigo);
  const identidad: Pick<Aviso, "elementoTipo" | "elementoId" | "opdId"> = {
    ...(destino?.tipo ? { elementoTipo: destino.tipo === "opd" ? "opd" : "entidad" } : {}),
    ...(destino?.id ? { elementoId: destino.id } : {}),
    ...(destino?.opdId ? { opdId: destino.opdId } : aviso.opdId ? { opdId: aviso.opdId } : {}),
  };
  return {
    id: identidadDiagnostico("metodologia", testIdCodigo, identidad, index, aviso.codigo),
    origen: "metodologia",
    reglaId: aviso.codigo,
    codigo: aviso.codigo,
    codigoVisible: etiquetaCodigo(aviso.codigo),
    testIdCodigo,
    titulo: tituloDeRegla(aviso.codigo),
    severidad: aviso.severidad === "sugerencia" ? "info" : aviso.severidad,
    mensaje: aviso.mensaje,
    destino: etiquetaDestinoMetodologico(modelo, aviso),
    cita: detalleCitaMetodologica(aviso),
    citaSSOT: aviso.ssotRef ?? "",
    fuente: aviso.ssotRef ?? "SSOT OPM",
    ...(aviso.rationale ? { fundamento: aviso.rationale } : {}),
    acciones: [...(aviso.accionesSugeridas ?? [])],
    avisoNavegable: navegable,
    ...(destino?.tipo ? { elementoTipo: destino.tipo === "opd" ? "opd" : "entidad" } : {}),
    ...(destino?.id ? { elementoId: destino.id } : {}),
    ...(destino?.opdId ? { opdId: destino.opdId } : aviso.opdId ? { opdId: aviso.opdId } : {}),
    ...(aviso.navegarA ? { navegarA: aviso.navegarA } : {}),
  };
}

function detalleCitaMetodologica(aviso: AvisoMetodologico): string {
  return [
    aviso.ssotRef,
    aviso.rationale,
    ...(aviso.accionesSugeridas ?? []).map((accion) => `Accion: ${accion}`),
  ].filter(Boolean).join(" · ") || "SSOT OPM";
}

function adaptarAvisoMetodologico(aviso: AvisoMetodologico): Aviso | null {
  const destino = resolverDestino(aviso);
  if (!destino) return null;
  const adaptado: Aviso = {
    reglaId: aviso.codigo,
    severidad: aviso.severidad === "sugerencia" ? "info" : aviso.severidad,
    mensaje: aviso.mensaje,
    citaSSOT: aviso.ssotRef ?? "",
    elementoTipo: destino.tipo === "opd" ? "opd" : "entidad",
    elementoId: destino.id,
  };
  if (destino.opdId) adaptado.opdId = destino.opdId;
  return adaptado;
}

function resolverDestino(aviso: AvisoMetodologico): NavegacionAviso | null {
  if (aviso.navegarA) return aviso.navegarA;
  if (aviso.entidadId) {
    const destino: NavegacionAviso = { tipo: "entidad", id: aviso.entidadId };
    if (aviso.opdId) destino.opdId = aviso.opdId;
    return destino;
  }
  if (aviso.opdId) return { tipo: "opd", id: aviso.opdId };
  return null;
}

function etiquetaElemento(modelo: Modelo, aviso: Aviso): string {
  if (aviso.elementoTipo === "entidad" && aviso.elementoId) {
    const entidad = modelo.entidades[aviso.elementoId];
    return entidad?.nombre ?? aviso.elementoId;
  }
  if (aviso.elementoTipo === "enlace" && aviso.elementoId) {
    const enlace = modelo.enlaces[aviso.elementoId];
    if (!enlace) return aviso.elementoId;
    return `${nombreExtremo(modelo, enlace.origenId)} → ${nombreExtremo(modelo, enlace.destinoId)}`;
  }
  if (aviso.elementoTipo === "opd" && aviso.elementoId) return modelo.opds[aviso.elementoId]?.nombre ?? aviso.elementoId;
  return "Modelo";
}

function etiquetaDestinoMetodologico(modelo: Modelo, aviso: AvisoMetodologico): string {
  if (aviso.entidadId) return modelo.entidades[aviso.entidadId]?.nombre ?? aviso.entidadId;
  if (aviso.opdId) return modelo.opds[aviso.opdId]?.nombre ?? aviso.opdId;
  return "Modelo";
}

function etiquetaCodigo(codigo: CodigoChecker): string {
  return codigo.toLowerCase().replaceAll("_", " ");
}

function deduplicarAvisosDiagnostico(avisos: AvisoDiagnostico[]): AvisoDiagnostico[] {
  return Array.from(new Map(avisos.map((aviso) => [aviso.id, aviso])).values());
}

function identidadDiagnostico(
  origen: OrigenAvisoDiagnostico,
  codigo: string,
  aviso: Pick<Aviso, "elementoTipo" | "elementoId" | "opdId">,
  index: number,
  codigoFuente: string,
): string {
  const destino = aviso.elementoTipo && aviso.elementoId
    ? `${aviso.elementoTipo}:${aviso.elementoId}`
    : aviso.opdId
      ? `opd:${aviso.opdId}`
      : `global:${index}`;
  // Un mismo problema visual sobre la misma entidad puede existir en dos OPDs.
  // Las equivalencias cross-productor (p.ej. proceso sin transformar) omiten el
  // OPD para converger con la regla metodológica rica.
  const esEquivalencia = origen === "visual" && codigo !== codigoFuente;
  const contextoVisual = origen === "visual" && aviso.opdId && !esEquivalencia ? `@${aviso.opdId}` : "";
  return `${codigo}:${destino}${contextoVisual}`;
}

function avisoAfectaOpd(modelo: Modelo, opdId: Id, aviso: AvisoDiagnostico): boolean {
  if (aviso.opdId) return aviso.opdId === opdId;
  if (aviso.navegarA?.opdId) return aviso.navegarA.opdId === opdId;
  if (aviso.navegarA?.tipo === "opd") return aviso.navegarA.id === opdId;
  if (aviso.elementoTipo === "opd" && aviso.elementoId) return aviso.elementoId === opdId;
  if (aviso.elementoTipo === "entidad" && aviso.elementoId) {
    return Object.values(modelo.opds[opdId]?.apariencias ?? {})
      .some((apariencia) => apariencia.entidadId === aviso.elementoId);
  }
  if (aviso.elementoTipo === "enlace" && aviso.elementoId) {
    return Object.values(modelo.opds[opdId]?.enlaces ?? {})
      .some((apariencia) => apariencia.enlaceId === aviso.elementoId);
  }
  return opdId === modelo.opdRaizId;
}
