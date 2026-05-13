import { CANON, naturalezaDeEnlace } from "./constantes";
import {
  entidadDeExtremo,
  entidadIdDeExtremo,
  extremoApuntaAEntidad,
  extremoVisibleEnOpd,
  mismoExtremo,
  normalizarExtremo,
  type ExtremoEntrada,
} from "./extremos";
import { validarFirmaEnlace } from "./operaciones";
import { obtenerRefinamiento, refinamientosDe } from "./refinamientos";
import type {
  Apariencia,
  AparienciaEnlace,
  Enlace,
  Entidad,
  Id,
  Modelo,
  ModoPlegado,
  Opd,
  OrdenPartesPlegado,
  Resultado,
  TipoEnlace,
} from "./tipos";

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

export function partesDePlegadoOrdenadas(modelo: Modelo, apariencia: Apariencia): PartePlegada[] {
  const partes = partesDePlegadoEnOrdenMaterial(modelo, apariencia.entidadId);
  return ordenarPartesPlegadas(partes, apariencia.ordenPartes);
}

export function partePlegadaTienePartes(modelo: Modelo, parteEntidadId: Id): boolean {
  return partesDePlegado(modelo, parteEntidadId).length > 0;
}

export function cambiarOrdenPartes(
  modelo: Modelo,
  opdId: Id,
  aparienciaId: Id,
  orden: OrdenPartesPlegado,
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = opd.apariencias[aparienciaId];
  if (!apariencia) return fallo(`Apariencia no existe: ${aparienciaId}`);
  if (!ORDENES_PARTES[orden]) return fallo(`Orden de partes inválido: ${orden}`);
  if (apariencia.ordenPartes === orden) return ok(modelo);
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
            ordenPartes: orden,
          },
        },
      },
    },
  });
}

export function crearEnlaceConExtremoPlegado(
  modelo: Modelo,
  opdId: Id,
  origenId: ExtremoEntrada,
  destinoId: ExtremoEntrada,
  tipo: TipoEnlace,
  etiqueta = "",
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const origenExtremo = normalizarExtremo(origenId);
  const destinoExtremo = normalizarExtremo(destinoId);
  const origen = entidadDeExtremo(modelo, origenExtremo);
  const destino = entidadDeExtremo(modelo, destinoExtremo);
  if (!origen) return fallo(`Origen no existe: ${origenExtremo.id}`);
  if (!destino) return fallo(`Destino no existe: ${destinoExtremo.id}`);
  if (mismoExtremo(origenExtremo, destinoExtremo)) return fallo("El enlace requiere dos extremos distintos en Sprint 0");

  const legal = validarFirmaEnlace(tipo, origen, destino, { origen: origenExtremo, destino: destinoExtremo });
  if (!legal.ok) return legal;

  const origenFila = extremoEsFilaPlegadaVisible(modelo, opd, origenExtremo);
  const destinoFila = extremoEsFilaPlegadaVisible(modelo, opd, destinoExtremo);
  if (origenFila && destinoFila) {
    return fallo("No se permite conectar dos partes plegadas entre sí");
  }
  if (!extremoVisibleEnOpd(modelo, opd, origenExtremo) && !origenFila) {
    return fallo("El enlace requiere que el origen tenga apariencia o fila plegada en el OPD");
  }
  if (!extremoVisibleEnOpd(modelo, opd, destinoExtremo) && !destinoFila) {
    return fallo("El enlace requiere que el destino tenga apariencia o fila plegada en el OPD");
  }

  const enlaceId = siguienteId(modelo, "e");
  const aparienciaId = siguienteId({ ...modelo, nextSeq: modelo.nextSeq + 1 }, "ae");
  const enlace: Enlace = { id: enlaceId, tipo, origenId: origenExtremo, destinoId: destinoExtremo, etiqueta };
  const apariencia: AparienciaEnlace = { id: aparienciaId, enlaceId, opdId, vertices: [] };

  return ok({
    ...modelo,
    nextSeq: modelo.nextSeq + 2,
    enlaces: { ...modelo.enlaces, [enlaceId]: enlace },
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces: { ...opd.enlaces, [aparienciaId]: apariencia },
      },
    },
  });
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

/**
 * Extrae en una sola operación todas las partes plegadas que aún no tienen
 * apariencia independiente en el OPD activo.
 */
