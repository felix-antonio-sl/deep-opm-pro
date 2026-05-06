import { CANON } from "../constantes";
import type { Apariencia, Entidad, Id, Modelo, Opd, Posicion, Resultado, TipoEntidad } from "../tipos";
import { fallo, ok, siguienteId } from "./helpers";
import { redistribuirEnlacesExternosSiPrimerSubproceso } from "./refinamiento";

/**
 * Operaciones de creación: modelo nuevo con OPD raíz, objeto y proceso en un OPD.
 * `crearObjeto` y `crearProceso` delegan a `crearEntidad` (helper privado);
 * para `proceso` se llama también a `redistribuirEnlacesExternosSiPrimerSubproceso`
 * cuando el OPD activo es un refinamiento (HU-12.* refinamiento).
 *
 * Refs: SSOT opm-iso-19450-es.md §3.55 (Object), §3.69 (Process).
 */

export function crearModelo(nombre = "Modelo OPM"): Modelo {
  const opdRaizId = "opd-1";
  return {
    id: "modelo-1",
    nombre,
    opdRaizId,
    opds: {
      [opdRaizId]: {
        id: opdRaizId,
        nombre: "SD",
        padreId: null,
        apariencias: {},
        enlaces: {},
      },
    },
    entidades: {},
    estados: {},
    enlaces: {},
    nextSeq: 1,
  };
}

export function crearObjeto(modelo: Modelo, opdId: Id, posicion: Posicion, nombre = "Objeto"): Resultado<Modelo> {
  return crearEntidad(modelo, opdId, "objeto", posicion, nombre);
}

export function crearProceso(modelo: Modelo, opdId: Id, posicion: Posicion, nombre = "Proceso"): Resultado<Modelo> {
  return crearEntidad(modelo, opdId, "proceso", posicion, nombre);
}

function crearEntidad(
  modelo: Modelo,
  opdId: Id,
  tipo: TipoEntidad,
  posicion: Posicion,
  nombre: string,
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);

  const entidadId = siguienteId(modelo, tipo === "objeto" ? "o" : "p");
  const aparienciaId = siguienteId({ ...modelo, nextSeq: modelo.nextSeq + 1 }, "a");
  const entidad: Entidad = {
    id: entidadId,
    tipo,
    nombre: nombre.trim() || (tipo === "objeto" ? "Objeto" : "Proceso"),
    esencia: "informacional",
    afiliacion: "sistemica",
  };
  const apariencia: Apariencia = {
    id: aparienciaId,
    entidadId,
    opdId,
    x: posicion.x,
    y: posicion.y,
    width: CANON.dims.cosaWidth,
    height: CANON.dims.cosaHeight,
  };

  const nextOpd: Opd = {
    ...opd,
    apariencias: { ...opd.apariencias, [aparienciaId]: apariencia },
  };

  const base: Modelo = {
    ...modelo,
    nextSeq: modelo.nextSeq + 2,
    entidades: { ...modelo.entidades, [entidadId]: entidad },
    opds: { ...modelo.opds, [opdId]: nextOpd },
  };

  return tipo === "proceso" ? redistribuirEnlacesExternosSiPrimerSubproceso(base, opdId, entidadId) : ok(base);
}
