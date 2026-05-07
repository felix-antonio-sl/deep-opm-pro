import { entidadIdDeExtremo, extremoEntidad } from "../modelo/extremos";
import { CANON } from "../modelo/constantes";
import { aplicarEstiloEnlace } from "../modelo/enlaceEstilo";
import { aplicarEstiloApariencia } from "../modelo/estilos";
import { crearEnlace, eliminarEnlace, eliminarEntidad, moverAparienciaPorId } from "../modelo/operaciones";
import { eliminarEnlacesBatch as eliminarEnlacesBatchModelo } from "../modelo/operaciones/enlaces";
import { fijarRefinamiento, refinamientosDe } from "../modelo/refinamientos";
import type {
  Apariencia,
  AparienciaEnlace,
  Entidad,
  EnlaceEstilo,
  EstiloApariencia,
  Id,
  Modelo,
  Opd,
  Posicion,
  Resultado,
  Estado,
  TipoEnlace,
  UiPortapapelesVisual,
} from "../modelo/tipos";
import { RESIZE_MIN } from "./grid";
import { centroApariencia, layoutRadial } from "./layoutRadial";
import { type FamiliaTraerConectados, normalizarFamiliasTraer, reglaTraerPorFamilias } from "./reglasTraer";
import { enlacesInternosSeleccion } from "./seleccionMultiple";

export type EjeAlineacion = "izq" | "centro" | "der" | "sup" | "medio" | "inf";
export type OrientacionDistribucion = "horizontal" | "vertical";

export function eliminarBatch(modelo: Modelo, ids: Id[], opdId?: Id): Resultado<Modelo> {
  const seleccion = new Set(ids);
  let siguiente = modelo;
  const opds = opdId ? [opdId] : Object.keys(modelo.opds);

  for (const id of ids) {
    if (siguiente.enlaces[id]) {
      const resultado = eliminarEnlace(siguiente, id);
      if (!resultado.ok) return resultado;
      siguiente = resultado.value;
    }
  }

  const entidadesAEliminar = new Set<Id>();
  for (const id of ids) {
    if (siguiente.entidades[id]) entidadesAEliminar.add(id);
  }
  for (const actualOpdId of opds) {
    const opd = siguiente.opds[actualOpdId];
    if (!opd) continue;
    for (const apariencia of Object.values(opd.apariencias)) {
      if (seleccion.has(apariencia.entidadId) || seleccion.has(apariencia.id)) {
        entidadesAEliminar.add(apariencia.entidadId);
      }
    }
  }

  for (const entidadId of entidadesAEliminar) {
    if (!siguiente.entidades[entidadId]) continue;
    const resultado = eliminarEntidad(siguiente, entidadId);
    if (!resultado.ok) return resultado;
    siguiente = resultado.value;
  }

  return { ok: true, value: purgarHuerfanos(siguiente) };
}

export function nudgeApariencias(modelo: Modelo, opdId: Id, ids: Id[], dx: number, dy: number): Resultado<Modelo> {
  let siguiente = modelo;
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  for (const apariencia of Object.values(opd.apariencias)) {
    if (!ids.includes(apariencia.entidadId) && !ids.includes(apariencia.id)) continue;
    const resultado = moverAparienciaPorId(siguiente, opdId, apariencia.id, {
      x: apariencia.x + dx,
      y: apariencia.y + dy,
    });
    if (!resultado.ok) return resultado;
    siguiente = resultado.value;
  }
  return ok(siguiente);
}

export function nudgeEnlaces(modelo: Modelo, opdId: Id, ids: Id[], dx: number, dy: number): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const enlaces = Object.fromEntries(Object.entries(opd.enlaces).map(([id, apariencia]) => [
    id,
    ids.includes(apariencia.enlaceId) || ids.includes(apariencia.id)
      ? { ...apariencia, vertices: apariencia.vertices.map((v) => ({ x: v.x + dx, y: v.y + dy })) }
      : apariencia,
  ])) as Record<Id, AparienciaEnlace>;
  return ok({ ...modelo, opds: { ...modelo.opds, [opdId]: { ...opd, enlaces } } });
}

export function alinearEnlacesIzquierda(modelo: Modelo, opdId: Id, ids: Id[]): Resultado<Modelo> {
  return alinearEnlaces(modelo, opdId, ids, "x", "min");
}

export function alinearEnlacesDerecha(modelo: Modelo, opdId: Id, ids: Id[]): Resultado<Modelo> {
  return alinearEnlaces(modelo, opdId, ids, "x", "max");
}

export function alinearEnlacesArriba(modelo: Modelo, opdId: Id, ids: Id[]): Resultado<Modelo> {
  return alinearEnlaces(modelo, opdId, ids, "y", "min");
}

export function alinearEnlacesAbajo(modelo: Modelo, opdId: Id, ids: Id[]): Resultado<Modelo> {
  return alinearEnlaces(modelo, opdId, ids, "y", "max");
}

