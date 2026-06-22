import type {
  Apariencia,
  AparienciaEnlace,
  AparienciaPlantilla,
  Enlace,
  Entidad,
  Estado,
  Estereotipo,
  ExtremoEnlace,
  Id,
  Modelo,
  PlantillaEstereotipo,
  Posicion,
  Resultado,
} from "../tipos";
import { estereotipoDe } from "../estereotipos";
import { fallo, ok, siguienteId } from "./helpers";

/**
 * Motor de clonado-e-injerto de subgrafo de estereotipo (D6.2).
 *
 * Espeja la dualidad OpCloud `cloneStereotypeToOpd` (clonar el subgrafo de la
 * plantilla con remapeo total de ids) + `replaceClonedStereotypeToActualThing`
 * (injerto sobre el ancla, que recibe el `estereotipoId`). Mismo patrón que
 * `materializarSnapshotSubmodelo` (remapeo entidad/estado/enlace), más simple:
 * sin contrato de submodelo, sin abanicos, sin refinamientos (la plantilla es
 * plana por diseño). A diferencia de `pegarSeleccion` (apariciones de las MISMAS
 * entidades), el injerto CLONA identidad: produce cosas FRESCAS e independientes.
 *
 * Puro: sin JointJS, sin DOM, sin Zustand. El modelo resultante pasa
 * `validarModelo` + `validarReferenciasOpd` (incl. el contrato duro de
 * `estereotipoId` de D6.1) — defendido por round-trip en los tests.
 */

export interface InjertoResultado {
  modelo: Modelo;
  entidadesCreadas: Id[];
  anclaId?: Id;
}

const CAJA_DEFAULT: AparienciaPlantilla = { x: 0, y: 0, width: 120, height: 60 };

function prefijoEntidad(entidad: Entidad): "o" | "p" {
  return entidad.tipo === "objeto" ? "o" : "p";
}

function clonar<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Id LOCAL del ancla de la plantilla: `anclaLocalId` o la primera entidad. */
function anclaLocalDe(plantilla: PlantillaEstereotipo): Id | undefined {
  return plantilla.anclaLocalId ?? Object.keys(plantilla.entidades)[0];
}

