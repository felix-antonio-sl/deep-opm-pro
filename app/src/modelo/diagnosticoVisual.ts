import {
  aparienciaEsExternaDeRefinamiento,
  aparienciaEsInternaDeRefinamiento,
} from "./contextoRefinamiento";
import {
  entidadIdDeExtremo,
  extremoApuntaAEntidad,
  nombreExtremo,
} from "./extremos";
import { contenedorRefinamiento, dentroDeApariencia } from "./layout";
import { aparienciaDeEntidadEnOpd } from "./politicaApariciones";
import type {
  AnclajeSimboloEstructural,
  Apariencia,
  AparienciaEnlace,
  Enlace,
  ExtremoEnlace,
  Id,
  Modelo,
  Opd,
  PosicionLabelEnlace,
  PuertoApariencia,
  TipoEnlace,
} from "./tipos";
import type { Aviso } from "./validaciones";

const CITA_VISUAL = "urn:fxsl:kb:opd-es §OPD / §Enlaces";
const CITA_REFINAMIENTO = "urn:fxsl:kb:manual-metodologico-opm-es §7.1 / urn:fxsl:kb:opd-es §in-zoom";
const EPSILON_PUERTO = 0.001;
const TIPOS_TRANSFORMADORES = new Set<TipoEnlace>(["consumo", "resultado", "efecto"]);

export function listarAvisosVisuales(modelo: Modelo, opdId: Id): Aviso[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  return [
    ...detectarIntegridadApariencias(modelo, opd),
    ...detectarIntegridadEnlacesVisuales(modelo, opd),
    ...detectarSolapes(modelo, opd),
    ...detectarEnlacesConExtremosNoVisibles(modelo, opd),
    ...detectarExternosDentroContorno(modelo, opd),
    ...detectarTransformadoresContornoNoDistribuidos(modelo, opd),
    ...detectarSubprocesosSinTransformado(modelo, opd),
    ...detectarVerticesInvalidos(modelo, opd),
    ...detectarPuertosInteriores(modelo, opd),
  ];
}

function detectarIntegridadApariencias(modelo: Modelo, opd: Opd): Aviso[] {
  const avisos: Aviso[] = [];
  for (const apariencia of Object.values(opd.apariencias)) {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (!entidad) {
      avisos.push({
        reglaId: "visual-apariencia-entidad-inexistente",
        severidad: "error",
        mensaje: `La apariencia ${apariencia.id} referencia la entidad lógica inexistente ${apariencia.entidadId}.`,
        citaSSOT: CITA_VISUAL,
        elementoTipo: "entidad",
        elementoId: apariencia.entidadId,
        opdId: opd.id,
      });
    }
    if (apariencia.opdId !== opd.id) {
      avisos.push({
        reglaId: "visual-apariencia-opd-inconsistente",
        severidad: "error",
        mensaje: `La apariencia ${entidad?.nombre ?? apariencia.entidadId} declara opdId ${apariencia.opdId}, pero vive en ${opd.id}.`,
        citaSSOT: CITA_VISUAL,
        elementoTipo: "entidad",
        elementoId: apariencia.entidadId,
        opdId: opd.id,
      });
    }
    if (!geometriaAparienciaValida(apariencia)) {
      avisos.push({
        reglaId: "visual-geometria-apariencia-invalida",
        severidad: "error",
        mensaje: `La apariencia ${entidad?.nombre ?? apariencia.entidadId} tiene geometría no renderizable en ${opd.nombre}.`,
        citaSSOT: CITA_VISUAL,
        elementoTipo: "entidad",
        elementoId: apariencia.entidadId,
        opdId: opd.id,
      });
    }
    for (const [portId, puerto] of Object.entries(apariencia.ports ?? {})) {
      if (puertoRelativoValido(puerto)) continue;
      avisos.push({
        reglaId: "visual-puerto-coordenadas-invalidas",
        severidad: "error",
        mensaje: `El puerto ${portId} de ${entidad?.nombre ?? apariencia.entidadId} no está en coordenadas relativas 0..1.`,
        citaSSOT: CITA_VISUAL,
        elementoTipo: "entidad",
        elementoId: apariencia.entidadId,
        opdId: opd.id,
      });
    }
    if (contextoRefinamientoHuerfano(modelo, opd, apariencia)) {
      avisos.push({
        reglaId: "visual-contexto-refinamiento-huerfano",
        severidad: "error",
        mensaje: `La apariencia ${entidad?.nombre ?? apariencia.entidadId} conserva contexto de refinamiento con referencias ausentes.`,
        citaSSOT: CITA_REFINAMIENTO,
        elementoTipo: "entidad",
        elementoId: apariencia.entidadId,
        opdId: opd.id,
      });
    }
    if (parteExtraidaHuerfana(modelo, opd, apariencia)) {
      avisos.push({
        reglaId: "visual-parte-extraida-huerfana",
        severidad: "error",
        mensaje: `La apariencia ${entidad?.nombre ?? apariencia.entidadId} conserva metadata de parte extraída hacia un padre o parte ausente.`,
        citaSSOT: CITA_REFINAMIENTO,
        elementoTipo: "entidad",
        elementoId: apariencia.entidadId,
        opdId: opd.id,
      });
    }
  }
  return avisos;
}

