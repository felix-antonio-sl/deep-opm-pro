import { CANON } from "../../constantes";
import { extremoApuntaAEntidad } from "../../extremos";
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
import {
  enlacesExternosDeEntidad,
  quitarRefinamientoEntidad,
  siguienteNombreOpdHijo,
} from "./helpers";
import { proyectarEnlacesExternosEnRefinamiento } from "./proyeccion";

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
}

const INZOOM = {
  subprocesosIniciales: 3,
  paddingSuperior: 100,
  separacionVertical: 30,
  toleranciaParaleloY: 4,
  contornoWidth: CANON.dims.cosaWidth * 3,
  contornoHeight: (CANON.dims.cosaHeight + 30) * 3 + 100 + 65,
} as const;

export function descomponerProceso(modelo: Modelo, opdPadreId: Id, procesoId: Id): Resultado<DescomposicionProceso> {
  const opdPadre = modelo.opds[opdPadreId];
  if (!opdPadre) return fallo(`OPD no existe: ${opdPadreId}`);
  const proceso = modelo.entidades[procesoId];
  if (!proceso) return fallo(`Entidad no existe: ${procesoId}`);
  if (!entidadVisibleEnOpd(opdPadre, procesoId)) {
    return fallo("La descomposición requiere que la entidad tenga apariencia en el OPD activo");
  }

  if (proceso.refinamiento?.tipo === "descomposicion") {
    const opdExistente = modelo.opds[proceso.refinamiento.opdId];
    if (!opdExistente) return fallo(`OPD de descomposición no existe: ${proceso.refinamiento.opdId}`);
    return ok({ modelo, opdId: opdExistente.id, creado: false });
  }
  if (proceso.refinamiento) return fallo("La entidad ya tiene otro refinamiento");

  const opdHijoId = siguienteId(modelo, "opd");
  let nextSeq = modelo.nextSeq + 1;
  const aparienciaHijoId = siguienteId({ ...modelo, nextSeq }, "a");
  nextSeq += 1;
  const aparienciaHijo: Apariencia = {
    id: aparienciaHijoId,
    entidadId: procesoId,
    opdId: opdHijoId,
    x: 150,
    y: 90,
    width: INZOOM.contornoWidth,
    height: INZOOM.contornoHeight,
  };
  const aparienciasExternas = aparienciasExtremosExternos(modelo, opdPadre, procesoId, opdHijoId, nextSeq);
  nextSeq = aparienciasExternas.nextSeq;
  const subprocesos = subcosasInicialesInzoom(modelo, proceso, aparienciaHijo, opdHijoId, nextSeq);
  nextSeq = subprocesos.nextSeq;
  const opdHijo: Opd = {
    id: opdHijoId,
    nombre: siguienteNombreOpdHijo(modelo, opdPadreId),
    padreId: opdPadreId,
    apariencias: {
      [aparienciaHijoId]: aparienciaHijo,
      ...aparienciasExternas.apariencias,
      ...subprocesos.apariencias,
    },
    enlaces: {},
  };
  const base: Modelo = {
    ...modelo,
    nextSeq,
    entidades: {
      ...modelo.entidades,
      [procesoId]: {
        ...proceso,
        refinamiento: {
          tipo: "descomposicion",
          opdId: opdHijoId,
        },
      },
      ...subprocesos.entidades,
    },
    opds: {
      ...modelo.opds,
      [opdHijoId]: opdHijo,
    },
  };
  const siguiente = proyectarEnlacesExternosEnRefinamiento(base, opdHijoId, {
    primeroId: subprocesos.primeroId,
    ultimoId: subprocesos.ultimoId,
    todosIds: subprocesos.entidadIds,
  });
  if (!siguiente.ok) return fallo(siguiente.error);

  return ok({ modelo: siguiente.value, opdId: opdHijoId, creado: true });
}

export function quitarDescomposicionProceso(modelo: Modelo, procesoId: Id): Resultado<Modelo> {
  const proceso = modelo.entidades[procesoId];
  if (!proceso) return fallo(`Entidad no existe: ${procesoId}`);
  if (proceso.refinamiento?.tipo !== "descomposicion") return fallo("La entidad no tiene descomposición");

  return quitarRefinamientoEntidad(modelo, procesoId);
}

function aparienciasExtremosExternos(
  modelo: Modelo,
  opdPadre: Opd,
  procesoId: Id,
  opdHijoId: Id,
  nextSeqInicial: number,
): { apariencias: Record<Id, Apariencia>; nextSeq: number } {
  const externos = enlacesExternosDeEntidad(modelo, opdPadre, procesoId);
  const existentes = new Set<Id>([procesoId]);
  const apariencias: Record<Id, Apariencia> = {};
  let nextSeq = nextSeqInicial;
  let entradas = 0;
  let salidas = 0;

  for (const { enlace, externoId, aparienciaPadre } of externos) {
    if (existentes.has(externoId)) continue;
    existentes.add(externoId);
    const id = siguienteId({ ...modelo, nextSeq }, "a");
    nextSeq += 1;
    const entrada = extremoApuntaAEntidad(enlace.destinoId, procesoId);
    const fila = entrada ? entradas : salidas;
    if (entrada) entradas += 1;
    else salidas += 1;
    apariencias[id] = {
      ...aparienciaPadre,
      id,
      opdId: opdHijoId,
      x: entrada ? 24 : 610,
      y: 112 + fila * 92,
    };
  }

  return { apariencias, nextSeq };
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
    };
    y += CANON.dims.cosaHeight + INZOOM.separacionVertical;
  }

  return { entidades, apariencias, entidadIds, primeroId, ultimoId, nextSeq };
}

function prefijoEntidad(tipo: TipoEntidad): string {
  return tipo === "proceso" ? "p" : "o";
}