export function injertarEstereotipo(
  modelo: Modelo,
  estereotipoId: Id,
  opdId: Id,
  posicion: Posicion,
): Resultado<InjertoResultado> {
  const estereotipo = estereotipoDe(modelo, estereotipoId);
  if (!estereotipo) return fallo(`Estereotipo no existe: ${estereotipoId}`);
  const plantilla = estereotipo.plantilla;
  if (!plantilla) return fallo(`Estereotipo sin plantilla injertable: ${estereotipoId}`);
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);

  let siguiente = { ...modelo, nextSeq: modelo.nextSeq };
  const proximo = (prefijo: string): Id => {
    const id = siguienteId(siguiente, prefijo);
    siguiente = { ...siguiente, nextSeq: siguiente.nextSeq + 1 };
    return id;
  };

  const anclaLocalId = anclaLocalDe(plantilla);

  // 1. Remapeo LOCAL→FRESCO de entidades (deep clone; sin refinamientos — plantilla plana).
  const entidadMap = new Map<Id, Id>();
  const entidades: Record<Id, Entidad> = {};
  for (const local of Object.values(plantilla.entidades)) {
    const id = proximo(prefijoEntidad(local));
    entidadMap.set(local.id, id);
    const { refinamientos: _refinamientos, estereotipoId: _estereotipoId, ...resto } = clonar(local);
    const esAncla = local.id === anclaLocalId;
    entidades[id] = { ...resto, id, ...(esAncla ? { estereotipoId } : {}) };
  }

  // 2. Estados: id nuevo, entidadId remapeado.
  const estadoMap = new Map<Id, Id>();
  const estados: Record<Id, Estado> = {};
  for (const local of Object.values(plantilla.estados)) {
    const entidadId = entidadMap.get(local.entidadId);
    if (!entidadId) continue;
    const id = proximo("s");
    estadoMap.set(local.id, id);
    estados[id] = { ...clonar(local), id, entidadId };
  }

  // 3. Enlaces: id nuevo, extremos remapeados; sin derivado/efectoEscindido/grupoEstructuralId.
  const enlaces: Record<Id, Enlace> = {};
  const enlacesClonados: Enlace[] = [];
  for (const local of Object.values(plantilla.enlaces)) {
    const origen = remapExtremo(local.origenId, entidadMap, estadoMap);
    const destino = remapExtremo(local.destinoId, entidadMap, estadoMap);
    if (!origen || !destino) continue;
    const id = proximo("e");
    const enlace = remapEnlace(clonar(local), id, origen, destino, estadoMap);
    enlaces[id] = enlace;
    enlacesClonados.push(enlace);
  }

  // 4. Apariencias en el OPD por cada entidad clonada (offset por la posición de injerto).
  const apariencias: Record<Id, Apariencia> = { ...opd.apariencias };
  for (const [localId, freshId] of entidadMap) {
    const layout = plantilla.apariencias[localId] ?? CAJA_DEFAULT;
    const aparienciaId = proximo("a");
    apariencias[aparienciaId] = {
      id: aparienciaId,
      entidadId: freshId,
      opdId,
      x: posicion.x + layout.x,
      y: posicion.y + layout.y,
      width: layout.width,
      height: layout.height,
    };
  }

  // 5. Apariciones de enlace cuyos dos extremos tienen apariencia en el OPD.
  const visibles = new Set(Object.values(apariencias).filter((a) => a.opdId === opdId).map((a) => a.entidadId));
  const enlacesAparicion: Record<Id, AparienciaEnlace> = { ...opd.enlaces };
  for (const enlace of enlacesClonados) {
    const origen = entidadIdDeExtremo(enlace.origenId, estadoMap, estados);
    const destino = entidadIdDeExtremo(enlace.destinoId, estadoMap, estados);
    if (!origen || !destino || !visibles.has(origen) || !visibles.has(destino)) continue;
    const aeId = proximo("ae");
    enlacesAparicion[aeId] = { id: aeId, enlaceId: enlace.id, opdId, vertices: [] };
  }

  const anclaId = anclaLocalId ? entidadMap.get(anclaLocalId) : undefined;
  const modeloResultante: Modelo = {
    ...siguiente,
    entidades: { ...siguiente.entidades, ...entidades },
    estados: { ...siguiente.estados, ...estados },
    enlaces: { ...siguiente.enlaces, ...enlaces },
    opds: { ...siguiente.opds, [opdId]: { ...opd, apariencias, enlaces: enlacesAparicion } },
  };

  return ok({
    modelo: modeloResultante,
    entidadesCreadas: [...entidadMap.values()],
    ...(anclaId ? { anclaId } : {}),
  });
}

/**
 * Captura una plantilla de subgrafo desde una selección (inverso del injerto;
 * primitivo de autoría para D6.4). Toma las cosas seleccionadas (por entidadId o
 * aparienciaId, como `copiarSeleccion`) + sus estados + los enlaces cuyos DOS
 * extremos están en la selección. Copia a ids LOCALES estables (`o-1/p-1/s-1/e-1`)
 * con layout relativo normalizado a (0,0). Rechaza (fallo) si la selección está
 * vacía o incluye refinamientos/abanicos/enlaces derivados (fuera de alcance D6).
 */
