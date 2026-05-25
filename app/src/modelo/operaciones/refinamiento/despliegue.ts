import { CANON } from "../../constantes";
import { CENTRO_CANVAS_GEOMETRICO } from "../../layout";
import { extremoEntidad } from "../../extremos";
import { fijarRefinamiento, obtenerRefinamiento } from "../../refinamientos";
import type {
  Apariencia,
  AparienciaEnlace,
  Enlace,
  Entidad,
  Id,
  Modelo,
  ModoDespliegueObjeto,
  Opd,
  Resultado,
  TipoEnlace,
  TipoEntidad,
} from "../../tipos";
import { entidadVisibleEnOpd, fallo, ok, siguienteId } from "../helpers";
import { quitarRefinamientoEntidad, siguienteNombreOpdHijo } from "./helpers";

/**
 * Operaciones de despliegue/unfold de cosa OPM.
 *
 * El nombre público `desplegarObjeto` se conserva por compatibilidad. La
 * operación replica el patrón OPCloud `tryToUnfold(thing)`: acepta objetos o
 * procesos y crea refinadores estructurales del mismo tipo que la cosa padre.
 */

export interface DespliegueObjeto {
  modelo: Modelo;
  opdId: Id;
  creado: boolean;
  modo: ModoDespliegueObjeto;
}

// BUG-372334: en despliegue (unfold) el padre OPM va en su tamaño normal y las
// partes se posicionan FUERA, debajo, conectadas por enlaces estructurales con
// markers canonicos (triangulo agregacion, etc.). Inzoom (descomposicion) es
// el modo donde las partes van EMBEBIDAS dentro del contorno.
const UNFOLD = {
  partesIniciales: 3,
  separacionHorizontal: 30,
  partesOffsetSuperior: 200, // distancia del padre (top) a la fila de partes
  padreOffsetSuperior: 40,   // y del padre dentro del OPD hijo
  padreOffsetIzquierdo: 80,  // origen X de la fila de partes; padre se centra sobre ellas
} as const;

// BUG-20260524T034932Z-b6be2b: el OPD hijo del despliegue debe nacer anclado al
// centro geométrico del canvas (igual que descomposición y que la primera cosa
// de un OPD vacío). El cluster padre+partes ocupa desde
// (padreOffsetIzquierdo, padreOffsetSuperior) hasta el final de la fila de
// partes; lo desplazamos en bloque para que su centro coincida con el centro
// del canvas y el viewport pueda centrarlo por scroll.
function origenClusterDespliegue(): { x: number; y: number } {
  const anchoCluster = CANON.dims.cosaWidth * UNFOLD.partesIniciales
    + UNFOLD.separacionHorizontal * (UNFOLD.partesIniciales - 1);
  const altoCluster = UNFOLD.partesOffsetSuperior + CANON.dims.cosaHeight;
  return {
    x: Math.round(CENTRO_CANVAS_GEOMETRICO.x - UNFOLD.padreOffsetIzquierdo - anchoCluster / 2),
    y: Math.round(CENTRO_CANVAS_GEOMETRICO.y - UNFOLD.padreOffsetSuperior - altoCluster / 2),
  };
}