function detectarIntegridadEnlacesVisuales(modelo: Modelo, opd: Opd): Aviso[] {
  const avisos: Aviso[] = [];
  for (const aparienciaEnlace of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (aparienciaEnlace.opdId !== opd.id) {
      avisos.push({
        reglaId: "visual-enlace-opd-inconsistente",
        severidad: "error",
        mensaje: `La apariencia de enlace ${aparienciaEnlace.id} declara opdId ${aparienciaEnlace.opdId}, pero vive en ${opd.id}.`,
        citaSSOT: CITA_VISUAL,
        elementoTipo: "enlace",
        elementoId: aparienciaEnlace.enlaceId,
        opdId: opd.id,
      });
    }
    if (enlace) {
      for (const lado of ["origen", "destino"] as const) {
        const extremo = lado === "origen" ? enlace.origenId : enlace.destinoId;
        if (entidadIdDeExtremo(modelo, extremo)) continue;
        avisos.push({
          reglaId: "visual-enlace-extremo-logico-inexistente",
          severidad: "error",
          mensaje: `El ${lado} ${nombreExtremo(modelo, extremo)} del enlace ${enlace.id} no existe en el modelo lógico.`,
          citaSSOT: CITA_VISUAL,
          elementoTipo: "enlace",
          elementoId: enlace.id,
          opdId: opd.id,
        });
      }
    }
    if (simboloEstructuralInvalido(aparienciaEnlace)) {
      avisos.push({
        reglaId: "visual-simbolo-estructural-invalido",
        severidad: "error",
        mensaje: `La apariencia de enlace ${enlace ? etiquetaEnlace(modelo, enlace) : aparienciaEnlace.enlaceId} tiene posición o anclajes estructurales no finitos.`,
        citaSSOT: CITA_VISUAL,
        elementoTipo: "enlace",
        elementoId: aparienciaEnlace.enlaceId,
        opdId: opd.id,
      });
    }
    if (labelsEnlaceInvalidas(aparienciaEnlace)) {
      avisos.push({
        reglaId: "visual-label-enlace-invalida",
        severidad: "error",
        mensaje: `La apariencia de enlace ${enlace ? etiquetaEnlace(modelo, enlace) : aparienciaEnlace.enlaceId} tiene posiciones de etiqueta no finitas.`,
        citaSSOT: CITA_VISUAL,
        elementoTipo: "enlace",
        elementoId: aparienciaEnlace.enlaceId,
        opdId: opd.id,
      });
    }
  }
  return avisos;
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
      if (!geometriaAparienciaValida(a) || !geometriaAparienciaValida(b)) continue;
      const area = areaInterseccion(a, b);
      if (area <= 0) continue;
      const entidadA = modelo.entidades[a.entidadId];
      const entidadB = modelo.entidades[b.entidadId];
      avisos.push({
        reglaId: "visual-solape-apariencias",
        severidad: "info",
        mensaje: `${entidadA?.nombre ?? a.entidadId} y ${entidadB?.nombre ?? b.entidadId} ocupan el mismo lugar en ${opd.nombre}. Las cosas solapadas son difíciles de leer y pueden tapar enlaces: sepáralas o deja una dentro de la otra solo si describes contención.`,
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
        severidad: "error",
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
        severidad: "error",
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
      severidad: "error",
      mensaje: `La cosa externa ${entidad?.nombre ?? apariencia.entidadId} quedó dentro del contorno refinado ${modelo.entidades[contorno.entidadId]?.nombre ?? contorno.entidadId}.`,
      citaSSOT: CITA_REFINAMIENTO,
      elementoTipo: "entidad",
      elementoId: apariencia.entidadId,
      opdId: opd.id,
    } satisfies Aviso];
  });
}

