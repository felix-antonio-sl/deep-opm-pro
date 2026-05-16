import { verificarMetodologia } from "./checkers";
import { nombreExtremo } from "./extremos";
import type { Aviso, ElementoAvisoTipo, SeveridadAviso } from "./validaciones";
import { validarModelo } from "./validaciones";
import type { AvisoMetodologico, CodigoChecker, Id, Modelo, NavegacionAviso } from "./tipos";

export type OrigenAvisoDiagnostico = "validacion" | "metodologia";

export interface AvisoDiagnostico {
  id: string;
  origen: OrigenAvisoDiagnostico;
  reglaId: string;
  codigo: string;
  codigoVisible: string;
  testIdCodigo: string;
  severidad: SeveridadAviso;
  mensaje: string;
  destino: string;
  cita: string;
  citaSSOT: string;
  avisoNavegable: Aviso | null;
  elementoTipo?: ElementoAvisoTipo;
  elementoId?: Id;
  opdId?: Id;
  navegarA?: NavegacionAviso;
}

export type AlcanceAvisosDiagnostico =
  | { tipo: "opd"; opdId: Id }
  | { tipo: "modelo" };

export function listarAvisosDiagnostico(modelo: Modelo, alcance: AlcanceAvisosDiagnostico): AvisoDiagnostico[] {
  const avisosValidacion = alcance.tipo === "modelo"
    ? Object.keys(modelo.opds).flatMap((opdId) => validarModelo(modelo, opdId))
    : validarModelo(modelo, alcance.opdId);
  return deduplicarAvisosDiagnostico([
    ...avisosValidacion.map((aviso, index) => diagnosticoDesdeValidacion(modelo, aviso, index)),
    ...verificarMetodologia(modelo).map((aviso, index) => diagnosticoDesdeMetodologia(modelo, aviso, index)),
  ]);
}

function diagnosticoDesdeValidacion(modelo: Modelo, aviso: Aviso, index: number): AvisoDiagnostico {
  return {
    id: `val-${aviso.reglaId}-${aviso.elementoId ?? aviso.opdId ?? index}`,
    origen: "validacion",
    reglaId: aviso.reglaId,
    codigo: aviso.reglaId,
    codigoVisible: aviso.reglaId,
    testIdCodigo: aviso.reglaId,
    severidad: aviso.severidad,
    mensaje: aviso.mensaje,
    destino: etiquetaElemento(modelo, aviso),
    cita: aviso.citaSSOT,
    citaSSOT: aviso.citaSSOT,
    avisoNavegable: aviso,
    ...(aviso.elementoTipo ? { elementoTipo: aviso.elementoTipo } : {}),
    ...(aviso.elementoId ? { elementoId: aviso.elementoId } : {}),
    ...(aviso.opdId ? { opdId: aviso.opdId } : {}),
  };
}

function diagnosticoDesdeMetodologia(modelo: Modelo, aviso: AvisoMetodologico, index: number): AvisoDiagnostico {
  const navegable = adaptarAvisoMetodologico(aviso);
  const destino = resolverDestino(aviso);
  return {
    id: `met-${aviso.codigo}-${aviso.entidadId ?? aviso.opdId ?? index}`,
    origen: "metodologia",
    reglaId: aviso.codigo,
    codigo: aviso.codigo,
    codigoVisible: etiquetaCodigo(aviso.codigo),
    testIdCodigo: aviso.codigo,
    severidad: aviso.severidad === "sugerencia" ? "info" : aviso.severidad,
    mensaje: aviso.mensaje,
    destino: etiquetaDestinoMetodologico(modelo, aviso),
    cita: detalleCitaMetodologica(aviso),
    citaSSOT: aviso.ssotRef ?? "",
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
    return entidad ? `${entidad.nombre} · ${entidad.id}` : aviso.elementoId;
  }
  if (aviso.elementoTipo === "enlace" && aviso.elementoId) {
    const enlace = modelo.enlaces[aviso.elementoId];
    if (!enlace) return aviso.elementoId;
    return `${nombreExtremo(modelo, enlace.origenId)} -> ${nombreExtremo(modelo, enlace.destinoId)} · ${enlace.id}`;
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
