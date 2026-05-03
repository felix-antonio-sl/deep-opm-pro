import { CANON } from "./constantes";
import type {
  Afiliacion,
  Apariencia,
  AparienciaEnlace,
  Enlace,
  Entidad,
  Esencia,
  Id,
  Modelo,
  Opd,
  Posicion,
  Resultado,
  TipoEnlace,
  TipoEntidad,
} from "./tipos";

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
        apariencias: {},
        enlaces: {},
      },
    },
    entidades: {},
    enlaces: {},
    nextSeq: 1,
  };
}

export function crearObjeto(modelo: Modelo, opdId: Id, posicion: Posicion, nombre = "Un Objeto"): Resultado<Modelo> {
  return crearEntidad(modelo, opdId, "objeto", posicion, nombre);
}

export function crearProceso(modelo: Modelo, opdId: Id, posicion: Posicion, nombre = "Un Proceso"): Resultado<Modelo> {
  return crearEntidad(modelo, opdId, "proceso", posicion, nombre);
}

export function renombrarEntidad(modelo: Modelo, entidadId: Id, nombre: string): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  const limpio = nombre.trim();
  if (limpio.length === 0) return fallo("El nombre no puede estar vacío");
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: { ...entidad, nombre: limpio },
    },
  });
}

export function cambiarEsencia(modelo: Modelo, entidadId: Id, esencia: Esencia): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: { ...entidad, esencia },
    },
  });
}

export function cambiarAfiliacion(modelo: Modelo, entidadId: Id, afiliacion: Afiliacion): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: { ...entidad, afiliacion },
    },
  });
}

export function moverApariencia(modelo: Modelo, opdId: Id, entidadId: Id, posicion: Posicion): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = Object.values(opd.apariencias).find((item) => item.entidadId === entidadId);
  if (!apariencia) return fallo(`Apariencia no existe para entidad: ${entidadId}`);

  return moverAparienciaPorId(modelo, opdId, apariencia.id, posicion);
}

export function moverAparienciaPorId(modelo: Modelo, opdId: Id, aparienciaId: Id, posicion: Posicion): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = opd.apariencias[aparienciaId];
  if (!apariencia) return fallo(`Apariencia no existe: ${aparienciaId}`);
  if (apariencia.x === posicion.x && apariencia.y === posicion.y) return ok(modelo);

  return ok({
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        apariencias: {
          ...opd.apariencias,
          [apariencia.id]: { ...apariencia, x: posicion.x, y: posicion.y },
        },
      },
    },
  });
}

export function actualizarVerticesEnlace(
  modelo: Modelo,
  opdId: Id,
  aparienciaEnlaceId: Id,
  vertices: Posicion[],
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = opd.enlaces[aparienciaEnlaceId];
  if (!apariencia) return fallo(`Apariencia de enlace no existe: ${aparienciaEnlaceId}`);
  const normalizados = vertices.map((vertice) => ({ x: vertice.x, y: vertice.y }));
  if (mismosVertices(apariencia.vertices, normalizados)) return ok(modelo);

  return ok({
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces: {
          ...opd.enlaces,
          [aparienciaEnlaceId]: { ...apariencia, vertices: normalizados },
        },
      },
    },
  });
}

export function eliminarEntidad(modelo: Modelo, entidadId: Id): Resultado<Modelo> {
  if (!modelo.entidades[entidadId]) return fallo(`Entidad no existe: ${entidadId}`);

  const entidades = { ...modelo.entidades };
  delete entidades[entidadId];

  const enlacesEliminados = new Set(
    Object.values(modelo.enlaces)
      .filter((enlace) => enlace.origenId === entidadId || enlace.destinoId === entidadId)
      .map((enlace) => enlace.id),
  );
  const enlaces = Object.fromEntries(
    Object.entries(modelo.enlaces).filter(([id]) => !enlacesEliminados.has(id)),
  );

  const opds = Object.fromEntries(
    Object.entries(modelo.opds).map(([opdId, opd]) => [
      opdId,
      {
        ...opd,
        apariencias: Object.fromEntries(
          Object.entries(opd.apariencias).filter(([, apariencia]) => apariencia.entidadId !== entidadId),
        ),
        enlaces: Object.fromEntries(
          Object.entries(opd.enlaces).filter(([, apariencia]) => !enlacesEliminados.has(apariencia.enlaceId)),
        ),
      },
    ]),
  );

  return ok({ ...modelo, entidades, enlaces, opds });
}