export function desplegarObjeto(
  modelo: Modelo,
  opdPadreId: Id,
  objetoId: Id,
  modo: ModoDespliegueObjeto = "agregacion",
): Resultado<DespliegueObjeto> {
  const opdPadre = modelo.opds[opdPadreId];
  if (!opdPadre) return fallo(`OPD no existe: ${opdPadreId}`);
  const objeto = modelo.entidades[objetoId];
  if (!objeto) return fallo(`Entidad no existe: ${objetoId}`);
  if (!entidadVisibleEnOpd(opdPadre, objetoId)) {
    return fallo("El despliegue requiere que la entidad tenga apariencia en el OPD activo");
  }

  const slotExistente = obtenerRefinamiento(objeto, "despliegue");
  if (slotExistente) {
    const opdExistente = modelo.opds[slotExistente.opdId];
    if (!opdExistente) return fallo(`OPD de despliegue no existe: ${slotExistente.opdId}`);
    return ok({ modelo, opdId: opdExistente.id, creado: false, modo: slotExistente.modo ?? "agregacion" });
  }
  // Nota ronda 15.2: descomposicion y despliegue son ortogonales. No se
  // rechaza por presencia del slot complementario; solo idempotencia.

  const opdHijoId = siguienteId(modelo, "opd");
  let nextSeq = modelo.nextSeq + 1;
  const aparienciaHijoId = siguienteId({ ...modelo, nextSeq }, "a");
  nextSeq += 1;
  // Padre en tamaño normal y centrado horizontalmente sobre la fila de partes.
  const origenCluster = origenClusterDespliegue();
  const partesTotalWidth = CANON.dims.cosaWidth * UNFOLD.partesIniciales
    + UNFOLD.separacionHorizontal * (UNFOLD.partesIniciales - 1);
  const padreX = origenCluster.x + UNFOLD.padreOffsetIzquierdo + (partesTotalWidth - CANON.dims.cosaWidth) / 2;
  const aparienciaHijo: Apariencia = {
    id: aparienciaHijoId,
    entidadId: objetoId,
    opdId: opdHijoId,
    x: padreX,
    y: origenCluster.y + UNFOLD.padreOffsetSuperior,
    width: CANON.dims.cosaWidth,
    height: CANON.dims.cosaHeight,
  };
  const partes = partesInicialesDespliegue(modelo, objeto, aparienciaHijo, opdHijoId, nextSeq, modo);
  nextSeq = partes.nextSeq;
  const enlacesDespliegue = enlacesEstructuralesDespliegue(modelo, objetoId, partes.parteIds, opdHijoId, nextSeq, modo);
  nextSeq = enlacesDespliegue.nextSeq;
  const opdHijo: Opd = {
    id: opdHijoId,
    nombre: siguienteNombreOpdHijo(modelo, opdPadreId),
    padreId: opdPadreId,
    apariencias: {
      [aparienciaHijoId]: aparienciaHijo,
      ...partes.apariencias,
    },
    enlaces: enlacesDespliegue.aparienciasEnlace,
  };

  return ok({
    modelo: {
      ...modelo,
      nextSeq,
      entidades: {
        ...modelo.entidades,
        [objetoId]: fijarRefinamiento(objeto, "despliegue", { opdId: opdHijoId, modo }),
        ...partes.entidades,
      },
      enlaces: {
        ...modelo.enlaces,
        ...enlacesDespliegue.enlaces,
      },
      opds: {
        ...modelo.opds,
        [opdHijoId]: opdHijo,
      },
    },
    opdId: opdHijoId,
    creado: true,
    modo,
  });
}

export function quitarDespliegueObjeto(modelo: Modelo, objetoId: Id): Resultado<Modelo> {
  const objeto = modelo.entidades[objetoId];
  if (!objeto) return fallo(`Entidad no existe: ${objetoId}`);
  if (!obtenerRefinamiento(objeto, "despliegue")) return fallo("La entidad no tiene despliegue");

  return quitarRefinamientoEntidad(modelo, objetoId, "despliegue");
}