export function capturarPlantilla(
  modelo: Modelo,
  opdId: Id,
  ids: Id[],
  anclaId?: Id,
): Resultado<PlantillaEstereotipo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  if (ids.length === 0) return fallo("La captura de plantilla requiere una selección no vacía");

  const seleccion = new Set(ids);
  const aparienciasSel = Object.values(opd.apariencias).filter(
    (a) => seleccion.has(a.entidadId) || seleccion.has(a.id),
  );
  if (aparienciasSel.length === 0) return fallo("La selección no contiene cosas visibles en el OPD");

  const entidadIds = new Set(aparienciasSel.map((a) => a.entidadId));

  // Fuera de alcance D6: refinamientos / abanicos / enlaces derivados.
  for (const entidadId of entidadIds) {
    const entidad = modelo.entidades[entidadId];
    if (entidad?.refinamientos && Object.keys(entidad.refinamientos).length > 0) {
      return fallo("Fuera de alcance D6: la selección incluye una cosa con refinamiento (in-zoom/unfold)");
    }
  }
  const abanicosOpd = Object.values(modelo.abanicos ?? {}).filter((ab) => ab.opdId === opdId);
  for (const abanico of abanicosOpd) {
    if (abanico.enlaceIds.some((eid) => entidadesDeEnlaceEn(modelo, eid, entidadIds))) {
      return fallo("Fuera de alcance D6: la selección incluye un abanico lógico");
    }
  }

  // Enlaces con AMBOS extremos en la selección.
  const enlacesSel = Object.values(opd.enlaces)
    .map((ae) => modelo.enlaces[ae.enlaceId])
    .filter((e): e is Enlace => !!e)
    .filter((e) => entidadIds.has(entidadIdDeExtremoModelo(modelo, e.origenId)) && entidadIds.has(entidadIdDeExtremoModelo(modelo, e.destinoId)));
  // Dedup por id (un enlace puede aparecer varias veces como aparición).
  const enlacesUnicos = new Map<Id, Enlace>();
  for (const e of enlacesSel) enlacesUnicos.set(e.id, e);
  for (const enlace of enlacesUnicos.values()) {
    if (enlace.derivado || enlace.efectoEscindido) {
      return fallo("Fuera de alcance D6: la selección incluye un enlace derivado de refinamiento");
    }
  }

  // Remapeo a ids LOCALES estables por orden de aparición.
  const entidadLocal = new Map<Id, Id>();
  const estadoLocal = new Map<Id, Id>();
  let oSeq = 0;
  let pSeq = 0;
  let sSeq = 0;
  let eSeq = 0;
  const entidadesPlantilla: Record<Id, Entidad> = {};
  // Layout relativo normalizado a (0,0).
  const minX = Math.min(...aparienciasSel.map((a) => a.x));
  const minY = Math.min(...aparienciasSel.map((a) => a.y));
  const aparienciasPlantilla: Record<Id, AparienciaPlantilla> = {};

  const aparienciaPorEntidad = new Map<Id, (typeof aparienciasSel)[number]>();
  for (const a of aparienciasSel) if (!aparienciaPorEntidad.has(a.entidadId)) aparienciaPorEntidad.set(a.entidadId, a);

  for (const a of aparienciasSel) {
    if (entidadLocal.has(a.entidadId)) continue;
    const entidad = modelo.entidades[a.entidadId];
    if (!entidad) continue;
    const localId = entidad.tipo === "objeto" ? `o-${++oSeq}` : `p-${++pSeq}`;
    entidadLocal.set(entidad.id, localId);
    const { refinamientos: _refinamientos, estereotipoId: _estereotipoId, requisito: _requisito, ...resto } = clonar(entidad);
    entidadesPlantilla[localId] = { ...resto, id: localId };
    aparienciasPlantilla[localId] = { x: a.x - minX, y: a.y - minY, width: a.width, height: a.height };
  }

  const estadosPlantilla: Record<Id, Estado> = {};
  for (const estado of Object.values(modelo.estados)) {
    const entidadLocalId = entidadLocal.get(estado.entidadId);
    if (!entidadLocalId) continue;
    const localId = `s-${++sSeq}`;
    estadoLocal.set(estado.id, localId);
    estadosPlantilla[localId] = { ...clonar(estado), id: localId, entidadId: entidadLocalId };
  }

  const enlacesPlantilla: Record<Id, Enlace> = {};
  for (const enlace of enlacesUnicos.values()) {
    const origen = remapExtremoLocal(enlace.origenId, entidadLocal, estadoLocal);
    const destino = remapExtremoLocal(enlace.destinoId, entidadLocal, estadoLocal);
    if (!origen || !destino) continue;
    const localId = `e-${++eSeq}`;
    enlacesPlantilla[localId] = remapEnlace(clonar(enlace), localId, origen, destino, estadoLocal);
  }

  const anclaLocalId = anclaId ? entidadLocal.get(anclaId) : Object.keys(entidadesPlantilla)[0];
  return ok({
    entidades: entidadesPlantilla,
    estados: estadosPlantilla,
    enlaces: enlacesPlantilla,
    apariencias: aparienciasPlantilla,
    ...(anclaLocalId ? { anclaLocalId } : {}),
  });
}

