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
  Resultado,
  SubmodeloReferencia,
} from "./tipos";

export interface SubmodeloConectado {
  modelo: Modelo;
  refId: Id;
  opdVistaId: Id;
}

export function conectarSubmodelo(
  modelo: Modelo,
  opciones: {
    anchorEntidadId: Id;
    modeloId: Id;
    nombre: string;
    compartidas?: Record<Id, Id>;
    snapshot?: Modelo;
  },
): Resultado<SubmodeloConectado> {
  const anchor = modelo.entidades[opciones.anchorEntidadId];
  if (!anchor) return { ok: false, error: `Entidad ancla no existe: ${opciones.anchorEntidadId}` };
  const nombre = opciones.nombre.trim();
  if (!nombre) return { ok: false, error: "El submodelo requiere nombre" };

  let nextSeq = modelo.nextSeq;
  const refId = siguienteId({ ...modelo, nextSeq }, "sm");
  nextSeq += 1;
  const opdVistaId = siguienteId({ ...modelo, nextSeq }, "opd");
  nextSeq += 1;
  const snapshot = opciones.snapshot
    ? materializarSnapshotSubmodelo(opciones.snapshot, opdVistaId, refId, nombre, modelo.opdRaizId)
    : null;
  const estado: EstadoCargaSubmodelo = snapshot ? "cargado-sincronizado" : "descargado";
  const referencia: SubmodeloReferencia = {
    id: refId,
    modeloId: opciones.modeloId,
    nombre,
    anchorEntidadId: opciones.anchorEntidadId,
    opdVistaId,
    estado,
    ...(opciones.compartidas && Object.keys(opciones.compartidas).length > 0 ? { compartidas: opciones.compartidas } : {}),
  };
  const opd: Opd = snapshot?.opd ?? {
    id: opdVistaId,
    nombre,
    padreId: modelo.opdRaizId,
    apariencias: {},
    enlaces: {},
    vista: { kind: "submodel-view", submodeloRefId: refId, readOnly: true, syncState: estado },
  };

  return {
    ok: true,
    value: {
      modelo: {
        ...modelo,
        nextSeq,
        submodelos: {
          ...(modelo.submodelos ?? {}),
          [refId]: referencia,
        },
        opds: {
          ...modelo.opds,
          [opdVistaId]: opd,
        },
        ...(snapshot ? {
          entidades: { ...modelo.entidades, ...snapshot.entidades },
          estados: { ...modelo.estados, ...snapshot.estados },
          enlaces: { ...modelo.enlaces, ...snapshot.enlaces },
          abanicos: { ...(modelo.abanicos ?? {}), ...snapshot.abanicos },
        } : {}),
      },
      refId,
      opdVistaId,
    },
  };
}

interface SnapshotSubmodelo {
  opd: Opd;
  entidades: Record<Id, Entidad>;
  estados: Record<Id, Estado>;
  enlaces: Record<Id, Enlace>;
  abanicos: Record<Id, Abanico>;
}

function materializarSnapshotSubmodelo(snapshot: Modelo, opdVistaId: Id, refId: Id, nombre: string, padreId: Id): SnapshotSubmodelo {
  const root = snapshot.opds[snapshot.opdRaizId];
  if (!root) {
    return {
      opd: {
        id: opdVistaId,
        nombre,
        padreId,
        apariencias: {},
        enlaces: {},
        vista: { kind: "submodel-view", submodeloRefId: refId, readOnly: true, syncState: "cargado-sincronizado" },
      },
      entidades: {},
      estados: {},
      enlaces: {},
      abanicos: {},
    };
  }

  const entidadMap = new Map<Id, Id>();
  const estadoMap = new Map<Id, Id>();
  const enlaceMap = new Map<Id, Id>();
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
  };
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

function clonar<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

export function marcarEstadoSubmodelo(modelo: Modelo, refId: Id, estado: EstadoCargaSubmodelo): Resultado<Modelo> {
  const ref = modelo.submodelos?.[refId];
  if (!ref) return { ok: false, error: `Submodelo no existe: ${refId}` };
  const opdVistaId = ref.opdVistaId;
  const opd = opdVistaId ? modelo.opds[opdVistaId] : undefined;
  return {
    ok: true,
    value: {
      ...modelo,
      submodelos: {
        ...(modelo.submodelos ?? {}),
        [refId]: { ...ref, estado },
      },
      opds: opd && opdVistaId
        ? {
            ...modelo.opds,
            [opdVistaId]: {
              ...opd,
              vista: { kind: "submodel-view", submodeloRefId: refId, readOnly: true, syncState: estado },
            },
          }
        : modelo.opds,
    },
  };
}

export function desconectarSubmodelo(modelo: Modelo, refId: Id): Resultado<Modelo> {
  const ref = modelo.submodelos?.[refId];
  if (!ref) return { ok: false, error: `Submodelo no existe: ${refId}` };
  if (ref.estado === "desconectado") return { ok: true, value: modelo };
  return marcarEstadoSubmodelo(modelo, refId, "desconectado");
}

export function registrarPadreSubmodelo(
  modelo: Modelo,
  padre: { modeloId: Id; refId: Id; anchorEntidadId: Id; estado?: EstadoCargaSubmodelo },
): Resultado<Modelo> {
  if (!modelo.entidades[padre.anchorEntidadId]) return { ok: false, error: `Entidad compartida no existe: ${padre.anchorEntidadId}` };
  return {
    ok: true,
    value: {
      ...modelo,
      referenciaPadreSubmodelo: {
        modeloId: padre.modeloId,
        refId: padre.refId,
        anchorEntidadId: padre.anchorEntidadId,
        estado: padre.estado ?? "cargado-sincronizado",
      },
    },
  };
}

function siguienteId(modelo: Modelo, prefijo: string): Id {
  return `${prefijo}-${modelo.nextSeq}`;
}
