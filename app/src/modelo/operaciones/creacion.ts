import { CANON } from "../constantes";
import { nombreReforzadoPorOntologia } from "../ontologia";
import type { Apariencia, Entidad, Id, Modelo, Opd, Posicion, Resultado, TipoEntidad } from "../tipos";
import { nombreEntidadDisponible, nombreUnicoEntidad } from "./entidad";
import { fallo, idModeloExiste, ok, secuenciaPosteriorId, siguienteId } from "./helpers";
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

export function crearObjeto(
  modelo: Modelo,
  opdId: Id,
  posicion: Posicion,
  nombre?: string,
  opciones: { id?: Id } = {},
): Resultado<Modelo> {
  return crearEntidad(modelo, opdId, "objeto", posicion, nombre, opciones);
}

export function crearProceso(
  modelo: Modelo,
  opdId: Id,
  posicion: Posicion,
  nombre?: string,
  opciones: { id?: Id } = {},
): Resultado<Modelo> {
  return crearEntidad(modelo, opdId, "proceso", posicion, nombre, opciones);
}

function crearEntidad(
  modelo: Modelo,
  opdId: Id,
  tipo: TipoEntidad,
  posicion: Posicion,
  nombre: string | undefined,
  opciones: { id?: Id },
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);

  if (opciones.id && idModeloExiste(modelo, opciones.id)) return fallo(`ID ya existe: ${opciones.id}`);

  const nombreBase = tipo === "objeto" ? "Objeto" : "Proceso";
  const nombreLimpio = nombre?.trim();
  const nombreFinal = nombreLimpio ? nombreReforzadoPorOntologia(modelo, nombreLimpio) : nombreUnicoEntidad(modelo, nombreBase);
  if (!nombreEntidadDisponible(modelo, nombreFinal)) {
    return fallo(`Ya existe '${nombreFinal}' en el modelo`);
  }

  const entidadId = opciones.id ?? siguienteId(modelo, tipo === "objeto" ? "o" : "p");
  let aparienciaSeq = modelo.nextSeq + 1;
  let aparienciaId = siguienteId({ ...modelo, nextSeq: aparienciaSeq }, "a");
  while (idModeloExiste(modelo, aparienciaId) || aparienciaId === entidadId) {
    aparienciaSeq += 1;
    aparienciaId = siguienteId({ ...modelo, nextSeq: aparienciaSeq }, "a");
  }
  const entidad: Entidad = {
    id: entidadId,
    tipo,
    nombre: nombreFinal,
    esencia: "informacional",
    afiliacion: "sistemica",
  };
  const aparienciaBase: Apariencia = {
    id: aparienciaId,
    entidadId,
    opdId,
    x: posicion.x,
    y: posicion.y,
    width: CANON.dims.cosaWidth,
    height: CANON.dims.cosaHeight,
  };
  const apariencia: Apariencia = aparienciaBase;

  const nextOpd: Opd = {
    ...opd,
    apariencias: { ...opd.apariencias, [aparienciaId]: apariencia },
  };

  const base: Modelo = {
    ...modelo,
    nextSeq: secuenciaPosteriorId(entidadId, Math.max(modelo.nextSeq + 2, aparienciaSeq + 1)),
    entidades: { ...modelo.entidades, [entidadId]: entidad },
    opds: { ...modelo.opds, [opdId]: nextOpd },
  };

  return tipo === "proceso" ? redistribuirEnlacesExternosSiPrimerSubproceso(base, opdId, entidadId) : ok(base);
}
