import type {
  Abanico,
  Apariencia,
  AparienciaEnlace,
  ContextoRefinamientoApariencia,
  DecisionPolicy,
  DerivacionEnlace,
  EfectoEscindido,
  Enlace,
  Entidad,
  Estado,
  EstadoCargaSubmodelo,
  ExtremoEnlace,
  Id,
  Modelo,
  Opd,
  SubmodeloMaterializacion,
  SubmodeloReferencia,
} from "../tipos";
import { firmaSnapshotSubmodelo } from "./estado";

export interface SnapshotSubmodelo {
  opd: Opd;
  entidades: Record<Id, Entidad>;
  estados: Record<Id, Estado>;
  enlaces: Record<Id, Enlace>;
  abanicos: Record<Id, Abanico>;
  materializacion: SubmodeloMaterializacion;
}

export function materializarSnapshotSubmodelo(
  snapshot: Modelo,
  opdVistaId: Id,
  refId: Id,
  nombre: string,
  padreId: Id,
): SnapshotSubmodelo {
  const root = snapshot.opds[snapshot.opdRaizId];
  const sourceHash = firmaSnapshotSubmodelo(snapshot);
  if (!root) {
    return {
      opd: opdSubmodeloVacio(opdVistaId, refId, nombre, padreId, "cargado-sincronizado"),
      entidades: {},
      estados: {},
      enlaces: {},
      abanicos: {},
      materializacion: {
        opdVistaId,
        scope: "sd-root",
        entidadMap: {},
        estadoMap: {},
        enlaceMap: {},
        abanicoMap: {},
        sourceHash,
      },
    };
  }

  const entidadMap = new Map<Id, Id>();
  const estadoMap = new Map<Id, Id>();
  const enlaceMap = new Map<Id, Id>();
  const abanicoMap = new Map<Id, Id>();
  const aparienciaMap = new Map<Id, Id>();

  const entidades: Record<Id, Entidad> = {};
  for (const apariencia of Object.values(root.apariencias)) {
    const entidad = snapshot.entidades[apariencia.entidadId];
    if (!entidad) continue;
    const id = idSnapshot(refId, prefijoEntidad(entidad), entidad.id);
    entidadMap.set(entidad.id, id);
    const { refinamientos: _refinamientos, ...resto } = clonar(entidad);
    entidades[id] = { ...resto, id };
  }

  const estados: Record<Id, Estado> = {};
  for (const estado of Object.values(snapshot.estados ?? {})) {
    const entidadId = entidadMap.get(estado.entidadId);
    if (!entidadId) continue;
    const id = idSnapshot(refId, "s", estado.id);
    estadoMap.set(estado.id, id);
    estados[id] = { ...clonar(estado), id, entidadId };
  }

  const enlaces: Record<Id, Enlace> = {};
  for (const apariencia of Object.values(root.enlaces)) {
    const enlace = snapshot.enlaces[apariencia.enlaceId];
    if (!enlace) continue;
    const origen = remapExtremo(enlace.origenId, entidadMap, estadoMap);
    const destino = remapExtremo(enlace.destinoId, entidadMap, estadoMap);
    if (!origen || !destino) continue;
    const id = idSnapshot(refId, "e", enlace.id);
    enlaceMap.set(enlace.id, id);
    enlaces[id] = remapEnlace(clonar(enlace), id, origen, destino, refId, estadoMap, enlaceMap);
  }

  const apariencias: Record<Id, Apariencia> = {};
  for (const apariencia of Object.values(root.apariencias)) {
    const entidadId = entidadMap.get(apariencia.entidadId);
    if (!entidadId) continue;
    const id = idSnapshot(refId, "a", apariencia.id);
    aparienciaMap.set(apariencia.id, id);
    apariencias[id] = remapApariencia(clonar(apariencia), id, opdVistaId, entidadId, entidadMap, estadoMap, aparienciaMap);
  }

  const aparienciasEnlace: Record<Id, AparienciaEnlace> = {};
  for (const apariencia of Object.values(root.enlaces)) {
    const enlaceId = enlaceMap.get(apariencia.enlaceId);
    if (!enlaceId) continue;
    const id = idSnapshot(refId, "ae", apariencia.id);
    aparienciasEnlace[id] = { ...clonar(apariencia), id, enlaceId, opdId: opdVistaId };
  }

  const abanicos: Record<Id, Abanico> = {};
  for (const abanico of Object.values(snapshot.abanicos ?? {})) {
    if (abanico.opdId !== root.id) continue;
    const linkIds = abanico.enlaceIds.map((id) => enlaceMap.get(id)).filter((id): id is Id => !!id);
    if (linkIds.length !== abanico.enlaceIds.length || linkIds.length < 2) continue;
    const entidadId = entidadMap.get(abanico.puertoComun.entidadId);
    if (!entidadId) continue;
    const id = idSnapshot(refId, "ab", abanico.id);
    abanicoMap.set(abanico.id, id);
    abanicos[id] = {
      ...clonar(abanico),
      id,
      opdId: opdVistaId,
      puertoComun: { ...abanico.puertoComun, entidadId },
      puertoEntidadId: entidadId,
      enlaceIds: linkIds,
      ...(abanico.decision ? { decision: remapDecision(abanico.decision, entidadMap, estadoMap, enlaceMap) } : {}),
    };
  }

  return {
    opd: {
      id: opdVistaId,
      nombre,
      padreId,
      apariencias,
      enlaces: aparienciasEnlace,
      vista: { kind: "submodel-view", submodeloRefId: refId, readOnly: true, syncState: "cargado-sincronizado" },
    },
    entidades,
    estados,
    enlaces,
    abanicos,
    materializacion: {
      opdVistaId,
      scope: "sd-root",
      entidadMap: Object.fromEntries(entidadMap),
      estadoMap: Object.fromEntries(estadoMap),
      enlaceMap: Object.fromEntries(enlaceMap),
      abanicoMap: Object.fromEntries(abanicoMap),
      sourceHash,
    },
  };
}

