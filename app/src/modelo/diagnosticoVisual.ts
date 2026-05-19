import { aparienciaEsExternaDeRefinamiento } from "./contextoRefinamiento";
import { entidadIdDeExtremo, nombreExtremo } from "./extremos";
import { contenedorRefinamiento, dentroDeApariencia } from "./layout";
import { aparienciaDeEntidadEnOpd } from "./politicaApariciones";
import type { Apariencia, Enlace, ExtremoEnlace, Id, Modelo, Opd, PuertoApariencia } from "./tipos";
import type { Aviso } from "./validaciones";

const CITA_VISUAL = "opm-visual-es.md §OPD / §Enlaces";
const CITA_REFINAMIENTO = "metodologia-opm-es.md §7.1 / opm-visual-es.md §in-zoom";
const EPSILON_PUERTO = 0.001;

export function listarAvisosVisuales(modelo: Modelo, opdId: Id): Aviso[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  return [
    ...detectarSolapes(modelo, opd),
    ...detectarEnlacesConExtremosNoVisibles(modelo, opd),
    ...detectarExternosDentroContorno(modelo, opd),
    ...detectarVerticesInvalidos(modelo, opd),
    ...detectarPuertosInteriores(modelo, opd),
  ];
}

function detectarSolapes(modelo: Modelo, opd: Opd): Aviso[] {
  const avisos: Aviso[] = [];
  const contorno = contenedorRefinamiento(modelo, opd.id);
  const apariencias = Object.values(opd.apariencias);
  for (let i = 0; i < apariencias.length; i += 1) {
    for (let j = i + 1; j < apariencias.length; j += 1) {
      const a = apariencias[i]!;
      const b = apariencias[j]!;
      if (contorno && (a.id === contorno.id || b.id === contorno.id)) continue;
      const area = areaInterseccion(a, b);
      if (area <= 0) continue;
      const entidadA = modelo.entidades[a.entidadId];
      const entidadB = modelo.entidades[b.entidadId];
      avisos.push({
        reglaId: "visual-solape-apariencias",
        severidad: "advertencia",
        mensaje: `Las apariencias ${entidadA?.nombre ?? a.entidadId} y ${entidadB?.nombre ?? b.entidadId} se solapan visualmente en ${opd.nombre}.`,
        citaSSOT: CITA_VISUAL,
        elementoTipo: "entidad",
        elementoId: a.entidadId,
        opdId: opd.id,
      });
    }
  }
  return avisos;
}

function detectarEnlacesConExtremosNoVisibles(modelo: Modelo, opd: Opd): Aviso[] {
  const avisos: Aviso[] = [];
  for (const aparienciaEnlace of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) {
      avisos.push({
        reglaId: "visual-enlace-modelo-inexistente",
        severidad: "advertencia",
        mensaje: `La apariencia de enlace ${aparienciaEnlace.id} no tiene enlace lógico asociado.`,
        citaSSOT: CITA_VISUAL,
        elementoTipo: "enlace",
        elementoId: aparienciaEnlace.enlaceId,
        opdId: opd.id,
      });
      continue;
    }
    for (const lado of ["origen", "destino"] as const) {
      const extremo = lado === "origen" ? enlace.origenId : enlace.destinoId;
      const entidadId = entidadIdDeExtremo(modelo, extremo);
      if (!entidadId || aparienciaDeEntidadEnOpd(opd, entidadId)) continue;
      avisos.push({
        reglaId: "visual-enlace-extremo-no-visible",
        severidad: "advertencia",
        mensaje: `El enlace ${etiquetaEnlace(modelo, enlace)} se renderiza en ${opd.nombre}, pero su ${lado} ${nombreExtremo(modelo, extremo)} no tiene apariencia local.`,
        citaSSOT: CITA_VISUAL,
        elementoTipo: "enlace",
        elementoId: enlace.id,
        opdId: opd.id,
      });
    }
  }
  return avisos;
}