function detectarTransformadoresContornoNoDistribuidos(modelo: Modelo, opd: Opd): Aviso[] {
  const contorno = contenedorRefinamiento(modelo, opd.id);
  if (!contorno) return [];
  const contornoApariencia = aparienciaDeEntidadEnOpd(opd, contorno.entidadId);
  if (!contornoApariencia) return [];
  const refinable = modelo.entidades[contorno.entidadId];
  if (refinable?.tipo !== "proceso") return [];
  const subprocesos = subprocesosInternos(modelo, opd, contornoApariencia);
  if (subprocesos.size === 0) return [];

  const enlacesVisibles = enlacesVisiblesEnOpd(modelo, opd);
  return enlacesVisibles.flatMap((enlace) => {
    if (!TIPOS_TRANSFORMADORES.has(enlace.tipo)) return [];
    if (!extremoApuntaAEntidad(enlace.origenId, refinable.id) && !extremoApuntaAEntidad(enlace.destinoId, refinable.id)) {
      return [];
    }
    if (transformadorDistribuido(modelo, enlace, enlacesVisibles, refinable.id, subprocesos)) return [];
    const externoId = extremoApuntaAEntidad(enlace.origenId, refinable.id)
      ? entidadIdDeExtremo(modelo, enlace.destinoId)
      : entidadIdDeExtremo(modelo, enlace.origenId);
    const externo = externoId ? modelo.entidades[externoId] : undefined;
    return [{
      reglaId: "visual-transformador-contorno-no-distribuido",
      severidad: "error",
      mensaje: `El enlace transformador ${etiquetaEnlace(modelo, enlace)} permanece en el contorno de ${refinable.nombre}; en una descomposición debe proyectarse hacia subprocesos concretos${externo ? ` conectados con ${externo.nombre}` : ""}.`,
      citaSSOT: CITA_REFINAMIENTO,
      elementoTipo: "enlace",
      elementoId: enlace.id,
      opdId: opd.id,
    } satisfies Aviso];
  });
}

function detectarSubprocesosSinTransformado(modelo: Modelo, opd: Opd): Aviso[] {
  const contorno = contenedorRefinamiento(modelo, opd.id);
  if (!contorno) return [];
  const contornoApariencia = aparienciaDeEntidadEnOpd(opd, contorno.entidadId);
  if (!contornoApariencia) return [];
  const refinable = modelo.entidades[contorno.entidadId];
  if (refinable?.tipo !== "proceso") return [];
  const subprocesos = subprocesosInternos(modelo, opd, contornoApariencia);
  if (subprocesos.size === 0) return [];
  const enlacesVisibles = enlacesVisiblesEnOpd(modelo, opd);
  return [...subprocesos].flatMap((subprocesoId) => {
    if (subprocesoTransformaObjeto(modelo, subprocesoId, enlacesVisibles)) return [];
    const subproceso = modelo.entidades[subprocesoId];
    return [{
      reglaId: "visual-subproceso-sin-transformado",
      severidad: "error",
      mensaje: `El subproceso interno ${subproceso?.nombre ?? subprocesoId} no transforma ningún objeto visible en ${opd.nombre}.`,
      citaSSOT: CITA_REFINAMIENTO,
      elementoTipo: "entidad",
      elementoId: subprocesoId,
      opdId: opd.id,
    } satisfies Aviso];
  });
}