export function eliminarEnlace(modelo: Modelo, enlaceId: Id): Resultado<Modelo> {
  if (!modelo.enlaces[enlaceId]) return fallo(`Enlace no existe: ${enlaceId}`);
  const enlaces = { ...modelo.enlaces };
  delete enlaces[enlaceId];

  const opds = Object.fromEntries(
    Object.entries(modelo.opds).map(([opdId, opd]) => [
      opdId,
      {
        ...opd,
        enlaces: Object.fromEntries(
          Object.entries(opd.enlaces).filter(([, apariencia]) => apariencia.enlaceId !== enlaceId),
        ),
      },
    ]),
  );

  return ok({ ...modelo, enlaces, opds });
}

export function crearEnlace(
  modelo: Modelo,
  opdId: Id,
  origenId: Id,
  destinoId: Id,
  tipo: TipoEnlace,
  etiqueta = "",
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const origen = modelo.entidades[origenId];
  const destino = modelo.entidades[destinoId];
  if (!origen) return fallo(`Origen no existe: ${origenId}`);
  if (!destino) return fallo(`Destino no existe: ${destinoId}`);
  if (origenId === destinoId) return fallo("El enlace requiere dos entidades distintas en Sprint 0");

  const legal = validarFirmaEnlace(tipo, origen, destino);
  if (!legal.ok) return legal;

  const enlaceId = siguienteId(modelo, "e");
  const aparienciaId = siguienteId({ ...modelo, nextSeq: modelo.nextSeq + 1 }, "ae");
  const enlace: Enlace = { id: enlaceId, tipo, origenId, destinoId, etiqueta };
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

export function entidadesDelOpd(modelo: Modelo, opdId: Id): Entidad[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  return Object.values(opd.apariencias)
    .map((apariencia) => modelo.entidades[apariencia.entidadId])
    .filter((entidad): entidad is Entidad => entidad !== undefined);
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
    nombre: nombre.trim() || (tipo === "objeto" ? "Un Objeto" : "Un Proceso"),
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

  return ok({
    ...modelo,
    nextSeq: modelo.nextSeq + 2,
    entidades: { ...modelo.entidades, [entidadId]: entidad },
    opds: { ...modelo.opds, [opdId]: nextOpd },
  });
}

function validarFirmaEnlace(tipo: TipoEnlace, origen: Entidad, destino: Entidad): Resultado<true> {
  if (tipo === "agregacion") {
    return origen.tipo === "objeto" && destino.tipo === "objeto"
      ? ok(true)
      : fallo("Agregación requiere Objeto -> Objeto en Sprint 0");
  }
  if (tipo === "agente") {
    return origen.tipo === "objeto" && destino.tipo === "proceso" && origen.esencia === "fisica"
      ? ok(true)
      : fallo("Agente requiere Objeto físico -> Proceso");
  }
  if (tipo === "instrumento") {
    return origen.tipo === "objeto" && destino.tipo === "proceso"
      ? ok(true)
      : fallo("Instrumento requiere Objeto -> Proceso");
  }
  if (tipo === "consumo" || tipo === "resultado" || tipo === "efecto") {
    return origen.tipo === "proceso" && destino.tipo === "objeto"
      ? ok(true)
      : fallo(`${tipo} requiere Proceso -> Objeto`);
  }
  if (tipo === "invocacion") {
    return origen.tipo === "proceso" && destino.tipo === "proceso"
      ? ok(true)
      : fallo("Invocación requiere Proceso -> Proceso");
  }
  return fallo(`Tipo de enlace no soportado: ${tipo satisfies never}`);
}

function mismosVertices(a: Posicion[], b: Posicion[]): boolean {
  return a.length === b.length && a.every((vertice, index) => vertice.x === b[index]?.x && vertice.y === b[index]?.y);
}

function siguienteId(modelo: Modelo, prefijo: string): Id {
  return `${prefijo}-${modelo.nextSeq}`;
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
