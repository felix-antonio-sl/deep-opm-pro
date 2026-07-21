import { CANON } from "../../constantes";
import {
  INZOOM_CANON,
  contornoHeightCanonico,
  contornoWidthCanonico,
} from "../../constantesInzoom";
import { CENTRO_CANVAS_GEOMETRICO } from "../../layout";
import {
  contextoContornoDescomposicion,
  contextoInternoDescomposicion,
} from "../../contextoRefinamiento";
import { obtenerRefinamiento } from "../../refinamientos";
import type {
  Apariencia,
  Entidad,
  Id,
  Modelo,
  Opd,
  Resultado,
  TipoEntidad,
} from "../../tipos";
import { entidadVisibleEnOpd, fallo, ok, siguienteId } from "../helpers";
import { establecerRefinamiento } from "./establecer";
import {
  quitarRefinamientoEntidad,
  siguienteNombreOpdHijo,
} from "./helpers";
import { sincronizarRepresentacionRefinamiento } from "./proyeccion";

/**
 * Operaciones de descomposición/in-zoom de cosa OPM.
 *
 * El nombre público `descomponerProceso` se conserva por compatibilidad, pero
 * la semántica ya no está limitada a procesos: OPCloud ejecuta in-zoom sobre
 * `Thing` y crea refinadores iniciales del mismo tipo que la cosa refinada.
 */

export interface DescomposicionProceso {
  modelo: Modelo;
  opdId: Id;
  creado: boolean;
  refinadorIds: Id[];
}

export interface OpcionesDescomposicion {
  preguntaGuia?: string;
}

// W3.1: las constantes de dimensionado canónico (paddingSuperior/separacionVertical/
// contornoWidth/contornoHeight, derivadas de minSubthings/multAncho) vienen ahora de la
// fuente única `canvas/constantesInzoom`. Lo exclusivo de la semilla se queda local:
// `subprocesosIniciales` (= minSubthings canónico) y `toleranciaParaleloY` (umbral propio).
const INZOOM = {
  subprocesosIniciales: INZOOM_CANON.minSubthings,
  paddingSuperior: INZOOM_CANON.paddingSuperior,
  separacionVertical: INZOOM_CANON.gapInterno,
  toleranciaParaleloY: 4,
  contornoWidth: contornoWidthCanonico,
  contornoHeight: contornoHeightCanonico(),
} as const;

// BUG-20260524T034932Z-b6be2b: el OPD hijo recién creado por descomposición
// debe nacer anclado al centro geométrico del canvas, igual que la primera
// cosa de un OPD vacío. Así el centrado por scroll del viewport (que clampa a 0
// y no puede centrar contenido pegado al origen del paper) enfoca el diagrama
// refinado en el centro, en vez de dejarlo en la esquina superior izquierda.
const ORIGEN_CONTORNO_DESCOMPOSICION = {
  x: Math.round(CENTRO_CANVAS_GEOMETRICO.x - INZOOM.contornoWidth / 2),
  y: Math.round(CENTRO_CANVAS_GEOMETRICO.y - INZOOM.contornoHeight / 2),
} as const;