function detectarExternosDentroContorno(modelo: Modelo, opd: Opd): Aviso[] {
  const contorno = contenedorRefinamiento(modelo, opd.id);
  if (!contorno) return [];
  return Object.values(opd.apariencias).flatMap((apariencia) => {
    if (apariencia.id === contorno.id) return [];
    if (!aparienciaEsExternaDeRefinamiento(modelo, opd.id, apariencia)) return [];
    if (!dentroDeApariencia(apariencia, contorno)) return [];
    const entidad = modelo.entidades[apariencia.entidadId];
    return [{
      reglaId: "visual-externo-dentro-contorno",
      severidad: "advertencia",
      mensaje: `La cosa externa ${entidad?.nombre ?? apariencia.entidadId} quedó dentro del contorno refinado ${modelo.entidades[contorno.entidadId]?.nombre ?? contorno.entidadId}.`,
      citaSSOT: CITA_REFINAMIENTO,
      elementoTipo: "entidad",
      elementoId: apariencia.entidadId,
      opdId: opd.id,
    } satisfies Aviso];
  });
}

function detectarVerticesInvalidos(modelo: Modelo, opd: Opd): Aviso[] {
  return Object.values(opd.enlaces).flatMap((aparienciaEnlace) => {
    const invalido = aparienciaEnlace.vertices.some((vertice) => !Number.isFinite(vertice.x) || !Number.isFinite(vertice.y));
    if (!invalido) return [];
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    return [{
      reglaId: "visual-vertices-enlace-invalidos",
      severidad: "advertencia",
      mensaje: `El enlace ${enlace ? etiquetaEnlace(modelo, enlace) : aparienciaEnlace.enlaceId} tiene vértices no finitos y puede romper el routing visual.`,
      citaSSOT: CITA_VISUAL,
      elementoTipo: "enlace",
      elementoId: aparienciaEnlace.enlaceId,
      opdId: opd.id,
    } satisfies Aviso];
  });
}

function detectarPuertosInteriores(modelo: Modelo, opd: Opd): Aviso[] {
  const avisos: Aviso[] = [];
  for (const aparienciaEnlace of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) continue;
    for (const lado of ["origen", "destino"] as const) {
      const extremo = lado === "origen" ? enlace.origenId : enlace.destinoId;
      const puerto = puertoDeExtremo(opd, extremo);
      if (!puerto || puertoEnBorde(puerto)) continue;
      avisos.push({
        reglaId: "visual-puerto-enlace-interior",
        severidad: "advertencia",
        mensaje: `El ${lado} del enlace ${etiquetaEnlace(modelo, enlace)} usa un puerto interior; el extremo puede quedar detrás de la cosa.`,
        citaSSOT: CITA_VISUAL,
        elementoTipo: "enlace",
        elementoId: enlace.id,
        opdId: opd.id,
      });
    }
  }
  return avisos;
}

function puertoDeExtremo(opd: Opd, extremo: ExtremoEnlace): PuertoApariencia | null {
  if (extremo.kind !== "entidad" || !extremo.portId) return null;
  const apariencia = aparienciaDeEntidadEnOpd(opd, extremo.id);
  return apariencia?.ports?.[extremo.portId] ?? null;
}

function puertoEnBorde(puerto: PuertoApariencia): boolean {
  return (
    cercaDe(puerto.x, 0) ||
    cercaDe(puerto.x, 1) ||
    cercaDe(puerto.y, 0) ||
    cercaDe(puerto.y, 1)
  );
}

function cercaDe(valor: number, esperado: number): boolean {
  return Math.abs(valor - esperado) <= EPSILON_PUERTO;
}

function areaInterseccion(a: Apariencia, b: Apariencia): number {
  const ancho = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const alto = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  return ancho * alto;
}

function etiquetaEnlace(modelo: Modelo, enlace: Enlace): string {
  return `${nombreExtremo(modelo, enlace.origenId)} -> ${nombreExtremo(modelo, enlace.destinoId)}`;
}