export function conectarMultiAlTodo(
  modelo: Modelo,
  opdId: Id,
  partesApariencias: Id[],
  todoApariencia: Id,
  tipoEnlace: TipoEnlace,
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const todoId = entidadDesdeSeleccion(opd, todoApariencia);
  if (!todoId) return fallo("Selecciona un todo visible");
  if (modelo.entidades[todoId]?.tipo !== "objeto") return fallo("El todo debe ser un objeto");

  let siguiente = modelo;
  for (const parteSeleccionada of partesApariencias) {
    const parteId = entidadDesdeSeleccion(opd, parteSeleccionada);
    if (!parteId || parteId === todoId) continue;
    if (modelo.entidades[parteId]?.tipo !== "objeto") continue;
    const existe = Object.values(siguiente.enlaces).some((enlace) => (
      enlace.tipo === tipoEnlace &&
      entidadIdDeExtremoLigero(siguiente, enlace.origenId) === todoId &&
      entidadIdDeExtremoLigero(siguiente, enlace.destinoId) === parteId &&
      Object.values(siguiente.opds[opdId]?.enlaces ?? {}).some((ap) => ap.enlaceId === enlace.id)
    ));
    if (existe) continue;
    const creado = crearEnlace(siguiente, opdId, extremoEntidad(todoId), extremoEntidad(parteId), tipoEnlace);
    if (!creado.ok) return creado;
    siguiente = creado.value;
  }
  return ok(siguiente);
}

/**
 * Hidrata el OPD activo con apariencias de vecinos directos y sus enlaces,
 * sin crear entidades ni enlaces logical nuevos.
 *
 * SSOT: [Met §multi-OPD] OPDs como vistas de un modelo comun; [Glos 3.6]
 * apariencia/contexto visual separado del hecho de modelo. [JOYAS §2][JOYAS §4]
 * dimensiones 135x60 y enlaces wrapper+line preservados por la proyeccion.
 * Referencia tecnica verificada: opm-extracted/src/app/models/Actions/BringConnectedEntitiesAction.ts.
 */
export function traerConectadosBatch(
  modelo: Modelo,
  opdId: Id,
  aparienciaOrigenId: Id,
  familiasInput?: readonly FamiliaTraerConectados[],
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const origenApariencia = aparienciaDesdeIdOEntidad(opd, aparienciaOrigenId);
  if (!origenApariencia) return fallo("Selecciona una apariencia visible");
  const origenEntidadId = origenApariencia.entidadId;
  const familias = normalizarFamiliasTraer(familiasInput);
  const enlacesCandidatos = Object.values(modelo.enlaces)
    .filter((enlace) => {
      const regla = reglaTraerPorFamilias(modelo, enlace, familias);
      if (regla.enlaces.length === 0) return false;
      const origen = entidadIdDeExtremo(modelo, enlace.origenId);
      const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
      return origen === origenEntidadId || destino === origenEntidadId;
    })
    .sort((a, b) => a.id.localeCompare(b.id, "es-CL"));

  if (enlacesCandidatos.length === 0) return ok(modelo);

  const apariencias: Record<Id, Apariencia> = { ...opd.apariencias };
  const enlaces: Record<Id, AparienciaEnlace> = { ...opd.enlaces };
  let nextSeq = modelo.nextSeq;
  const visibles = new Map(Object.values(apariencias).map((apariencia) => [apariencia.entidadId, apariencia]));
  const vecinosFaltantes = new Set<Id>();

  for (const enlace of enlacesCandidatos) {
    const origen = entidadIdDeExtremo(modelo, enlace.origenId);
    const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
    const vecino = origen === origenEntidadId ? destino : destino === origenEntidadId ? origen : null;
    if (!vecino || !modelo.entidades[vecino]) continue;
    if (!visibles.has(vecino)) vecinosFaltantes.add(vecino);
  }

  const posiciones = layoutRadial(
    centroApariencia(origenApariencia),
    vecinosFaltantes.size,
    Object.values(apariencias),
    { width: CANON.dims.cosaWidth, height: CANON.dims.cosaHeight },
  );

  for (const [index, entidadId] of [...vecinosFaltantes].entries()) {
    const id = siguienteId(nextSeq, "a");
    nextSeq += 1;
    const posicion = posiciones[index] ?? { x: origenApariencia.x + 180, y: origenApariencia.y };
    const apariencia: Apariencia = {
      id,
      entidadId,
      opdId,
      x: posicion.x,
      y: posicion.y,
      width: CANON.dims.cosaWidth,
      height: CANON.dims.cosaHeight,
    };
    apariencias[id] = apariencia;
    visibles.set(entidadId, apariencia);
  }

  for (const enlace of enlacesCandidatos) {
    if (Object.values(enlaces).some((apariencia) => apariencia.enlaceId === enlace.id)) continue;
    const origen = entidadIdDeExtremo(modelo, enlace.origenId);
    const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (!origen || !destino || !visibles.has(origen) || !visibles.has(destino)) continue;
    const id = siguienteId(nextSeq, "ae");
    nextSeq += 1;
    enlaces[id] = { id, enlaceId: enlace.id, opdId, vertices: [] };
  }

  if (nextSeq === modelo.nextSeq) return ok(modelo);
  return ok({
    ...modelo,
    nextSeq,
    opds: {
      ...modelo.opds,
      [opdId]: { ...opd, apariencias, enlaces },
    },
  });
}