export function descomponerProceso(
  modelo: Modelo,
  opdPadreId: Id,
  procesoId: Id,
  opciones: OpcionesDescomposicion = {},
): Resultado<DescomposicionProceso> {
  const opdPadre = modelo.opds[opdPadreId];
  if (!opdPadre) return fallo(`OPD no existe: ${opdPadreId}`);
  const proceso = modelo.entidades[procesoId];
  if (!proceso) return fallo(`Entidad no existe: ${procesoId}`);
  if (!entidadVisibleEnOpd(opdPadre, procesoId)) {
    return fallo("La descomposición requiere que la entidad tenga apariencia en el OPD activo");
  }

  const slotExistente = obtenerRefinamiento(proceso, "descomposicion");
  if (slotExistente) {
    const opdExistente = modelo.opds[slotExistente.opdId];
    if (!opdExistente) return fallo(`OPD de descomposición no existe: ${slotExistente.opdId}`);
    return ok({ modelo, opdId: opdExistente.id, creado: false, refinadorIds: [] });
  }
  // Nota ronda 15.2: descomposicion y despliegue son ortogonales (Comportamiento
  // vs Estructura, SSOT §refinamiento). No se rechaza por presencia del slot
  // complementario; solo idempotencia del mismo tipo.

  const opdHijoId = siguienteId(modelo, "opd");
  let nextSeq = modelo.nextSeq + 1;
  const aparienciaHijoId = siguienteId({ ...modelo, nextSeq }, "a");
  nextSeq += 1;
  const aparienciaHijo: Apariencia = {
    id: aparienciaHijoId,
    entidadId: procesoId,
    opdId: opdHijoId,
    x: ORIGEN_CONTORNO_DESCOMPOSICION.x,
    y: ORIGEN_CONTORNO_DESCOMPOSICION.y,
    width: INZOOM.contornoWidth,
    height: INZOOM.contornoHeight,
    contextoRefinamiento: contextoContornoDescomposicion(procesoId),
  };
  const subprocesos = subcosasInicialesInzoom(modelo, proceso, aparienciaHijo, opdHijoId, nextSeq);
  nextSeq = subprocesos.nextSeq;
  const opdHijo: Opd = {
    id: opdHijoId,
    nombre: siguienteNombreOpdHijo(modelo, opdPadreId),
    padreId: opdPadreId,
    apariencias: {
      [aparienciaHijoId]: aparienciaHijo,
      ...subprocesos.apariencias,
    },
    enlaces: {},
  };
  const conHijo: Modelo = {
    ...modelo,
    nextSeq,
    entidades: {
      ...modelo.entidades,
      // NOTA: sin fijarRefinamiento aquí — lo hace establecerRefinamiento (convergencia).
      ...subprocesos.entidades,
    },
    opds: {
      ...modelo.opds,
      [opdHijoId]: opdHijo,
    },
  };
  const enlazado = establecerRefinamiento(conHijo, {
    opdPadreId,
    entidadId: procesoId,
    opdHijoId,
    tipo: "descomposicion",
    ...(opciones.preguntaGuia !== undefined ? { preguntaGuia: opciones.preguntaGuia } : {}),
  });
  if (!enlazado.ok) return fallo(enlazado.error);
  const siguiente = sincronizarRepresentacionRefinamiento(enlazado.value, opdHijoId, {
    subprocesos: {
      primeroId: subprocesos.primeroId,
      ultimoId: subprocesos.ultimoId,
      todosIds: subprocesos.entidadIds,
    },
  });
  if (!siguiente.ok) return fallo(siguiente.error);

  return ok({
    modelo: siguiente.value,
    opdId: opdHijoId,
    creado: true,
    refinadorIds: subprocesos.entidadIds,
  });
}

export function quitarDescomposicionProceso(modelo: Modelo, procesoId: Id): Resultado<Modelo> {
  const proceso = modelo.entidades[procesoId];
  if (!proceso) return fallo(`Entidad no existe: ${procesoId}`);
  if (!obtenerRefinamiento(proceso, "descomposicion")) return fallo("La entidad no tiene descomposición");

  return quitarRefinamientoEntidad(modelo, procesoId, "descomposicion");
}

function subcosasInicialesInzoom(
  modelo: Modelo,
  proceso: Entidad,
  contorno: Apariencia,
  opdHijoId: Id,
  nextSeqInicial: number,
): { entidades: Record<Id, Entidad>; apariencias: Record<Id, Apariencia>; entidadIds: Id[]; primeroId: Id; ultimoId: Id; nextSeq: number } {
  const entidades: Record<Id, Entidad> = {};
  const apariencias: Record<Id, Apariencia> = {};
  const entidadIds: Id[] = [];
  let nextSeq = nextSeqInicial;
  let primeroId = "";
  let ultimoId = "";
  const x = contorno.x + (contorno.width - CANON.dims.cosaWidth) / 2;
  let y = contorno.y + INZOOM.paddingSuperior;

  for (let index = 1; index <= INZOOM.subprocesosIniciales; index += 1) {
    const entidadId = siguienteId({ ...modelo, nextSeq }, prefijoEntidad(proceso.tipo));
    nextSeq += 1;
    const aparienciaId = siguienteId({ ...modelo, nextSeq }, "a");
    nextSeq += 1;
    if (!primeroId) primeroId = entidadId;
    ultimoId = entidadId;
    entidadIds.push(entidadId);
    entidades[entidadId] = {
      id: entidadId,
      tipo: proceso.tipo,
      nombre: `${proceso.nombre} ${index}`,
      esencia: proceso.esencia,
      afiliacion: proceso.afiliacion,
    };
    apariencias[aparienciaId] = {
      id: aparienciaId,
      entidadId,
      opdId: opdHijoId,
      x,
      y,
      width: CANON.dims.cosaWidth,
      height: CANON.dims.cosaHeight,
      contextoRefinamiento: contextoInternoDescomposicion(proceso.id, contorno.id),
    };
    y += CANON.dims.cosaHeight + INZOOM.separacionVertical;
  }

  return { entidades, apariencias, entidadIds, primeroId, ultimoId, nextSeq };
}

function prefijoEntidad(tipo: TipoEntidad): string {
  return tipo === "proceso" ? "p" : "o";
}
