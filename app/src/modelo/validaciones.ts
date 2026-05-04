import { naturalezaDeEnlace } from "./constantes";
import type { Apariencia, Enlace, Entidad, Id, Modelo, Opd, TipoEnlace } from "./tipos";

export type SeveridadAviso = "error" | "advertencia" | "info";
export type ElementoAvisoTipo = "entidad" | "enlace" | "opd";

export interface Aviso {
  reglaId: string;
  severidad: SeveridadAviso;
  mensaje: string;
  citaSSOT: string;
  elementoTipo?: ElementoAvisoTipo;
  elementoId?: Id;
  opdId?: Id;
}

const PROCEDURALES = new Set<TipoEnlace>([
  "agente",
  "instrumento",
  "consumo",
  "resultado",
  "efecto",
  "invocacion",
]);

export function validarModelo(modelo: Modelo, opdActivoId: Id): Aviso[] {
  const avisos = [
    ...reglaAgregacionMismaEsencia(modelo, opdActivoId),
    ...reglaGeneralizacionMismoTipo(modelo, opdActivoId),
    ...reglaProceduralNoObjetoObjeto(modelo, opdActivoId),
    ...reglaEstructuralSinDuplicar(modelo, opdActivoId),
    ...reglaSubprocesoNoConectaAlPadre(modelo),
  ];
  return priorizarOpdActivo(avisos, opdActivoId);
}

function reglaAgregacionMismaEsencia(modelo: Modelo, opdActivoId: Id): Aviso[] {
  return enlacesConExtremos(modelo)
    .filter(({ enlace, origen, destino }) => (
      enlace.tipo === "agregacion" && origen.esencia !== destino.esencia
    ))
    .map(({ enlace, origen, destino }) => avisoEnlace(modelo, opdActivoId, enlace, {
      reglaId: "agregacion-misma-esencia",
      severidad: "advertencia",
      mensaje: `Agregación entre ${origen.nombre} y ${destino.nombre} mezcla esencia ${origen.esencia}/${destino.esencia}; revisa si corresponde otra relación estructural.`,
      citaSSOT: "[V-1]",
    }));
}

function reglaGeneralizacionMismoTipo(modelo: Modelo, opdActivoId: Id): Aviso[] {
  return enlacesConExtremos(modelo)
    .filter(({ enlace, origen, destino }) => (
      enlace.tipo === "generalizacion" && origen.tipo !== destino.tipo
    ))
    .map(({ enlace, origen, destino }) => avisoEnlace(modelo, opdActivoId, enlace, {
      reglaId: "generalizacion-mismo-tipo",
      severidad: "error",
      mensaje: `Generalización requiere entidades del mismo tipo OPM; ${origen.nombre} es ${origen.tipo} y ${destino.nombre} es ${destino.tipo}.`,
      citaSSOT: "[V-239]",
    }));
}

function reglaProceduralNoObjetoObjeto(modelo: Modelo, opdActivoId: Id): Aviso[] {
  return enlacesConExtremos(modelo)
    .filter(({ enlace, origen, destino }) => (
      PROCEDURALES.has(enlace.tipo) && origen.tipo === "objeto" && destino.tipo === "objeto"
    ))
    .map(({ enlace, origen, destino }) => avisoEnlace(modelo, opdActivoId, enlace, {
      reglaId: "procedural-no-objeto-objeto",
      severidad: "error",
      mensaje: `El enlace procedural ${etiquetaTipo(enlace.tipo)} no puede conectar objeto con objeto: ${origen.nombre} -> ${destino.nombre}.`,
      citaSSOT: "[V-239]",
    }));
}

function reglaEstructuralSinDuplicar(modelo: Modelo, opdActivoId: Id): Aviso[] {
  const vistos = new Set<string>();
  const avisos: Aviso[] = [];

  for (const { enlace, origen, destino } of enlacesConExtremos(modelo)) {
    if (naturalezaDeEnlace(enlace.tipo) !== "estructural") continue;
    const clave = `${enlace.tipo}:${enlace.origenId}->${enlace.destinoId}`;
    if (!vistos.has(clave)) {
      vistos.add(clave);
      continue;
    }
    avisos.push(avisoEnlace(modelo, opdActivoId, enlace, {
      reglaId: "estructural-sin-duplicar",
      severidad: "advertencia",
      mensaje: `El par ${origen.nombre} -> ${destino.nombre} ya tiene un enlace estructural ${etiquetaTipo(enlace.tipo)}.`,
      citaSSOT: "[V-239]",
    }));
  }

  return avisos;
}

