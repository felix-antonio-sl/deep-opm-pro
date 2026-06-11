import { entidadIdDeExtremo, extremoEntidad } from "../modelo/extremos";
import { CANON } from "../modelo/constantes";
import { crearEnlace, eliminarEnlace, eliminarEntidad, moverAparienciaPorId } from "../modelo/operaciones";
import { posicionLibre } from "../modelo/layout";
import { eliminarEnlacesBatch as eliminarEnlacesBatchModelo } from "../modelo/operaciones/enlaces";
import type {
  Apariencia,
  AparienciaEnlace,
  Id,
  Modelo,
  Opd,
  Posicion,
  Resultado,
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

/**
 * Trae una entidad EXISTENTE del modelo al OPD destino creando su apariencia
 * (y las apariciones de enlaces cuyos dos extremos quedan visibles). Es el
 * mecanismo para que una cosa nacida dentro de un refinamiento (p.ej. objeto
 * interno de un in-zoom) aparezca también en otro diagrama — una Thing puede
 * aparecer en múltiples OPDs; la apariencia es contexto visual, no hecho nuevo.
 * Idempotente: si ya aparece en el OPD, no cambia nada.
 */
export function traerEntidadAlOpd(modelo: Modelo, opdId: Id, entidadId: Id, posicion?: Posicion): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`La entidad no existe: ${entidadId}`);
  const existente = Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === entidadId);
  if (existente) return ok(modelo);

  let nextSeq = modelo.nextSeq;
  const id = siguienteId(nextSeq, "a");
  nextSeq += 1;
  const destino = posicion ?? posicionLibre(modelo, opdId, entidad.tipo);
  const apariencia: Apariencia = {
    id,
    entidadId,
    opdId,
    x: destino.x,
    y: destino.y,
    width: CANON.dims.cosaWidth,
    height: CANON.dims.cosaHeight,
  };
  const apariencias: Record<Id, Apariencia> = { ...opd.apariencias, [id]: apariencia };

  // Apariciones de enlaces que quedan con ambos extremos visibles al traerla.
  const visibles = new Set([...Object.values(apariencias).map((a) => a.entidadId)]);
  const enlaces: Record<Id, AparienciaEnlace> = { ...opd.enlaces };
  for (const enlace of Object.values(modelo.enlaces)) {
    if (Object.values(enlaces).some((aparicion) => aparicion.enlaceId === enlace.id)) continue;
    const origen = entidadIdDeExtremo(modelo, enlace.origenId);
    const destinoEnlace = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (origen !== entidadId && destinoEnlace !== entidadId) continue;
    if (!origen || !destinoEnlace || !visibles.has(origen) || !visibles.has(destinoEnlace)) continue;
    const aeId = siguienteId(nextSeq, "ae");
    nextSeq += 1;
    enlaces[aeId] = { id: aeId, enlaceId: enlace.id, opdId, vertices: [] };
  }

  return ok({ ...modelo, nextSeq, opds: { ...modelo.opds, [opdId]: { ...opd, apariencias, enlaces } } });
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

export function eliminarEnlacesBatch(modelo: Modelo, enlaceIds: Id[]): Resultado<Modelo> {
  return eliminarEnlacesBatchModelo(modelo, enlaceIds);
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