export function traerEnlacesEntreBatch(modelo: Modelo, opdId: Id, aparienciasIds: readonly Id[]): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const internos = enlacesInternosSeleccion(modelo, opdId, aparienciasIds);
  if (internos.length === 0) return ok(modelo);
  let nextSeq = modelo.nextSeq;
  const enlaces: Record<Id, AparienciaEnlace> = { ...opd.enlaces };
  const visibles = new Set(Object.values(opd.apariencias).map((apariencia) => apariencia.entidadId));

  for (const enlaceId of internos) {
    if (Object.values(enlaces).some((apariencia) => apariencia.enlaceId === enlaceId)) continue;
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace) continue;
    const origen = entidadIdDeExtremo(modelo, enlace.origenId);
    const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (!origen || !destino || !visibles.has(origen) || !visibles.has(destino)) continue;
    const id = siguienteId(nextSeq, "ae");
    nextSeq += 1;
    enlaces[id] = { id, enlaceId, opdId, vertices: [] };
  }

  if (nextSeq === modelo.nextSeq) return ok(modelo);
  return ok({ ...modelo, nextSeq, opds: { ...modelo.opds, [opdId]: { ...opd, enlaces } } });
}

export function ocultarAparienciaBatch(modelo: Modelo, opdId: Id, aparienciaId: Id): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = aparienciaDesdeIdOEntidad(opd, aparienciaId);
  if (!apariencia) return fallo("La entidad no tiene apariencia en el OPD activo");
  const entidadId = apariencia.entidadId;
  const apariencias = Object.fromEntries(
    Object.entries(opd.apariencias).filter(([id]) => id !== apariencia.id),
  ) as Record<Id, Apariencia>;
  const enlaces = Object.fromEntries(
    Object.entries(opd.enlaces).filter(([, aparienciaEnlace]) => {
      const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
      if (!enlace) return false;
      return entidadIdDeExtremo(modelo, enlace.origenId) !== entidadId &&
        entidadIdDeExtremo(modelo, enlace.destinoId) !== entidadId;
    }),
  ) as Record<Id, AparienciaEnlace>;
  return ok({ ...modelo, opds: { ...modelo.opds, [opdId]: { ...opd, apariencias, enlaces } } });
}

export function aplicarEstiloApariencias(
  modelo: Modelo,
  opdId: Id,
  ids: Id[],
  estilo: Partial<EstiloApariencia>,
): Resultado<Modelo> {
  let siguiente = modelo;
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  for (const apariencia of Object.values(opd.apariencias)) {
    if (!ids.includes(apariencia.entidadId) && !ids.includes(apariencia.id)) continue;
    const resultado = aplicarEstiloApariencia(siguiente, opdId, apariencia.id, estilo as EstiloApariencia);
    if (!resultado.ok) return resultado;
    siguiente = resultado.value;
  }
  return ok(siguiente);
}

export function aplicarEstiloEnlaces(
  modelo: Modelo,
  _opdId: Id,
  ids: Id[],
  estilo: Partial<EnlaceEstilo>,
): Resultado<Modelo> {
  let siguiente = modelo;
  for (const enlaceId of ids) {
    if (!siguiente.enlaces[enlaceId]) continue;
    const resultado = aplicarEstiloEnlace(siguiente, enlaceId, estilo);
    if (!resultado.ok) return resultado;
    siguiente = resultado.value;
  }
  return ok(siguiente);
}

export function eliminarEnlacesBatch(modelo: Modelo, enlaceIds: Id[]): Resultado<Modelo> {
  return eliminarEnlacesBatchModelo(modelo, enlaceIds);
}

export function aplicarEstiloEnlacesBatch(
  modelo: Modelo,
  opdId: Id,
  enlaceIds: Id[],
  estilo: Partial<EnlaceEstilo>,
): Resultado<Modelo> {
  return aplicarEstiloEnlaces(modelo, opdId, enlaceIds, estilo);
}

/**
 * Inserta una plantilla como copia local desacoplada en el OPD activo.
 * Citas SSOT: [Met §8.8] insertar plantilla crea copia local sin propagación;
 * [V-52]/[V-123] cada copia declara existencia propia y apariencias locales.
 * Evidencia OPCloud: templates-import + existing-name-dialog; MVP beta usa
 * sufijo `_n` automático en vez de diálogo "Use Existing Thing".
 */
export interface ResultadoInsertarPlantilla {
  modelo: Modelo;
  idsNuevos: Id[];
  entidadesInsertadas: number;
  enlacesInsertados: number;
  opdsInsertados: number;
}