export function opdSubmodeloVacio(
  opdVistaId: Id,
  refId: Id,
  nombre: string,
  padreId: Id,
  syncState: EstadoCargaSubmodelo,
): Opd {
  return {
    id: opdVistaId,
    nombre,
    padreId,
    apariencias: {},
    enlaces: {},
    vista: { kind: "submodel-view", submodeloRefId: refId, readOnly: true, syncState },
  };
}

export function materializacionEfectivaSubmodelo(modelo: Modelo, ref: SubmodeloReferencia): SubmodeloMaterializacion | undefined {
  if (ref.materializacion) return ref.materializacion;
  const opdVistaId = ref.opdVistaId;
  if (!opdVistaId) return undefined;
  const opd = modelo.opds[opdVistaId];
  if (!opd) return undefined;
  const entidadMap: Record<Id, Id> = {};
  const estadoMap: Record<Id, Id> = {};
  const enlaceMap: Record<Id, Id> = {};
  const abanicoMap: Record<Id, Id> = {};

  for (const apariencia of Object.values(opd.apariencias)) {
    const sourceId = sourceIdMaterializado(ref.id, apariencia.entidadId, ["o", "p"]);
    if (sourceId) entidadMap[sourceId] = apariencia.entidadId;
  }
  const entidadesMaterializadas = new Set(Object.values(entidadMap));
  for (const estado of Object.values(modelo.estados ?? {})) {
    if (!entidadesMaterializadas.has(estado.entidadId)) continue;
    const sourceId = sourceIdMaterializado(ref.id, estado.id, ["s"]);
    if (sourceId) estadoMap[sourceId] = estado.id;
  }
  for (const apariencia of Object.values(opd.enlaces)) {
    const sourceId = sourceIdMaterializado(ref.id, apariencia.enlaceId, ["e"]);
    if (sourceId) enlaceMap[sourceId] = apariencia.enlaceId;
  }
  for (const abanico of Object.values(modelo.abanicos ?? {})) {
    if (abanico.opdId !== opdVistaId) continue;
    const sourceId = sourceIdMaterializado(ref.id, abanico.id, ["ab"]);
    if (sourceId) abanicoMap[sourceId] = abanico.id;
  }
  if (
    Object.keys(entidadMap).length === 0 &&
    Object.keys(estadoMap).length === 0 &&
    Object.keys(enlaceMap).length === 0 &&
    Object.keys(abanicoMap).length === 0
  ) {
    return undefined;
  }
  return { opdVistaId, scope: "sd-root", entidadMap, estadoMap, enlaceMap, abanicoMap };
}

function remapApariencia(
  apariencia: Apariencia,
  id: Id,
  opdId: Id,
  entidadId: Id,
  entidadMap: Map<Id, Id>,
  estadoMap: Map<Id, Id>,
  aparienciaMap: Map<Id, Id>,
): Apariencia {
  const {
    parteExtraidaDe: _parteExtraidaDe,
    contextoRefinamiento: _contextoRefinamiento,
    estadosSuprimidos: _estadosSuprimidos,
    ...base
  } = apariencia;
  const parteExtraidaDe = apariencia.parteExtraidaDe
    ? {
        padreAparienciaId: aparienciaMap.get(apariencia.parteExtraidaDe.padreAparienciaId) ?? apariencia.parteExtraidaDe.padreAparienciaId,
        parteEntidadId: entidadMap.get(apariencia.parteExtraidaDe.parteEntidadId) ?? apariencia.parteExtraidaDe.parteEntidadId,
      }
    : undefined;
  const contextoRefinamiento = apariencia.contextoRefinamiento
    ? remapContextoRefinamiento(apariencia.contextoRefinamiento, entidadMap, aparienciaMap)
    : undefined;
  return {
    ...base,
    id,
    opdId,
    entidadId,
    ...(parteExtraidaDe ? { parteExtraidaDe } : {}),
    ...(contextoRefinamiento ? { contextoRefinamiento } : {}),
    ...(apariencia.estadosSuprimidos ? { estadosSuprimidos: apariencia.estadosSuprimidos.map((estadoId) => estadoMap.get(estadoId) ?? estadoId) } : {}),
  };
}