export function crearEstereotipoDesdeSeleccion(
  modelo: Modelo,
  opdId: Id,
  ids: Id[],
  nombre: string,
  opts?: { propositoDeModelado?: string; anclaId?: Id },
): Resultado<{ modelo: Modelo; estereotipoId: Id }> {
  const nombreLimpio = nombre.trim();
  if (!nombreLimpio) return fallo("El estereotipo requiere nombre");
  const plantilla = capturarPlantilla(modelo, opdId, ids, opts?.anclaId);
  if (!plantilla.ok) return plantilla;

  const estereotipoId = siguienteId(modelo, "est");
  const proposito = opts?.propositoDeModelado?.trim();
  const estereotipo: Estereotipo = {
    id: estereotipoId,
    nombre: nombreLimpio,
    plantilla: plantilla.value,
    ...(proposito ? { propositoDeModelado: proposito } : {}),
  };
  return ok({
    modelo: {
      ...modelo,
      nextSeq: modelo.nextSeq + 1,
      estereotipos: { ...(modelo.estereotipos ?? {}), [estereotipoId]: estereotipo },
    },
    estereotipoId,
  });
}

function remapExtremo(extremo: ExtremoEnlace, entidadMap: Map<Id, Id>, estadoMap: Map<Id, Id>): ExtremoEnlace | null {
  const id = extremo.kind === "estado" ? estadoMap.get(extremo.id) : entidadMap.get(extremo.id);
  if (!id) return null;
  return { kind: extremo.kind, id };
}

function remapExtremoLocal(extremo: ExtremoEnlace, entidadLocal: Map<Id, Id>, estadoLocal: Map<Id, Id>): ExtremoEnlace | null {
  const id = extremo.kind === "estado" ? estadoLocal.get(extremo.id) : entidadLocal.get(extremo.id);
  if (!id) return null;
  return { kind: extremo.kind, id };
}

/** Clona un enlace plano: descarta portId, derivado, efectoEscindido, grupoEstructuralId; remapea estados de entrada/salida. */
function remapEnlace(
  enlace: Enlace,
  id: Id,
  origenId: ExtremoEnlace,
  destinoId: ExtremoEnlace,
  estadoMap: Map<Id, Id>,
): Enlace {
  const {
    derivado: _derivado,
    efectoEscindido: _efectoEscindido,
    grupoEstructuralId: _grupoEstructuralId,
    estadoEntradaId: _estadoEntradaId,
    estadoSalidaId: _estadoSalidaId,
    ...base
  } = enlace;
  return {
    ...base,
    id,
    origenId,
    destinoId,
    ...(enlace.estadoEntradaId && estadoMap.get(enlace.estadoEntradaId) ? { estadoEntradaId: estadoMap.get(enlace.estadoEntradaId)! } : {}),
    ...(enlace.estadoSalidaId && estadoMap.get(enlace.estadoSalidaId) ? { estadoSalidaId: estadoMap.get(enlace.estadoSalidaId)! } : {}),
  };
}

function entidadIdDeExtremo(extremo: ExtremoEnlace, estadoMap: Map<Id, Id>, estados: Record<Id, Estado>): Id | undefined {
  if (extremo.kind === "entidad") return extremo.id;
  return estados[extremo.id]?.entidadId;
}

function entidadIdDeExtremoModelo(modelo: Modelo, extremo: ExtremoEnlace): Id {
  return extremo.kind === "entidad" ? extremo.id : modelo.estados[extremo.id]?.entidadId ?? extremo.id;
}

function entidadesDeEnlaceEn(modelo: Modelo, enlaceId: Id, entidadIds: Set<Id>): boolean {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return false;
  return entidadIds.has(entidadIdDeExtremoModelo(modelo, enlace.origenId)) || entidadIds.has(entidadIdDeExtremoModelo(modelo, enlace.destinoId));
}