export function insertarPlantillaBatch(
  modeloDestino: Modelo,
  opdDestinoId: Id,
  modeloFuente: Modelo,
  opdFuenteId = modeloFuente.opdRaizId,
): Resultado<ResultadoInsertarPlantilla> {
  const opdDestino = modeloDestino.opds[opdDestinoId];
  const opdFuente = modeloFuente.opds[opdFuenteId];
  if (!opdDestino) return fallo(`OPD destino no existe: ${opdDestinoId}`);
  if (!opdFuente) return fallo(`OPD fuente no existe: ${opdFuenteId}`);

  const subarbol = subarbolOpds(modeloFuente, opdFuenteId, 10);
  const opdMap = new Map<Id, Id>([[opdFuenteId, opdDestinoId]]);
  const entidadMap = new Map<Id, Id>();
  const estadoMap = new Map<Id, Id>();
  const enlaceMap = new Map<Id, Id>();
  let nextSeq = modeloDestino.nextSeq;
  const idsReservados = idsModelo(modeloDestino);
  for (const id of idsModelo(modeloFuente)) idsReservados.add(id);

  const nextId = (prefijo: string): Id => {
    let id = siguienteId(nextSeq, prefijo);
    nextSeq += 1;
    while (idsReservados.has(id)) {
      id = siguienteId(nextSeq, prefijo);
      nextSeq += 1;
    }
    idsReservados.add(id);
    return id;
  };

  for (const opd of subarbol) {
    if (opd.id === opdFuenteId) continue;
    opdMap.set(opd.id, nextId("opd"));
  }

  const entidadesFuente = entidadesEnOpds(modeloFuente, subarbol);
  const nombresDestino = new Set(
    Object.values(opdDestino.apariencias)
      .map((apariencia) => modeloDestino.entidades[apariencia.entidadId]?.nombre)
      .filter((nombre): nombre is string => typeof nombre === "string")
      .map((nombre) => nombre.toLocaleLowerCase("es-CL")),
  );
  const entidades: Record<Id, Entidad> = { ...modeloDestino.entidades };
  const idsNuevos: Id[] = [];

  for (const entidadFuente of entidadesFuente) {
    const nuevoId = nextId(entidadFuente.tipo === "objeto" ? "o" : "p");
    entidadMap.set(entidadFuente.id, nuevoId);
    const visibleEnRaiz = Object.values(opdFuente.apariencias).some((apariencia) => apariencia.entidadId === entidadFuente.id);
    const nombre = visibleEnRaiz ? nombreSinColision(entidadFuente.nombre, nombresDestino) : entidadFuente.nombre;
    if (visibleEnRaiz) nombresDestino.add(nombre.toLocaleLowerCase("es-CL"));
    let entidadCopiada: Entidad = {
      ...entidadFuente,
      id: nuevoId,
      nombre,
    };
    // Reset de refinamientos; se vuelven a fijar solo aquellos cuyo opd
    // destino fue copiado (mapa opdMap). Ronda 15.2: ambos slots posibles.
    const { refinamientos: _omitido, ...sinRefinamientos } = entidadCopiada;
    entidadCopiada = sinRefinamientos as Entidad;
    for (const ref of refinamientosDe(entidadFuente)) {
      const nuevoOpdId = opdMap.get(ref.opdId);
      if (!nuevoOpdId) continue;
      const slot = ref.tipo === "despliegue"
        ? { opdId: nuevoOpdId, ...(ref.modo ? { modo: ref.modo } : {}) }
        : { opdId: nuevoOpdId };
      entidadCopiada = fijarRefinamiento(entidadCopiada, ref.tipo, slot);
    }
    entidades[nuevoId] = entidadCopiada;
    idsNuevos.push(nuevoId);
  }

  const estados: Record<Id, Estado> = { ...modeloDestino.estados };
  for (const estadoFuente of Object.values(modeloFuente.estados)) {
    const nuevaEntidadId = entidadMap.get(estadoFuente.entidadId);
    if (!nuevaEntidadId) continue;
    const nuevoEstadoId = nextId("s");
    estadoMap.set(estadoFuente.id, nuevoEstadoId);
    estados[nuevoEstadoId] = { ...estadoFuente, id: nuevoEstadoId, entidadId: nuevaEntidadId };
  }

  const enlaces: Modelo["enlaces"] = { ...modeloDestino.enlaces };
  const opds: Record<Id, Opd> = { ...modeloDestino.opds };
  for (const opdFuenteActual of subarbol) {
    const opdDestinoActualId = opdMap.get(opdFuenteActual.id);
    if (!opdDestinoActualId) continue;
    const opdDestinoActual: Opd = opdFuenteActual.id === opdFuenteId
      ? opds[opdDestinoId]!
      : {
          id: opdDestinoActualId,
          nombre: opdFuenteActual.nombre,
          padreId: opdFuenteActual.padreId ? opdMap.get(opdFuenteActual.padreId) ?? opdDestinoId : opdDestinoId,
          apariencias: {},
          enlaces: {},
          ...(opdFuenteActual.ordenLocal !== undefined ? { ordenLocal: opdFuenteActual.ordenLocal } : {}),
        };
    const apariencias = { ...opdDestinoActual.apariencias };
    const aparienciasMap = new Map<Id, Id>();
    for (const aparienciaFuente of Object.values(opdFuenteActual.apariencias)) {
      const nuevaEntidadId = entidadMap.get(aparienciaFuente.entidadId);
      if (!nuevaEntidadId) continue;
      const nuevaAparienciaId = nextId("a");
      aparienciasMap.set(aparienciaFuente.id, nuevaAparienciaId);
      const aparienciaCopiada: Apariencia = {
        ...aparienciaFuente,
        id: nuevaAparienciaId,
        entidadId: nuevaEntidadId,
        opdId: opdDestinoActualId,
      };
      if (aparienciaFuente.parteExtraidaDe) {
        const parteExtraidaDe = remapParteExtraida(aparienciaFuente.parteExtraidaDe, aparienciasMap, entidadMap);
        if (parteExtraidaDe) aparienciaCopiada.parteExtraidaDe = parteExtraidaDe;
        else delete aparienciaCopiada.parteExtraidaDe;
      }
      apariencias[nuevaAparienciaId] = aparienciaCopiada;
    }

    const aparienciasEnlace = { ...opdDestinoActual.enlaces };
    for (const aparienciaEnlaceFuente of Object.values(opdFuenteActual.enlaces)) {
      const enlaceFuente = modeloFuente.enlaces[aparienciaEnlaceFuente.enlaceId];
      if (!enlaceFuente) continue;
      const origenId = remapExtremo(enlaceFuente.origenId, entidadMap, estadoMap);
      const destinoId = remapExtremo(enlaceFuente.destinoId, entidadMap, estadoMap);
      if (!origenId || !destinoId) continue;
      let nuevoEnlaceId = enlaceMap.get(enlaceFuente.id);
      if (!nuevoEnlaceId) {
        nuevoEnlaceId = nextId("e");
        enlaceMap.set(enlaceFuente.id, nuevoEnlaceId);
        enlaces[nuevoEnlaceId] = {
          ...enlaceFuente,
          id: nuevoEnlaceId,
          origenId,
          destinoId,
          ...(enlaceFuente.derivado ? { derivado: { ...enlaceFuente.derivado } } : {}),
        };
        idsNuevos.push(nuevoEnlaceId);
      }
      const nuevaAparienciaEnlaceId = nextId("ae");
      aparienciasEnlace[nuevaAparienciaEnlaceId] = {
        ...aparienciaEnlaceFuente,
        id: nuevaAparienciaEnlaceId,
        enlaceId: nuevoEnlaceId,
        opdId: opdDestinoActualId,
        vertices: aparienciaEnlaceFuente.vertices.map((vertice) => ({ ...vertice })),
      };
    }
    opds[opdDestinoActualId] = { ...opdDestinoActual, apariencias, enlaces: aparienciasEnlace };
  }

  return ok({
    modelo: { ...modeloDestino, nextSeq, entidades, estados, enlaces, opds },
    idsNuevos,
    entidadesInsertadas: entidadMap.size,
    enlacesInsertados: enlaceMap.size,
    opdsInsertados: Math.max(0, opdMap.size - 1),
  });
}