function remapContextoRefinamiento(
  contexto: ContextoRefinamientoApariencia,
  entidadMap: Map<Id, Id>,
  aparienciaMap: Map<Id, Id>,
): ContextoRefinamientoApariencia {
  return {
    ...contexto,
    refinableEntidadId: entidadMap.get(contexto.refinableEntidadId) ?? contexto.refinableEntidadId,
    ...(contexto.contenedorAparienciaId ? { contenedorAparienciaId: aparienciaMap.get(contexto.contenedorAparienciaId) ?? contexto.contenedorAparienciaId } : {}),
  };
}

function remapEnlace(
  enlace: Enlace,
  id: Id,
  origenId: ExtremoEnlace,
  destinoId: ExtremoEnlace,
  refId: Id,
  estadoMap: Map<Id, Id>,
  enlaceMap: Map<Id, Id>,
): Enlace {
  const {
    derivado: _derivado,
    efectoEscindido: _efectoEscindido,
    estadoEntradaId: _estadoEntradaId,
    estadoSalidaId: _estadoSalidaId,
    ...base
  } = enlace;
  const derivado = remapDerivacion(enlace.derivado, enlaceMap);
  const efectoEscindido = remapEfectoEscindido(enlace.efectoEscindido, refId, enlaceMap);
  return {
    ...base,
    id,
    origenId,
    destinoId,
    ...(enlace.grupoEstructuralId ? { grupoEstructuralId: idSnapshot(refId, "ge", enlace.grupoEstructuralId) } : {}),
    ...(enlace.estadoEntradaId ? { estadoEntradaId: estadoMap.get(enlace.estadoEntradaId) ?? enlace.estadoEntradaId } : {}),
    ...(enlace.estadoSalidaId ? { estadoSalidaId: estadoMap.get(enlace.estadoSalidaId) ?? enlace.estadoSalidaId } : {}),
    ...(derivado ? { derivado } : {}),
    ...(efectoEscindido ? { efectoEscindido } : {}),
  };
}

function remapDerivacion(derivado: DerivacionEnlace | undefined, enlaceMap: Map<Id, Id>): DerivacionEnlace | undefined {
  if (!derivado) return undefined;
  const enlacePadreId = enlaceMap.get(derivado.enlacePadreId);
  if (!enlacePadreId) return undefined;
  return { ...derivado, enlacePadreId };
}

function remapEfectoEscindido(
  efecto: EfectoEscindido | undefined,
  refId: Id,
  enlaceMap: Map<Id, Id>,
): EfectoEscindido | undefined {
  if (!efecto) return undefined;
  const enlacePadreId = enlaceMap.get(efecto.enlacePadreId);
  if (!enlacePadreId) return undefined;
  return {
    ...efecto,
    grupoId: idSnapshot(refId, "efe", efecto.grupoId),
    enlacePadreId,
  };
}

function remapExtremo(
  extremo: ExtremoEnlace,
  entidadMap: Map<Id, Id>,
  estadoMap: Map<Id, Id>,
): ExtremoEnlace | null {
  const id = extremo.kind === "estado" ? estadoMap.get(extremo.id) : entidadMap.get(extremo.id);
  return id ? { ...extremo, id } : null;
}

function remapDecision(
  decision: DecisionPolicy,
  entidadMap: Map<Id, Id>,
  estadoMap: Map<Id, Id>,
  enlaceMap: Map<Id, Id>,
): DecisionPolicy {
  if (decision.modo === "estado-fijo") {
    return { ...decision, estadoId: estadoMap.get(decision.estadoId) ?? decision.estadoId };
  }
  if (decision.modo === "uniforme") {
    return { ...decision, objetoId: entidadMap.get(decision.objetoId) ?? decision.objetoId };
  }
  if (decision.modo === "probabilidades") {
    return {
      ...decision,
      pesos: Object.fromEntries(Object.entries(decision.pesos).map(([id, peso]) => [enlaceMap.get(id) ?? id, peso])),
    };
  }
  return decision;
}

function prefijoEntidad(entidad: Entidad): "o" | "p" {
  return entidad.tipo === "objeto" ? "o" : "p";
}

function idSnapshot(refId: Id, prefijo: string, id: Id): Id {
  return `${prefijo}-${refId}-${id}`;
}

function sourceIdMaterializado(refId: Id, id: Id, prefijos: readonly string[]): Id | null {
  for (const prefijo of prefijos) {
    const marcador = `${prefijo}-${refId}-`;
    if (id.startsWith(marcador)) return id.slice(marcador.length);
  }
  return null;
}

function clonar<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}
