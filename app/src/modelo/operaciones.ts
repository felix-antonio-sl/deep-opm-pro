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

export interface DescomposicionProceso {
  modelo: Modelo;
  opdId: Id;
  creado: boolean;
}

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

export function descomponerProceso(modelo: Modelo, opdPadreId: Id, procesoId: Id): Resultado<DescomposicionProceso> {
  const opdPadre = modelo.opds[opdPadreId];
  if (!opdPadre) return fallo(`OPD no existe: ${opdPadreId}`);
  const proceso = modelo.entidades[procesoId];
  if (!proceso) return fallo(`Entidad no existe: ${procesoId}`);
  if (proceso.tipo !== "proceso") return fallo("La descomposición requiere un proceso");
  if (!entidadVisibleEnOpd(opdPadre, procesoId)) {
    return fallo("La descomposición requiere que el proceso tenga apariencia en el OPD activo");
  }

  if (proceso.refinamiento?.tipo === "descomposicion") {
    const opdExistente = modelo.opds[proceso.refinamiento.opdId];
    if (!opdExistente) return fallo(`OPD de descomposición no existe: ${proceso.refinamiento.opdId}`);
    return ok({ modelo, opdId: opdExistente.id, creado: false });
  }

  const opdHijoId = siguienteId(modelo, "opd");
  const aparienciaHijoId = siguienteId({ ...modelo, nextSeq: modelo.nextSeq + 1 }, "a");
  const aparienciaHijo: Apariencia = {
    id: aparienciaHijoId,
    entidadId: procesoId,
    opdId: opdHijoId,
    x: 150,
    y: 90,
    width: 420,
    height: 260,
  };
  const opdHijo: Opd = {
    id: opdHijoId,
    nombre: siguienteNombreOpdHijo(modelo, opdPadreId),
    padreId: opdPadreId,
    apariencias: {
      [aparienciaHijoId]: aparienciaHijo,
    },
    enlaces: {},
  };
  const siguiente: Modelo = {
    ...modelo,
    nextSeq: modelo.nextSeq + 2,
    entidades: {
      ...modelo.entidades,
      [procesoId]: {
        ...proceso,
        refinamiento: {
          tipo: "descomposicion",
          opdId: opdHijoId,
        },
      },
    },
    opds: {
      ...modelo.opds,
      [opdHijoId]: opdHijo,
    },
  };

  return ok({ modelo: siguiente, opdId: opdHijoId, creado: true });
}