function partesInicialesDespliegue(
  modelo: Modelo,
  objeto: Entidad,
  contorno: Apariencia,
  opdHijoId: Id,
  nextSeqInicial: number,
  modo: ModoDespliegueObjeto,
): { entidades: Record<Id, Entidad>; apariencias: Record<Id, Apariencia>; parteIds: Id[]; nextSeq: number } {
  const entidades: Record<Id, Entidad> = {};
  const apariencias: Record<Id, Apariencia> = {};
  const parteIds: Id[] = [];
  let nextSeq = nextSeqInicial;
  // BUG-372334: las partes se posicionan FUERA del padre, debajo, en una fila
  // horizontal centrada bajo el padre. El padre se centra sobre la fila, así
  // que el origen X de la fila es la X del padre menos su offset de centrado.
  // Esto preserva el anclaje al centro geométrico (BUG-20260524T034932Z-b6be2b)
  // sin recalcular el origen-cluster aquí.
  const partesTotalWidth = CANON.dims.cosaWidth * UNFOLD.partesIniciales
    + UNFOLD.separacionHorizontal * (UNFOLD.partesIniciales - 1);
  let x = contorno.x - (partesTotalWidth - CANON.dims.cosaWidth) / 2;
  const y = contorno.y + UNFOLD.partesOffsetSuperior;

  for (let index = 1; index <= UNFOLD.partesIniciales; index += 1) {
    const entidadId = siguienteId({ ...modelo, nextSeq }, prefijoEntidad(objeto.tipo));
    nextSeq += 1;
    const aparienciaId = siguienteId({ ...modelo, nextSeq }, "a");
    nextSeq += 1;
    entidades[entidadId] = {
      id: entidadId,
      tipo: objeto.tipo,
      nombre: nombreInicialDespliegue(objeto, modo, index),
      esencia: objeto.esencia,
      afiliacion: objeto.afiliacion,
    };
    parteIds.push(entidadId);
    apariencias[aparienciaId] = {
      id: aparienciaId,
      entidadId,
      opdId: opdHijoId,
      x,
      y,
      width: CANON.dims.cosaWidth,
      height: CANON.dims.cosaHeight,
    };
    x += CANON.dims.cosaWidth + UNFOLD.separacionHorizontal;
  }

  return { entidades, apariencias, parteIds, nextSeq };
}

function nombreInicialDespliegue(objeto: Entidad, modo: ModoDespliegueObjeto, index: number): string {
  if (objeto.tipo === "proceso") {
    if (modo === "agregacion") return `${objeto.nombre} parte ${index}`;
    if (modo === "exhibicion") return `${objeto.nombre} rasgo ${index}`;
    if (modo === "generalizacion") return `${objeto.nombre} especialización ${index}`;
    return `${objeto.nombre} instancia ${index}`;
  }
  if (modo === "agregacion") return `${objeto.nombre} parte ${index}`;
  if (modo === "exhibicion") return `Atributo ${index}`;
  if (modo === "generalizacion") return `Especialización ${index}`;
  return `Instancia ${index}`;
}

function tipoEnlaceDespliegue(modo: ModoDespliegueObjeto): TipoEnlace {
  if (modo === "agregacion") return "agregacion";
  if (modo === "exhibicion") return "exhibicion";
  if (modo === "generalizacion") return "generalizacion";
  return "clasificacion";
}

function enlacesEstructuralesDespliegue(
  modelo: Modelo,
  objetoId: Id,
  parteIds: Id[],
  opdId: Id,
  nextSeqInicial: number,
  modo: ModoDespliegueObjeto,
): { enlaces: Record<Id, Enlace>; aparienciasEnlace: Record<Id, AparienciaEnlace>; nextSeq: number } {
  const enlaces: Record<Id, Enlace> = {};
  const aparienciasEnlace: Record<Id, AparienciaEnlace> = {};
  let nextSeq = nextSeqInicial;
  const tipo = tipoEnlaceDespliegue(modo);

  for (const parteId of parteIds) {
    const enlaceId = siguienteId({ ...modelo, nextSeq }, "e");
    nextSeq += 1;
    const aparienciaId = siguienteId({ ...modelo, nextSeq }, "ae");
    nextSeq += 1;
    enlaces[enlaceId] = {
      id: enlaceId,
      tipo,
      origenId: extremoEntidad(objetoId),
      destinoId: extremoEntidad(parteId),
      etiqueta: "",
    };
    aparienciasEnlace[aparienciaId] = { id: aparienciaId, enlaceId, opdId, vertices: [] };
  }

  return { enlaces, aparienciasEnlace, nextSeq };
}

function prefijoEntidad(tipo: TipoEntidad): string {
  return tipo === "proceso" ? "p" : "o";
}