function subprocesosInternos(modelo: Modelo, opd: Opd, contorno: Apariencia): Set<Id> {
  return new Set(Object.values(opd.apariencias)
    .filter((apariencia) => apariencia.id !== contorno.id)
    .filter((apariencia) => modelo.entidades[apariencia.entidadId]?.tipo === "proceso")
    .filter((apariencia) => aparienciaEsInternaDeRefinamiento(modelo, opd.id, apariencia, contorno))
    .map((apariencia) => apariencia.entidadId));
}

function enlacesVisiblesEnOpd(modelo: Modelo, opd: Opd): Enlace[] {
  return Object.values(opd.enlaces)
    .map((aparienciaEnlace) => modelo.enlaces[aparienciaEnlace.enlaceId])
    .filter((enlace): enlace is Enlace => enlace !== undefined);
}

function transformadorDistribuido(
  modelo: Modelo,
  enlaceContorno: Enlace,
  enlaces: readonly Enlace[],
  refinableId: Id,
  subprocesos: ReadonlySet<Id>,
): boolean {
  const haciaRefinable = extremoApuntaAEntidad(enlaceContorno.destinoId, refinableId);
  const desdeRefinable = extremoApuntaAEntidad(enlaceContorno.origenId, refinableId);
  if (!haciaRefinable && !desdeRefinable) return false;

  const externo = haciaRefinable ? enlaceContorno.origenId : enlaceContorno.destinoId;
  const externoId = entidadIdDeExtremo(modelo, externo);
  if (!externoId) return false;

  return enlaces.some((candidato) => {
    if (candidato.id === enlaceContorno.id || !TIPOS_TRANSFORMADORES.has(candidato.tipo)) return false;
    if (haciaRefinable) {
      return (
        extremoApuntaAEntidad(candidato.origenId, externoId) &&
        entidadIdDeExtremo(modelo, candidato.destinoId) !== null &&
        subprocesos.has(entidadIdDeExtremo(modelo, candidato.destinoId)!)
      );
    }
    return (
      entidadIdDeExtremo(modelo, candidato.origenId) !== null &&
      subprocesos.has(entidadIdDeExtremo(modelo, candidato.origenId)!) &&
      extremoApuntaAEntidad(candidato.destinoId, externoId)
    );
  });
}

function subprocesoTransformaObjeto(modelo: Modelo, subprocesoId: Id, enlaces: readonly Enlace[]): boolean {
  return enlaces.some((enlace) => {
    if (!TIPOS_TRANSFORMADORES.has(enlace.tipo)) return false;
    const origenId = entidadIdDeExtremo(modelo, enlace.origenId);
    const destinoId = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (!origenId || !destinoId) return false;
    const origen = modelo.entidades[origenId];
    const destino = modelo.entidades[destinoId];
    return (
      (origenId === subprocesoId && destino?.tipo === "objeto") ||
      (destinoId === subprocesoId && origen?.tipo === "objeto")
    );
  });
}