export function alinearPorEje(modelo: Modelo, opdId: Id, ids: Id[], eje: EjeAlineacion): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const seleccion = aparienciasSeleccionadas(opd, ids);
  if (seleccion.length < 2) return ok(modelo);
  const objetivo = objetivoAlineacion(seleccion, eje);
  let siguiente = modelo;
  for (const apariencia of seleccion) {
    const pos = posicionAlineada(apariencia, eje, objetivo);
    const resultado = moverAparienciaPorId(siguiente, opdId, apariencia.id, pos);
    if (!resultado.ok) return resultado;
    siguiente = resultado.value;
  }
  return ok(siguiente);
}

export function distribuirUniformemente(
  modelo: Modelo,
  opdId: Id,
  ids: Id[],
  orientacion: OrientacionDistribucion,
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const seleccion = aparienciasSeleccionadas(opd, ids);
  if (seleccion.length < 3) return ok(modelo);
  const ordenadas = [...seleccion].sort((a, b) => orientacion === "horizontal" ? a.x - b.x : a.y - b.y);
  const primera = ordenadas[0];
  const ultima = ordenadas[ordenadas.length - 1];
  if (!primera || !ultima) return ok(modelo);
  let siguiente = modelo;

  if (orientacion === "horizontal") {
    const inicio = primera.x + primera.width / 2;
    const fin = ultima.x + ultima.width / 2;
    const paso = (fin - inicio) / (ordenadas.length - 1);
    for (const [index, apariencia] of ordenadas.entries()) {
      const centroX = inicio + paso * index;
      const resultado = moverAparienciaPorId(siguiente, opdId, apariencia.id, {
        x: Math.round(centroX - apariencia.width / 2),
        y: apariencia.y,
      });
      if (!resultado.ok) return resultado;
      siguiente = resultado.value;
    }
    return ok(siguiente);
  }

  const inicio = primera.y + primera.height / 2;
  const fin = ultima.y + ultima.height / 2;
  const paso = (fin - inicio) / (ordenadas.length - 1);
  for (const [index, apariencia] of ordenadas.entries()) {
    const centroY = inicio + paso * index;
    const resultado = moverAparienciaPorId(siguiente, opdId, apariencia.id, {
      x: apariencia.x,
      y: Math.round(centroY - apariencia.height / 2),
    });
    if (!resultado.ok) return resultado;
    siguiente = resultado.value;
  }
  return ok(siguiente);
}

