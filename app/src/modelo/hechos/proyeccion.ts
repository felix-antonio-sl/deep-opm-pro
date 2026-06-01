import { designacionesEstado } from "../estadosDesignaciones";
import { aparienciaDeEntidadEnOpd } from "../politicaApariciones";
import { estadosVisiblesEnAparicion } from "../visibilidadEstados";
import type { Entidad } from "../tipos/entidad";
import type { Enlace, ExtremoEnlace } from "../tipos/enlace";
import type { Estado } from "../tipos/estado";
import type { Id, Modelo } from "../tipos";
import { conjunto, type ConjuntoDeHechos, type Hecho } from "./tipos";

function hechoEntidad(entidad: Entidad): Hecho {
  return {
    tipo: "entidad",
    entidadId: entidad.id,
    clase: entidad.tipo,
    esencia: entidad.esencia,
    afiliacion: entidad.afiliacion,
  };
}

function hechoEstado(estado: Estado): Hecho {
  return {
    tipo: "estado",
    entidadId: estado.entidadId,
    estadoId: estado.id,
    nombre: estado.nombre,
    designaciones: Object.freeze([...designacionesEstado(estado)]),
  };
}

function hechoEnlace(enlace: Enlace): Hecho {
  const hecho: Hecho = {
    tipo: "enlace",
    enlaceId: enlace.id,
    clase: enlace.tipo,
    origen: { ...enlace.origenId },
    destino: { ...enlace.destinoId },
  };
  if (enlace.modificador !== undefined) return { ...hecho, modificador: enlace.modificador };
  return hecho;
}

function extremoTocaEntidad(extremo: ExtremoEnlace, entidadId: Id, modelo: Modelo): boolean {
  if (extremo.kind === "entidad") return extremo.id === entidadId;
  return modelo.estados[extremo.id]?.entidadId === entidadId;
}

export function hechosDe(modelo: Modelo, opdId?: Id): ConjuntoDeHechos {
  const hechos: Hecho[] = [];
  if (opdId) {
    const opd = modelo.opds[opdId];
    if (!opd) return conjunto([]);

    for (const apariencia of Object.values(opd.apariencias)) {
      const entidad = modelo.entidades[apariencia.entidadId];
      if (!entidad) continue;
      hechos.push(hechoEntidad(entidad));
      for (const estado of estadosVisiblesEnAparicion(modelo, entidad.id, apariencia)) {
        hechos.push(hechoEstado(estado));
      }
    }
    for (const aparienciaEnlace of Object.values(opd.enlaces)) {
      const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
      if (enlace) hechos.push(hechoEnlace(enlace));
    }
    return conjunto(hechos);
  }

  for (const entidad of Object.values(modelo.entidades)) hechos.push(hechoEntidad(entidad));
  for (const estado of Object.values(modelo.estados)) {
    if (!estado.suprimido) hechos.push(hechoEstado(estado));
  }
  for (const enlace of Object.values(modelo.enlaces)) hechos.push(hechoEnlace(enlace));
  return conjunto(hechos);
}

export function seccionLocal(modelo: Modelo, entidadId: Id, opdId: Id): ConjuntoDeHechos {
  const opd = modelo.opds[opdId];
  if (!opd) return conjunto([]);

  const apariencia = aparienciaDeEntidadEnOpd(opd, entidadId);
  const entidad = modelo.entidades[entidadId];
  if (!apariencia || !entidad) return conjunto([]);

  const hechos: Hecho[] = [hechoEntidad(entidad)];
  for (const estado of estadosVisiblesEnAparicion(modelo, entidadId, apariencia)) {
    hechos.push(hechoEstado(estado));
  }
  for (const aparienciaEnlace of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) continue;
    if (
      extremoTocaEntidad(enlace.origenId, entidadId, modelo)
      || extremoTocaEntidad(enlace.destinoId, entidadId, modelo)
    ) {
      hechos.push(hechoEnlace(enlace));
    }
  }
  return conjunto(hechos);
}