function reglaSubprocesoNoConectaAlPadre(modelo: Modelo): Aviso[] {
  const avisos: Aviso[] = [];

  for (const opd of Object.values(modelo.opds)) {
    const contexto = contextoDescomposicion(modelo, opd);
    if (!contexto) continue;

    const subprocesosInternos = new Set(
      Object.values(opd.apariencias)
        .filter((apariencia) => apariencia.entidadId !== contexto.padre.id && dentroDe(apariencia, contexto.contorno))
        .map((apariencia) => modelo.entidades[apariencia.entidadId])
        .filter((entidad): entidad is Entidad => entidad?.tipo === "proceso")
        .map((entidad) => entidad.id),
    );

    if (subprocesosInternos.size === 0) continue;

    for (const aparienciaEnlace of Object.values(opd.enlaces)) {
      const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
      if (!enlace) continue;
      const conectaPadreConSubproceso = (
        enlace.origenId === contexto.padre.id && subprocesosInternos.has(enlace.destinoId)
      ) || (
        enlace.destinoId === contexto.padre.id && subprocesosInternos.has(enlace.origenId)
      );
      if (!conectaPadreConSubproceso) continue;

      const otroId = enlace.origenId === contexto.padre.id ? enlace.destinoId : enlace.origenId;
      const subproceso = modelo.entidades[otroId];
      avisos.push({
        reglaId: "subproceso-no-conecta-al-padre",
        severidad: "error",
        mensaje: `El subproceso interno ${subproceso?.nombre ?? otroId} no debe enlazarse explícitamente con su proceso refinable ${contexto.padre.nombre}.`,
        citaSSOT: "[Glos 3.33]",
        elementoTipo: "enlace",
        elementoId: enlace.id,
        opdId: opd.id,
      });
    }
  }

  return avisos;
}

function enlacesConExtremos(modelo: Modelo): Array<{ enlace: Enlace; origen: Entidad; destino: Entidad }> {
  return Object.values(modelo.enlaces).flatMap((enlace) => {
    const origen = modelo.entidades[enlace.origenId];
    const destino = modelo.entidades[enlace.destinoId];
    return origen && destino ? [{ enlace, origen, destino }] : [];
  });
}

function avisoEnlace(
  modelo: Modelo,
  opdActivoId: Id,
  enlace: Enlace,
  base: Pick<Aviso, "reglaId" | "severidad" | "mensaje" | "citaSSOT">,
): Aviso {
  const opdId = opdIdDeEnlace(modelo, enlace.id, opdActivoId);
  return {
    ...base,
    elementoTipo: "enlace",
    elementoId: enlace.id,
    ...(opdId ? { opdId } : {}),
  };
}

function contextoDescomposicion(modelo: Modelo, opd: Opd): { padre: Entidad; contorno: Apariencia } | null {
  if (!opd.padreId) return null;
  const padre = Object.values(modelo.entidades).find((entidad) => (
    entidad.tipo === "proceso" &&
    entidad.refinamiento?.tipo === "descomposicion" &&
    entidad.refinamiento.opdId === opd.id
  ));
  if (!padre) return null;
  const contorno = Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === padre.id);
  return contorno ? { padre, contorno } : null;
}

function opdIdDeEnlace(modelo: Modelo, enlaceId: Id, opdPreferidoId: Id): Id | null {
  const opdPreferido = modelo.opds[opdPreferidoId];
  if (opdPreferido && Object.values(opdPreferido.enlaces).some((apariencia) => apariencia.enlaceId === enlaceId)) {
    return opdPreferidoId;
  }
  for (const opd of Object.values(modelo.opds)) {
    if (Object.values(opd.enlaces).some((apariencia) => apariencia.enlaceId === enlaceId)) return opd.id;
  }
  return null;
}

function priorizarOpdActivo(avisos: Aviso[], opdActivoId: Id): Aviso[] {
  return avisos
    .map((aviso, index) => ({ aviso, index }))
    .sort((a, b) => prioridadOpd(a.aviso, opdActivoId) - prioridadOpd(b.aviso, opdActivoId) || a.index - b.index)
    .map(({ aviso }) => aviso);
}

function prioridadOpd(aviso: Aviso, opdActivoId: Id): number {
  if (!aviso.opdId) return 1;
  return aviso.opdId === opdActivoId ? 0 : 2;
}

function dentroDe(apariencia: Apariencia, contorno: Apariencia): boolean {
  return (
    apariencia.x >= contorno.x &&
    apariencia.y >= contorno.y &&
    apariencia.x + apariencia.width <= contorno.x + contorno.width &&
    apariencia.y + apariencia.height <= contorno.y + contorno.height
  );
}

function etiquetaTipo(tipo: TipoEnlace): string {
  return tipo.replaceAll("-", " ");
}