export function redimensionarBatch(
  modelo: Modelo,
  opdId: Id,
  ids: Id[],
  delta: { dw: number; dh: number },
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const seleccion = aparienciasSeleccionadas(opd, ids);
  if (seleccion.length === 0) return ok(modelo);
  const apariencias = { ...opd.apariencias };
  for (const apariencia of seleccion) {
    apariencias[apariencia.id] = {
      ...apariencia,
      width: Math.max(RESIZE_MIN.width, Math.round(apariencia.width + delta.dw)),
      height: Math.max(RESIZE_MIN.height, Math.round(apariencia.height + delta.dh)),
    };
  }
  return ok({ ...modelo, opds: { ...modelo.opds, [opdId]: { ...opd, apariencias } } });
}

export function copiarSeleccion(modelo: Modelo, opdId: Id, ids: Id[]): UiPortapapelesVisual {
  const opd = modelo.opds[opdId];
  if (!opd || ids.length === 0) return { apariencias: [], enlaces: [], origenOpdId: opdId, pegados: 0 };
  const seleccion = new Set(ids);
  const apariencias = Object.values(opd.apariencias)
    .filter((apariencia) => seleccion.has(apariencia.entidadId) || seleccion.has(apariencia.id));
  const minX = Math.min(...apariencias.map((apariencia) => apariencia.x), 0);
  const minY = Math.min(...apariencias.map((apariencia) => apariencia.y), 0);
  const entidadIds = new Set(apariencias.map((apariencia) => apariencia.entidadId));
  const enlaces = Object.values(opd.enlaces)
    .filter((apariencia) => seleccion.has(apariencia.enlaceId) || seleccion.has(apariencia.id))
    .filter((apariencia) => {
      const enlace = modelo.enlaces[apariencia.enlaceId];
      if (!enlace) return false;
      return entidadIds.has(entidadIdDeExtremoLigero(modelo, enlace.origenId)) &&
        entidadIds.has(entidadIdDeExtremoLigero(modelo, enlace.destinoId));
    });
  return {
    apariencias: apariencias.map((apariencia) => ({
      entidadId: apariencia.entidadId,
      offsetX: apariencia.x - minX,
      offsetY: apariencia.y - minY,
      width: apariencia.width,
      height: apariencia.height,
      ...(apariencia.estilo ? { estilo: { ...apariencia.estilo } } : {}),
    })),
    enlaces: enlaces.map((apariencia) => ({ enlaceId: apariencia.enlaceId })),
    origenOpdId: opdId,
    pegados: 0,
  };
}

export function pegarSeleccion(
  modelo: Modelo,
  opdId: Id,
  buffer: UiPortapapelesVisual,
  offset: Posicion,
): Resultado<{ modelo: Modelo; seleccionados: Id[]; buffer: UiPortapapelesVisual }> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  let nextSeq = modelo.nextSeq;
  const apariencias: Record<Id, Apariencia> = { ...opd.apariencias };
  const entidadAApariencia = new Map<Id, Id>();
  const seleccionados: Id[] = [];
  const incremento = (buffer.pegados ?? 0) + 1;
  const dx = offset.x * incremento;
  const dy = offset.y * incremento;

  for (const item of buffer.apariencias) {
    if (!modelo.entidades[item.entidadId]) continue;
    const id = siguienteId(nextSeq, "a");
    nextSeq += 1;
    apariencias[id] = {
      id,
      entidadId: item.entidadId,
      opdId,
      x: item.offsetX + dx,
      y: item.offsetY + dy,
      width: item.width,
      height: item.height,
      ...(item.estilo ? { estilo: { ...item.estilo } } : {}),
    };
    entidadAApariencia.set(item.entidadId, id);
    seleccionados.push(item.entidadId);
  }

  const enlaces: Record<Id, AparienciaEnlace> = { ...opd.enlaces };
  for (const item of buffer.enlaces) {
    const enlace = modelo.enlaces[item.enlaceId];
    if (!enlace) continue;
    const origenId = entidadIdDeExtremoLigero(modelo, enlace.origenId);
    const destinoId = entidadIdDeExtremoLigero(modelo, enlace.destinoId);
    if (!entidadAApariencia.has(origenId) || !entidadAApariencia.has(destinoId)) continue;
    const id = siguienteId(nextSeq, "ae");
    nextSeq += 1;
    enlaces[id] = { id, enlaceId: enlace.id, opdId, vertices: [] };
    seleccionados.push(enlace.id);
  }

  return ok({
    modelo: {
      ...modelo,
      nextSeq,
      opds: {
        ...modelo.opds,
        [opdId]: { ...opd, apariencias, enlaces },
      },
    },
    seleccionados,
    buffer: { ...buffer, pegados: incremento },
  });
}