function detectarVerticesInvalidos(modelo: Modelo, opd: Opd): Aviso[] {
  return Object.values(opd.enlaces).flatMap((aparienciaEnlace) => {
    const invalido = aparienciaEnlace.vertices.some((vertice) => !Number.isFinite(vertice.x) || !Number.isFinite(vertice.y));
    if (!invalido) return [];
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    return [{
      reglaId: "visual-vertices-enlace-invalidos",
      severidad: "error",
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
      const referencia = referenciaPuertoDeExtremo(opd, extremo);
      if (!referencia) continue;
      if (!referencia.puerto) {
        avisos.push({
          reglaId: "visual-puerto-enlace-inexistente",
          severidad: "error",
          mensaje: `El ${lado} del enlace ${etiquetaEnlace(modelo, enlace)} referencia el puerto ausente ${referencia.portId}.`,
          citaSSOT: CITA_VISUAL,
          elementoTipo: "enlace",
          elementoId: enlace.id,
          opdId: opd.id,
        });
        continue;
      }
      if (!puertoRelativoValido(referencia.puerto) || puertoEnBorde(referencia.puerto)) continue;
      avisos.push({
        reglaId: "visual-puerto-enlace-interior",
        severidad: "error",
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

function referenciaPuertoDeExtremo(opd: Opd, extremo: ExtremoEnlace): { portId: Id; puerto?: PuertoApariencia } | null {
  if (extremo.kind !== "entidad" || !extremo.portId) return null;
  const apariencia = aparienciaDeEntidadEnOpd(opd, extremo.id);
  if (!apariencia) return null;
  const puerto = apariencia.ports?.[extremo.portId];
  return puerto ? { portId: extremo.portId, puerto } : { portId: extremo.portId };
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

function geometriaAparienciaValida(apariencia: Apariencia): boolean {
  return (
    Number.isFinite(apariencia.x) &&
    Number.isFinite(apariencia.y) &&
    Number.isFinite(apariencia.width) &&
    Number.isFinite(apariencia.height) &&
    apariencia.width > 0 &&
    apariencia.height > 0
  );
}

function puertoRelativoValido(puerto: PuertoApariencia): boolean {
  return (
    Number.isFinite(puerto.x) &&
    Number.isFinite(puerto.y) &&
    puerto.x >= 0 &&
    puerto.x <= 1 &&
    puerto.y >= 0 &&
    puerto.y <= 1
  );
}

function contextoRefinamientoHuerfano(modelo: Modelo, opd: Opd, apariencia: Apariencia): boolean {
  const contexto = apariencia.contextoRefinamiento;
  if (!contexto) return false;
  if (!modelo.entidades[contexto.refinableEntidadId]) return true;
  return !!contexto.contenedorAparienciaId && !opd.apariencias[contexto.contenedorAparienciaId];
}

function parteExtraidaHuerfana(modelo: Modelo, opd: Opd, apariencia: Apariencia): boolean {
  const parte = apariencia.parteExtraidaDe;
  if (!parte) return false;
  return !opd.apariencias[parte.padreAparienciaId] || !modelo.entidades[parte.parteEntidadId];
}

function simboloEstructuralInvalido(aparienciaEnlace: AparienciaEnlace): boolean {
  if (aparienciaEnlace.symbolPos && !puntoFinito(aparienciaEnlace.symbolPos)) return true;
  return Object.values(aparienciaEnlace.symbolAnchors ?? {}).some((anchor) => !!anchor && !anclajeFinito(anchor));
}

function labelsEnlaceInvalidas(aparienciaEnlace: AparienciaEnlace): boolean {
  return Object.values(aparienciaEnlace.labelPositions ?? {}).some((label) => !labelEnlaceValida(label));
}

function labelEnlaceValida(label: PosicionLabelEnlace): boolean {
  return (
    Number.isFinite(label.distance) &&
    (label.angle === undefined || Number.isFinite(label.angle)) &&
    offsetLabelValido(label.offset)
  );
}

function offsetLabelValido(offset: PosicionLabelEnlace["offset"]): boolean {
  if (offset === undefined) return true;
  if (typeof offset === "number") return Number.isFinite(offset);
  return puntoFinito(offset);
}

function puntoFinito(punto: { x: number; y: number }): boolean {
  return Number.isFinite(punto.x) && Number.isFinite(punto.y);
}

function anclajeFinito(anchor: AnclajeSimboloEstructural): boolean {
  return Number.isFinite(anchor.dx) && Number.isFinite(anchor.dy);
}

function areaInterseccion(a: Apariencia, b: Apariencia): number {
  const ancho = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const alto = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  return ancho * alto;
}

function etiquetaEnlace(modelo: Modelo, enlace: Enlace): string {
  return `${nombreExtremo(modelo, enlace.origenId)} -> ${nombreExtremo(modelo, enlace.destinoId)}`;
}