export function quitarDescomposicionProceso(modelo: Modelo, procesoId: Id): Resultado<Modelo> {
  const proceso = modelo.entidades[procesoId];
  if (!proceso) return fallo(`Entidad no existe: ${procesoId}`);
  if (proceso.tipo !== "proceso") return fallo("La descomposición requiere un proceso");
  if (proceso.refinamiento?.tipo !== "descomposicion") return fallo("El proceso no tiene descomposición");

  const removidos = idsSubarbolOpd(modelo, proceso.refinamiento.opdId);
  if (!removidos.has(proceso.refinamiento.opdId)) {
    return fallo(`OPD de descomposición no existe: ${proceso.refinamiento.opdId}`);
  }

  const opds = Object.fromEntries(
    Object.entries(modelo.opds).filter(([opdId]) => !removidos.has(opdId)),
  );
  const entidadesVisibles = new Set(
    Object.values(opds).flatMap((opd) => Object.values(opd.apariencias).map((apariencia) => apariencia.entidadId)),
  );
  const entidades = Object.fromEntries(
    Object.entries(modelo.entidades)
      .filter(([entidadId]) => entidadesVisibles.has(entidadId))
      .map(([entidadId, entidad]) => [entidadId, sinRefinamientoRemovido(entidad, removidos)]),
  ) as Record<Id, Entidad>;
  const enlacesVisibles = new Set(
    Object.values(opds).flatMap((opd) => Object.values(opd.enlaces).map((apariencia) => apariencia.enlaceId)),
  );
  const enlaces = Object.fromEntries(
    Object.entries(modelo.enlaces).filter(([enlaceId, enlace]) => (
      enlacesVisibles.has(enlaceId) && entidades[enlace.origenId] && entidades[enlace.destinoId]
    )),
  );
  const opdsSinEnlacesHuerfanos = Object.fromEntries(
    Object.entries(opds).map(([opdId, opd]) => [
      opdId,
      {
        ...opd,
        enlaces: Object.fromEntries(
          Object.entries(opd.enlaces).filter(([, apariencia]) => enlaces[apariencia.enlaceId]),
        ),
      },
    ]),
  );

  return ok({ ...modelo, entidades, enlaces, opds: opdsSinEnlacesHuerfanos });
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
  if (!entidadVisibleEnOpd(opd, origenId) || !entidadVisibleEnOpd(opd, destinoId)) {
    return fallo("El enlace requiere que origen y destino tengan apariencia en el OPD");
  }

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

export function validarFirmaEnlace(tipo: TipoEnlace, origen: Entidad, destino: Entidad): Resultado<true> {
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
  if (tipo === "consumo") {
    return origen.tipo === "objeto" && destino.tipo === "proceso"
      ? ok(true)
      : fallo("Consumo requiere Objeto -> Proceso");
  }
  if (tipo === "resultado") {
    return origen.tipo === "proceso" && destino.tipo === "objeto"
      ? ok(true)
      : fallo("Resultado requiere Proceso -> Objeto");
  }
  if (tipo === "efecto") {
    return origen.tipo !== destino.tipo && (origen.tipo === "objeto" || destino.tipo === "objeto")
      ? ok(true)
      : fallo("Efecto requiere Objeto <-> Proceso");
  }
  if (tipo === "invocacion") {
    return origen.tipo === "proceso" && destino.tipo === "proceso"
      ? ok(true)
      : fallo("Invocación requiere Proceso -> Proceso");
  }
  return fallo(`Tipo de enlace no soportado: ${tipo satisfies never}`);
}

function entidadVisibleEnOpd(opd: Opd, entidadId: Id): boolean {
  return Object.values(opd.apariencias).some((apariencia) => apariencia.entidadId === entidadId);
}

function siguienteNombreOpdHijo(modelo: Modelo, opdPadreId: Id): string {
  const opdPadre = modelo.opds[opdPadreId];
  const codigoPadre = codigoOpd(opdPadre?.nombre ?? "SD");
  const usados = new Set(
    Object.values(modelo.opds)
      .filter((opd) => opd.padreId === opdPadreId)
      .map((opd) => codigoOpd(opd.nombre)),
  );

  for (let index = 1; index < Number.MAX_SAFE_INTEGER; index += 1) {
    const candidato = codigoPadre === "SD" ? `SD${index}` : `${codigoPadre}.${index}`;
    if (!usados.has(candidato)) return candidato;
  }
  return codigoPadre === "SD" ? "SD1" : `${codigoPadre}.1`;
}

function codigoOpd(nombre: string): string {
  return /^SD(?:\d+(?:\.\d+)*)?/.exec(nombre.trim())?.[0] ?? nombre;
}

function idsSubarbolOpd(modelo: Modelo, raizId: Id): Set<Id> {
  const removidos = new Set<Id>();
  const pendientes = [raizId];
  while (pendientes.length > 0) {
    const actual = pendientes.pop();
    if (!actual || removidos.has(actual) || !modelo.opds[actual]) continue;
    removidos.add(actual);
    for (const opd of Object.values(modelo.opds)) {
      if (opd.padreId === actual) pendientes.push(opd.id);
    }
  }
  return removidos;
}

function sinRefinamientoRemovido(entidad: Entidad, removidos: Set<Id>): Entidad {
  if (entidad.refinamiento?.tipo !== "descomposicion" || !removidos.has(entidad.refinamiento.opdId)) return entidad;
  const { refinamiento: _refinamiento, ...sinRefinamiento } = entidad;
  return sinRefinamiento;
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