type DireccionAlineacion = "min" | "max";

function alinearEnlaces(modelo: Modelo, opdId: Id, ids: Id[], eje: "x" | "y", direccion: DireccionAlineacion): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const seleccion = Object.values(opd.enlaces).filter((apariencia) => ids.includes(apariencia.enlaceId) || ids.includes(apariencia.id));
  if (seleccion.length < 2) return ok(modelo);
  const referencias = seleccion.map((apariencia) => primerPuntoEnlace(modelo, opd, apariencia)?.[eje]).filter((v): v is number => typeof v === "number");
  if (referencias.length < 2) return ok(modelo);
  const objetivo = direccion === "min" ? Math.min(...referencias) : Math.max(...referencias);
  const enlaces = { ...opd.enlaces };
  for (const apariencia of seleccion) {
    const puntos = puntosEnlace(modelo, opd, apariencia);
    if (puntos.length < 2) continue;
    const medio = puntoMedio(puntos);
    const vertice = eje === "x" ? { x: objetivo, y: medio.y } : { x: medio.x, y: objetivo };
    enlaces[apariencia.id] = { ...apariencia, vertices: [vertice] };
  }
  return ok({ ...modelo, opds: { ...modelo.opds, [opdId]: { ...opd, enlaces } } });
}

function puntosEnlace(modelo: Modelo, opd: Opd, apariencia: AparienciaEnlace): Posicion[] {
  const enlace = modelo.enlaces[apariencia.enlaceId];
  if (!enlace) return [];
  const origen = aparienciaDeEntidad(opd, entidadIdDeExtremoLigero(modelo, enlace.origenId));
  const destino = aparienciaDeEntidad(opd, entidadIdDeExtremoLigero(modelo, enlace.destinoId));
  return [
    ...(origen ? [centro(origen)] : []),
    ...apariencia.vertices,
    ...(destino ? [centro(destino)] : []),
  ];
}

function primerPuntoEnlace(modelo: Modelo, opd: Opd, apariencia: AparienciaEnlace): Posicion | null {
  return puntosEnlace(modelo, opd, apariencia)[0] ?? null;
}

function puntoMedio(puntos: Posicion[]): Posicion {
  const xs = puntos.map((p) => p.x);
  const ys = puntos.map((p) => p.y);
  return { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 };
}

function entidadDesdeSeleccion(opd: Opd, id: Id): Id | null {
  if (Object.values(opd.apariencias).some((apariencia) => apariencia.entidadId === id)) return id;
  return opd.apariencias[id]?.entidadId ?? null;
}

function aparienciaDesdeIdOEntidad(opd: Opd, id: Id): Apariencia | undefined {
  return opd.apariencias[id] ?? Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === id);
}

function aparienciaDeEntidad(opd: Opd, entidadId: Id): Apariencia | undefined {
  return Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === entidadId);
}

function centro(apariencia: Apariencia): Posicion {
  return { x: apariencia.x + apariencia.width / 2, y: apariencia.y + apariencia.height / 2 };
}

function aparienciasSeleccionadas(opd: Opd, ids: Id[]): Apariencia[] {
  const seleccion = new Set(ids);
  return Object.values(opd.apariencias).filter((apariencia) => seleccion.has(apariencia.entidadId) || seleccion.has(apariencia.id));
}

function objetivoAlineacion(apariencias: Apariencia[], eje: EjeAlineacion): number {
  if (eje === "izq") return Math.min(...apariencias.map((apariencia) => apariencia.x));
  if (eje === "der") return Math.max(...apariencias.map((apariencia) => apariencia.x + apariencia.width));
  if (eje === "sup") return Math.min(...apariencias.map((apariencia) => apariencia.y));
  if (eje === "inf") return Math.max(...apariencias.map((apariencia) => apariencia.y + apariencia.height));
  if (eje === "centro") {
    const min = Math.min(...apariencias.map((apariencia) => apariencia.x));
    const max = Math.max(...apariencias.map((apariencia) => apariencia.x + apariencia.width));
    return (min + max) / 2;
  }
  const min = Math.min(...apariencias.map((apariencia) => apariencia.y));
  const max = Math.max(...apariencias.map((apariencia) => apariencia.y + apariencia.height));
  return (min + max) / 2;
}

function posicionAlineada(apariencia: Apariencia, eje: EjeAlineacion, objetivo: number): Posicion {
  if (eje === "izq") return { x: objetivo, y: apariencia.y };
  if (eje === "der") return { x: objetivo - apariencia.width, y: apariencia.y };
  if (eje === "sup") return { x: apariencia.x, y: objetivo };
  if (eje === "inf") return { x: apariencia.x, y: objetivo - apariencia.height };
  if (eje === "centro") return { x: Math.round(objetivo - apariencia.width / 2), y: apariencia.y };
  return { x: apariencia.x, y: Math.round(objetivo - apariencia.height / 2) };
}

