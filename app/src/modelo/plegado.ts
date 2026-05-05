import { CANON } from "./constantes";
import { entidadIdDeExtremo, extremoApuntaAEntidad } from "./extremos";
import type { Apariencia, Entidad, Id, Modelo, ModoPlegado, Opd, Resultado } from "./tipos";

export interface PartePlegada {
  entidadId: Id;
  nombre: string;
}

export type FilaPlegadoParcial =
  | { tipo: "parte"; entidadId: Id; nombre: string; extraida: boolean }
  | { tipo: "contador"; cantidad: number; texto: string };

export const UMBRAL_PARTES_MAS = 3;

export function modoPlegadoApariencia(apariencia: Pick<Apariencia, "modoPlegado">): ModoPlegado {
  return apariencia.modoPlegado ?? "completo";
}

export function cambiarModoPlegado(
  modelo: Modelo,
  opdId: Id,
  aparienciaId: Id,
  modo: ModoPlegado,
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = opd.apariencias[aparienciaId];
  if (!apariencia) return fallo(`Apariencia no existe: ${aparienciaId}`);
  const entidad = modelo.entidades[apariencia.entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${apariencia.entidadId}`);
  const partes = partesDePlegado(modelo, entidad.id);

  if (partes.length === 0 && modo === "parcial") {
    return fallo("El plegado parcial requiere una entidad con partes");
  }
  if (modoPlegadoApariencia(apariencia) === modo) return ok(modelo);

  return ok({
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        apariencias: {
          ...opd.apariencias,
          [aparienciaId]: {
            ...apariencia,
            modoPlegado: modo,
          },
        },
      },
    },
  });
}

export function tienePartesPlegables(modelo: Modelo, entidadId: Id): boolean {
  return partesDePlegado(modelo, entidadId).length > 0;
}

export function extraerParteDePlegado(
  modelo: Modelo,
  opdId: Id,
  padreAparienciaId: Id,
  parteEntidadId: Id,
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const padre = opd.apariencias[padreAparienciaId];
  if (!padre) return fallo(`Apariencia padre no existe: ${padreAparienciaId}`);
  if (modoPlegadoApariencia(padre) !== "parcial") return fallo("La extracción requiere plegado parcial activo");
  const entidadPadre = modelo.entidades[padre.entidadId];
  const parte = modelo.entidades[parteEntidadId];
  if (!entidadPadre) return fallo(`Entidad padre no existe: ${padre.entidadId}`);
  if (!parte) return fallo(`Parte no existe: ${parteEntidadId}`);
  if (!partesDePlegado(modelo, entidadPadre.id).some((item) => item.entidadId === parteEntidadId)) {
    return fallo("La entidad no es parte del plegado seleccionado");
  }
  if (Object.values(opd.apariencias).some((apariencia) =>
    apariencia.entidadId === parteEntidadId &&
    apariencia.parteExtraidaDe?.padreAparienciaId === padreAparienciaId
  )) {
    return ok(modelo);
  }

  const referencia = aparienciaReferenciaParte(modelo, entidadPadre, parteEntidadId);
  const aparienciaId = siguienteId(modelo, "a");
  const width = referencia?.width ?? CANON.dims.cosaWidth;
  const height = referencia?.height ?? CANON.dims.cosaHeight;
  const extraida: Apariencia = {
    id: aparienciaId,
    entidadId: parteEntidadId,
    opdId,
    x: padre.x + padre.width + 48,
    y: padre.y,
    width,
    height,
    parteExtraidaDe: { padreAparienciaId, parteEntidadId },
  };

  return ok({
    ...modelo,
    nextSeq: modelo.nextSeq + 1,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        apariencias: {
          ...opd.apariencias,
          [aparienciaId]: extraida,
        },
      },
    },
  });
}

export function reinsertarParteEnPlegado(modelo: Modelo, parteAparienciaId: Id): Resultado<Modelo> {
  const encontrada = encontrarApariencia(modelo, parteAparienciaId);
  if (!encontrada) return fallo(`Apariencia no existe: ${parteAparienciaId}`);
  const { opdId, opd, apariencia } = encontrada;
  if (!apariencia.parteExtraidaDe) return fallo("La apariencia no es una parte extraída");
  const padre = opd.apariencias[apariencia.parteExtraidaDe.padreAparienciaId];
  if (!padre) return fallo("El padre de la parte extraída no existe en el OPD activo");
  const { [parteAparienciaId]: _removida, ...apariencias } = opd.apariencias;
  return ok({
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        apariencias,
      },
    },
  });
}

export function contarPartesOcultas(modelo: Modelo, opdId: Id, padreAparienciaId: Id): number {
  const padre = modelo.opds[opdId]?.apariencias[padreAparienciaId];
  if (!padre) return 0;
  const extraidas = new Set(partesExtraidasEn(modelo, opdId, padreAparienciaId).map((apariencia) => apariencia.entidadId));
  return partesDePlegado(modelo, padre.entidadId).filter((parte) => !extraidas.has(parte.entidadId)).length;
}

export function partesExtraidasEn(modelo: Modelo, opdId: Id, padreAparienciaId: Id): Apariencia[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  return Object.values(opd.apariencias).filter((apariencia) => apariencia.parteExtraidaDe?.padreAparienciaId === padreAparienciaId);
}

export function filasPlegadoParcial(modelo: Modelo, opdId: Id, padreAparienciaId: Id): FilaPlegadoParcial[] {
  const padre = modelo.opds[opdId]?.apariencias[padreAparienciaId];
  if (!padre) return [];
  const partes = partesDePlegado(modelo, padre.entidadId);
  const extraidas = new Set(partesExtraidasEn(modelo, opdId, padreAparienciaId).map((apariencia) => apariencia.entidadId));
  const filasExtraidas = partes
    .filter((parte) => extraidas.has(parte.entidadId))
    .map((parte): FilaPlegadoParcial => ({ ...parte, tipo: "parte", extraida: true }));
  const ocultas = partes.filter((parte) => !extraidas.has(parte.entidadId));

  if (filasExtraidas.length === 0) {
    return partes.map((parte): FilaPlegadoParcial => ({ ...parte, tipo: "parte", extraida: false }));
  }
  if (ocultas.length > UMBRAL_PARTES_MAS) {
    return [...filasExtraidas, filaContador(ocultas.length)];
  }
  return [
    ...filasExtraidas,
    ...ocultas.map((parte): FilaPlegadoParcial => ({ ...parte, tipo: "parte", extraida: false })),
  ];
}

export function partesDePlegado(modelo: Modelo, entidadId: Id): PartePlegada[] {
  const entidad = modelo.entidades[entidadId];
  if (!entidad?.refinamiento) return [];
  const opd = modelo.opds[entidad.refinamiento.opdId];
  if (!opd) return [];
  const partes = entidad.refinamiento.tipo === "descomposicion"
    ? subprocesosDeDescomposicion(modelo, entidad, opd)
    : partesDeDespliegue(modelo, entidad, opd);

  return partes.sort((a, b) => a.nombre.localeCompare(b.nombre, "es") || a.entidadId.localeCompare(b.entidadId));
}

function subprocesosDeDescomposicion(modelo: Modelo, entidad: Entidad, opd: Opd): PartePlegada[] {
  const contorno = aparienciaDeEntidad(opd, entidad.id);
  if (!contorno) return [];

  return Object.values(opd.apariencias)
    .filter((apariencia) => apariencia.entidadId !== entidad.id)
    .filter((apariencia) => dentroDe(apariencia, contorno))
    .flatMap((apariencia) => {
      const subproceso = modelo.entidades[apariencia.entidadId];
      return subproceso?.tipo === "proceso" ? [{ entidadId: subproceso.id, nombre: subproceso.nombre }] : [];
    });
}

function partesDeDespliegue(modelo: Modelo, entidad: Entidad, opd: Opd): PartePlegada[] {
  const visibles = new Set(Object.values(opd.apariencias).map((apariencia) => apariencia.entidadId));
  return Object.values(opd.enlaces)
    .flatMap((aparienciaEnlace) => {
      const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
      const destinoId = enlace ? entidadIdDeExtremo(modelo, enlace.destinoId) : null;
      if (enlace?.tipo !== "agregacion" || !extremoApuntaAEntidad(enlace.origenId, entidad.id) || !destinoId || !visibles.has(destinoId)) return [];
      const parte = modelo.entidades[destinoId];
      return parte?.tipo === "objeto" ? [{ entidadId: parte.id, nombre: parte.nombre }] : [];
    });
}

function aparienciaDeEntidad(opd: Opd, entidadId: Id): Apariencia | undefined {
  return Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === entidadId);
}

function aparienciaReferenciaParte(modelo: Modelo, padre: Entidad, parteEntidadId: Id): Apariencia | undefined {
  const opdRefinamientoId = padre.refinamiento?.opdId;
  if (!opdRefinamientoId) return undefined;
  const opd = modelo.opds[opdRefinamientoId];
  return opd ? aparienciaDeEntidad(opd, parteEntidadId) : undefined;
}

function encontrarApariencia(
  modelo: Modelo,
  aparienciaId: Id,
): { opdId: Id; opd: Opd; apariencia: Apariencia } | null {
  for (const [opdId, opd] of Object.entries(modelo.opds)) {
    const apariencia = opd.apariencias[aparienciaId];
    if (apariencia) return { opdId, opd, apariencia };
  }
  return null;
}

function filaContador(cantidad: number): FilaPlegadoParcial {
  return {
    tipo: "contador",
    cantidad,
    texto: `y ${cantidad} ${cantidad === 1 ? "parte más" : "partes más"}`,
  };
}

function siguienteId(modelo: Modelo, prefijo: string): Id {
  return `${prefijo}-${modelo.nextSeq}`;
}

function dentroDe(apariencia: Apariencia, contorno: Apariencia): boolean {
  return (
    apariencia.x >= contorno.x &&
    apariencia.y >= contorno.y &&
    apariencia.x + apariencia.width <= contorno.x + contorno.width &&
    apariencia.y + apariencia.height <= contorno.y + contorno.height
  );
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