export function extraerTodasLasPartesDePlegado(
  modelo: Modelo,
  opdId: Id,
  padreAparienciaId: Id,
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const padre = opd.apariencias[padreAparienciaId];
  if (!padre) return fallo(`Apariencia padre no existe: ${padreAparienciaId}`);
  if (modoPlegadoApariencia(padre) !== "parcial") return fallo("La extracción requiere plegado parcial activo");

  const extraidasIniciales = partesExtraidasEn(modelo, opdId, padreAparienciaId);
  const extraidasIds = new Set(extraidasIniciales.map((apariencia) => apariencia.entidadId));
  const pendientes = partesDePlegadoOrdenadas(modelo, padre).filter((parte) => !extraidasIds.has(parte.entidadId));
  if (pendientes.length === 0) return ok(modelo);

  let actual = modelo;
  for (let index = 0; index < pendientes.length; index += 1) {
    const parte = pendientes[index];
    if (!parte) continue;
    const antes = new Set(Object.keys(actual.opds[opdId]?.apariencias ?? {}));
    const resultado = extraerParteDePlegado(actual, opdId, padreAparienciaId, parte.entidadId);
    if (!resultado.ok) return resultado;
    actual = reposicionarNuevaParteExtraida(
      resultado.value,
      opdId,
      antes,
      padre,
      extraidasIniciales.length + index,
    );
  }

  return ok(actual);
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
  const partes = partesDePlegadoOrdenadas(modelo, padre);
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
  return ordenarPartesPlegadas(partesDePlegadoEnOrdenMaterial(modelo, entidadId), "alfabetico");
}

function partesDePlegadoEnOrdenMaterial(modelo: Modelo, entidadId: Id): PartePlegada[] {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return [];
  // Si la entidad tiene ambos refinamientos, las partes plegables provienen
  // del despliegue (estructura, agregación) — sin destruir el OPD de
  // descomposición. Sin despliegue, caemos a descomposición. Ronda 15.2.
  const slotDespliegue = obtenerRefinamiento(entidad, "despliegue");
  if (slotDespliegue) {
    const opd = modelo.opds[slotDespliegue.opdId];
    return opd ? partesDeDespliegue(modelo, entidad, opd) : [];
  }
  const slotDescomposicion = obtenerRefinamiento(entidad, "descomposicion");
  if (slotDescomposicion) {
    const opd = modelo.opds[slotDescomposicion.opdId];
    return opd ? subprocesosDeDescomposicion(modelo, entidad, opd) : [];
  }
  return [];
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
      if (!enlace || naturalezaDeEnlace(enlace.tipo) !== "estructural" || !extremoApuntaAEntidad(enlace.origenId, entidad.id) || !destinoId || !visibles.has(destinoId)) return [];
      const parte = modelo.entidades[destinoId];
      return parte ? [{ entidadId: parte.id, nombre: parte.nombre }] : [];
    });
}

function aparienciaDeEntidad(opd: Opd, entidadId: Id): Apariencia | undefined {
  return Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === entidadId);
}

function aparienciaReferenciaParte(modelo: Modelo, padre: Entidad, parteEntidadId: Id): Apariencia | undefined {
  // Buscar la apariencia de la parte en cualquiera de los OPDs hijo del padre.
  for (const ref of refinamientosDe(padre)) {
    const opd = modelo.opds[ref.opdId];
    const apariencia = opd ? aparienciaDeEntidad(opd, parteEntidadId) : undefined;
    if (apariencia) return apariencia;
  }
  return undefined;
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

function reposicionarNuevaParteExtraida(
  modelo: Modelo,
  opdId: Id,
  idsAntes: Set<Id>,
  padre: Apariencia,
  offset: number,
): Modelo {
  const opd = modelo.opds[opdId];
  if (!opd) return modelo;
  const nueva = Object.values(opd.apariencias).find((apariencia) => !idsAntes.has(apariencia.id));
  if (!nueva) return modelo;
  return {
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        apariencias: {
          ...opd.apariencias,
          [nueva.id]: {
            ...nueva,
            x: padre.x + padre.width + 48,
            y: padre.y + offset * (nueva.height + 16),
          },
        },
      },
    },
  };
}

function ordenarPartesPlegadas(partes: PartePlegada[], orden: OrdenPartesPlegado | undefined): PartePlegada[] {
  if ((orden ?? "alfabetico") === "creacion") return [...partes];
  return [...partes].sort((a, b) => a.nombre.localeCompare(b.nombre, "es") || a.entidadId.localeCompare(b.entidadId));
}

function extremoEsFilaPlegadaVisible(modelo: Modelo, opd: Opd, extremo: ReturnType<typeof normalizarExtremo>): boolean {
  if (extremo.kind !== "entidad") return false;
  if (extremoVisibleEnOpd(modelo, opd, extremo)) return false;
  return Object.values(opd.apariencias).some((apariencia) => {
    if (modoPlegadoApariencia(apariencia) !== "parcial") return false;
    return partesDePlegado(modelo, apariencia.entidadId).some((parte) => parte.entidadId === extremo.id);
  });
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

const ORDENES_PARTES: Record<OrdenPartesPlegado, true> = {
  alfabetico: true,
  creacion: true,
};