function purgarHuerfanos(modelo: Modelo): Modelo {
  const entidadesVisibles = new Set(Object.values(modelo.opds).flatMap((opd) => Object.values(opd.apariencias).map((ap) => ap.entidadId)));
  const enlacesVisibles = new Set(Object.values(modelo.opds).flatMap((opd) => Object.values(opd.enlaces).map((ap) => ap.enlaceId)));
  const entidades = Object.fromEntries(Object.entries(modelo.entidades).filter(([id]) => entidadesVisibles.has(id)));
  const estados = Object.fromEntries(Object.entries(modelo.estados).filter(([, estado]) => entidadesVisibles.has(estado.entidadId)));
  const enlaces = Object.fromEntries(Object.entries(modelo.enlaces).filter(([id, enlace]) => (
    enlacesVisibles.has(id) &&
    entidadesVisibles.has(entidadIdDeExtremoLigero(modelo, enlace.origenId)) &&
    entidadesVisibles.has(entidadIdDeExtremoLigero(modelo, enlace.destinoId))
  )));
  const opds = Object.fromEntries(Object.entries(modelo.opds).map(([opdId, opd]) => [
    opdId,
    {
      ...opd,
      enlaces: Object.fromEntries(Object.entries(opd.enlaces).filter(([, apariencia]) => enlaces[apariencia.enlaceId])),
    },
  ]));
  return { ...modelo, entidades, estados, enlaces, opds };
}

function subarbolOpds(modelo: Modelo, raizId: Id, profundidadMaxima: number): Opd[] {
  const raiz = modelo.opds[raizId];
  if (!raiz) return [];
  const salida: Opd[] = [];
  const visitar = (opd: Opd, profundidad: number) => {
    salida.push(opd);
    if (profundidad >= profundidadMaxima) return;
    const hijos = Object.values(modelo.opds)
      .filter((hijo) => hijo.padreId === opd.id)
      .sort((a, b) => (a.ordenLocal ?? 0) - (b.ordenLocal ?? 0) || a.id.localeCompare(b.id, "es-CL"));
    for (const hijo of hijos) visitar(hijo, profundidad + 1);
  };
  visitar(raiz, 0);
  return salida;
}

function entidadesEnOpds(modelo: Modelo, opds: Opd[]): Entidad[] {
  const ids = new Set<Id>();
  for (const opd of opds) {
    for (const apariencia of Object.values(opd.apariencias)) ids.add(apariencia.entidadId);
  }
  return [...ids]
    .map((id) => modelo.entidades[id])
    .filter((entidad): entidad is Entidad => !!entidad);
}

function idsModelo(modelo: Modelo): Set<Id> {
  const ids = new Set<Id>([
    modelo.id,
    ...Object.keys(modelo.entidades),
    ...Object.keys(modelo.estados),
    ...Object.keys(modelo.enlaces),
    ...Object.keys(modelo.opds),
  ]);
  for (const opd of Object.values(modelo.opds)) {
    for (const id of Object.keys(opd.apariencias)) ids.add(id);
    for (const id of Object.keys(opd.enlaces)) ids.add(id);
  }
  return ids;
}

function nombreSinColision(nombreBase: string, nombresTomados: Set<string>): string {
  const base = nombreBase.trim() || "Cosa";
  if (!nombresTomados.has(base.toLocaleLowerCase("es-CL"))) return base;
  for (let i = 2; i < 1000; i += 1) {
    const candidato = `${base}_${i}`;
    if (!nombresTomados.has(candidato.toLocaleLowerCase("es-CL"))) return candidato;
  }
  return `${base}_${Date.now().toString(36)}`;
}

function remapExtremo(
  extremo: { kind: "entidad" | "estado"; id: Id },
  entidadMap: Map<Id, Id>,
  estadoMap: Map<Id, Id>,
): { kind: "entidad" | "estado"; id: Id } | null {
  if (extremo.kind === "entidad") {
    const id = entidadMap.get(extremo.id);
    return id ? { kind: "entidad", id } : null;
  }
  const id = estadoMap.get(extremo.id);
  return id ? { kind: "estado", id } : null;
}

function remapParteExtraida(
  extraida: { padreAparienciaId: Id; parteEntidadId: Id },
  aparienciaMap: Map<Id, Id>,
  entidadMap: Map<Id, Id>,
): { padreAparienciaId: Id; parteEntidadId: Id } | undefined {
  const padreAparienciaId = aparienciaMap.get(extraida.padreAparienciaId);
  const parteEntidadId = entidadMap.get(extraida.parteEntidadId);
  return padreAparienciaId && parteEntidadId ? { padreAparienciaId, parteEntidadId } : undefined;
}

function entidadIdDeExtremoLigero(modelo: Modelo, extremo: { kind: "entidad" | "estado"; id: Id }): Id {
  return extremo.kind === "entidad" ? extremo.id : modelo.estados[extremo.id]?.entidadId ?? extremo.id;
}

function siguienteId(nextSeq: number, prefijo: string): Id {
  return `${prefijo}-${nextSeq}`;
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
