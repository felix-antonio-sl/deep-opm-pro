import type { Id } from "../tipos/comunes";
import type { Afiliacion, Esencia, TipoEntidad } from "../tipos/entidad";
import type { DesignacionEstado } from "../tipos/estado";
import type { ExtremoEnlace, Modificador, TipoEnlace } from "../tipos/enlace";

/**
 * Hecho OPM atomico: la unidad minima de la denotacion de un modelo.
 * Capa semantica, no primitiva OPM nueva.
 */
export type Hecho =
  | {
      tipo: "entidad";
      entidadId: Id;
      clase: TipoEntidad;
      esencia: Esencia;
      afiliacion: Afiliacion;
    }
  | {
      tipo: "estado";
      entidadId: Id;
      estadoId: Id;
      nombre: string;
      designaciones: readonly DesignacionEstado[];
    }
  | {
      tipo: "enlace";
      enlaceId: Id;
      clase: TipoEnlace;
      origen: ExtremoEnlace;
      destino: ExtremoEnlace;
      modificador?: Modificador;
    };

/** Conjunto de hechos con igualdad estructural: clave canonica -> hecho. */
export type ConjuntoDeHechos = ReadonlyMap<string, Hecho>;

function claveExtremo(extremo: ExtremoEnlace): string {
  return `${extremo.kind}:${extremo.id}`;
}

function clonarExtremo(extremo: ExtremoEnlace): ExtremoEnlace {
  return { ...extremo };
}

function clonarHecho(hecho: Hecho): Hecho {
  switch (hecho.tipo) {
    case "entidad":
      return { ...hecho };
    case "estado":
      return { ...hecho, designaciones: Object.freeze([...hecho.designaciones]) };
    case "enlace": {
      const base: Hecho = {
        tipo: "enlace",
        enlaceId: hecho.enlaceId,
        clase: hecho.clase,
        origen: clonarExtremo(hecho.origen),
        destino: clonarExtremo(hecho.destino),
      };
      if (hecho.modificador !== undefined) return { ...base, modificador: hecho.modificador };
      return base;
    }
  }
}

export function claveHecho(hecho: Hecho): string {
  switch (hecho.tipo) {
    case "entidad":
      return `entidad|${hecho.entidadId}|${hecho.clase}|${hecho.esencia}|${hecho.afiliacion}`;
    case "estado":
      return `estado|${hecho.entidadId}|${hecho.estadoId}|${hecho.nombre}|${[...hecho.designaciones].sort().join(",")}`;
    case "enlace":
      return [
        "enlace",
        hecho.enlaceId,
        hecho.clase,
        claveExtremo(hecho.origen),
        claveExtremo(hecho.destino),
        hecho.modificador ?? "no",
      ].join("|");
  }
}

export function conjunto(hechos: readonly Hecho[]): ConjuntoDeHechos {
  const resultado = new Map<string, Hecho>();
  for (const hecho of hechos) resultado.set(claveHecho(hecho), clonarHecho(hecho));
  return resultado;
}
