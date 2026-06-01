import type {
  EstadoCargaSubmodelo,
  Id,
  Modelo,
  Opd,
  Resultado,
  SubmodeloReferencia,
} from "./tipos";
import {
  estadoSubmodelo,
  firmaSnapshotSubmodelo,
  refConEstadoDerivado,
} from "./submodelos/estado";
import {
  materializacionEfectivaSubmodelo,
  materializarSnapshotSubmodelo,
  opdSubmodeloVacio,
} from "./submodelos/materializacion";

export { estadoSubmodelo, firmaSnapshotSubmodelo } from "./submodelos/estado";
export { materializacionEfectivaSubmodelo } from "./submodelos/materializacion";

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
    anchorOpdId?: Id;
  },
): Resultado<SubmodeloConectado> {
  const anchor = modelo.entidades[opciones.anchorEntidadId];
  if (!anchor) return { ok: false, error: `Entidad ancla no existe: ${opciones.anchorEntidadId}` };
  const nombre = opciones.nombre.trim();
  if (!nombre) return { ok: false, error: "El submodelo requiere nombre" };

  let nextSeq = modelo.nextSeq;
  const refId = siguienteId(nextSeq, "sm");
  nextSeq += 1;
  const opdVistaId = siguienteId(nextSeq, "opd");
  nextSeq += 1;
  const padreId = opciones.anchorOpdId && modelo.opds[opciones.anchorOpdId] ? opciones.anchorOpdId : modelo.opdRaizId;
  const materializado = opciones.snapshot
    ? materializarSnapshotSubmodelo(opciones.snapshot, opdVistaId, refId, nombre, padreId)
    : null;
  const estado: EstadoCargaSubmodelo = materializado ? "cargado-sincronizado" : "descargado";
  const revisionHash = materializado?.materializacion.sourceHash ?? (opciones.snapshot ? firmaSnapshotSubmodelo(opciones.snapshot) : undefined);
  const compartidas = normalizarCompartidas(opciones.compartidas);
  const referencia = refConEstadoDerivado({
    id: refId,
    modeloId: opciones.modeloId,
    nombre,
    anchorEntidadId: opciones.anchorEntidadId,
    opdVistaId,
    estado,
    ...(compartidas ? { compartidas } : {}),
    source: {
      modeloId: opciones.modeloId,
      ...(opciones.snapshot?.nombre ? { nombre: opciones.snapshot.nombre } : {}),
      ...(revisionHash ? { revisionHash } : {}),
    },
    anchor: { entidadId: opciones.anchorEntidadId, opdId: padreId },
    ...(compartidas || revisionHash ? { contrato: { ...(compartidas ? { compartidas } : {}), ...(revisionHash ? { frozenAtHash: revisionHash } : {}) } } : {}),
    ...(materializado ? { materializacion: materializado.materializacion } : {}),
  });
  const opd: Opd = materializado?.opd ?? opdSubmodeloVacio(opdVistaId, refId, nombre, padreId, estado);

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
        ...(materializado ? {
          entidades: { ...modelo.entidades, ...materializado.entidades },
          estados: { ...modelo.estados, ...materializado.estados },
          enlaces: { ...modelo.enlaces, ...materializado.enlaces },
          abanicos: { ...(modelo.abanicos ?? {}), ...materializado.abanicos },
        } : {}),
      },
      refId,
      opdVistaId,
    },
  };
}

export function actualizarMaterializacionSubmodelo(modelo: Modelo, refId: Id, snapshot: Modelo): Resultado<SubmodeloConectado> {
  const ref = modelo.submodelos?.[refId];
  if (!ref) return { ok: false, error: `Submodelo no existe: ${refId}` };
  if (estadoSubmodelo(ref) === "desconectado") return { ok: false, error: "El submodelo está desconectado" };

  const descargado = materializacionEfectivaSubmodelo(modelo, ref)
    ? descargarVistaSubmodelo(modelo, refId)
    : { ok: true as const, value: modelo };
  if (!descargado.ok) return descargado;

  const base = descargado.value;
  const refBase = base.submodelos?.[refId] ?? ref;
  let nextSeq = base.nextSeq;
  const opdVistaId = refBase.opdVistaId ?? siguienteId(nextSeq++, "opd");
  const padreId = base.opds[opdVistaId]?.padreId ?? refBase.anchor?.opdId ?? base.opdRaizId;
  const materializado = materializarSnapshotSubmodelo(snapshot, opdVistaId, refId, refBase.nombre, padreId);
  const revisionHash = materializado.materializacion.sourceHash ?? firmaSnapshotSubmodelo(snapshot);
  const compartidas = normalizarCompartidas(refBase.contrato?.compartidas ?? refBase.compartidas);
  const refActualizada = refConEstadoDerivado({
    ...refBase,
    modeloId: refBase.source?.modeloId ?? refBase.modeloId,
    anchorEntidadId: refBase.anchor?.entidadId ?? refBase.anchorEntidadId,
    opdVistaId,
    estado: "cargado-sincronizado",
    ...(compartidas ? { compartidas } : {}),
    source: {
      modeloId: refBase.source?.modeloId ?? refBase.modeloId,
      ...(snapshot.nombre ? { nombre: snapshot.nombre } : {}),
      revisionHash,
    },
    anchor: refBase.anchor ?? { entidadId: refBase.anchorEntidadId, opdId: padreId },
    contrato: {
      ...(compartidas ? { compartidas } : {}),
      frozenAtHash: refBase.contrato?.frozenAtHash ?? revisionHash,
    },
    materializacion: materializado.materializacion,
  });

  return {
    ok: true,
    value: {
      modelo: {
        ...base,
        nextSeq,
        submodelos: {
          ...(base.submodelos ?? {}),
          [refId]: refActualizada,
        },
        opds: {
          ...base.opds,
          [opdVistaId]: materializado.opd,
        },
        entidades: { ...base.entidades, ...materializado.entidades },
        estados: { ...base.estados, ...materializado.estados },
        enlaces: { ...base.enlaces, ...materializado.enlaces },
        abanicos: { ...(base.abanicos ?? {}), ...materializado.abanicos },
      },
      refId,
      opdVistaId,
    },
  };
}

export function descargarVistaSubmodelo(modelo: Modelo, refId: Id): Resultado<Modelo> {
  const ref = modelo.submodelos?.[refId];
  if (!ref) return { ok: false, error: `Submodelo no existe: ${refId}` };
  if (estadoSubmodelo(ref) === "desconectado") return { ok: false, error: "El submodelo está desconectado" };
  const materializacion = materializacionEfectivaSubmodelo(modelo, ref);
  if (!materializacion) {
    if (estadoSubmodelo(ref) === "descargado") return { ok: true, value: modelo };
    return { ok: false, error: "La vista no tiene mapa de materialización para descargar" };
  }
  const opd = modelo.opds[materializacion.opdVistaId];
  if (!opd) return { ok: false, error: `OPD de submodelo no existe: ${materializacion.opdVistaId}` };
  const estado: EstadoCargaSubmodelo = "descargado";
  const { materializacion: _materializacion, ...refSinMaterializacion } = ref;
  const revisionHash = ref.source?.revisionHash ?? materializacion.sourceHash;
  const refDescargada = refConEstadoDerivado({
    ...refSinMaterializacion,
    opdVistaId: materializacion.opdVistaId,
    estado,
    source: {
      modeloId: ref.source?.modeloId ?? ref.modeloId,
      ...(ref.source?.nombre ? { nombre: ref.source.nombre } : {}),
      ...(revisionHash ? { revisionHash } : {}),
    },
    anchor: ref.anchor ?? { entidadId: ref.anchorEntidadId, opdId: opd.padreId ?? modelo.opdRaizId },
  });

  return {
    ok: true,
    value: {
      ...modelo,
      submodelos: {
        ...(modelo.submodelos ?? {}),
        [refId]: refDescargada,
      },
      opds: {
        ...modelo.opds,
        [opd.id]: {
          ...opd,
          apariencias: {},
          enlaces: {},
          vista: { kind: "submodel-view", submodeloRefId: refId, readOnly: true, syncState: estado },
        },
      },
      entidades: omitirIds(modelo.entidades, Object.values(materializacion.entidadMap)),
      estados: omitirIds(modelo.estados, Object.values(materializacion.estadoMap)),
      enlaces: omitirIds(modelo.enlaces, Object.values(materializacion.enlaceMap)),
      abanicos: omitirIds(modelo.abanicos ?? {}, Object.values(materializacion.abanicoMap)),
    },
  };
}

export function marcarEstadoSubmodelo(modelo: Modelo, refId: Id, estado: EstadoCargaSubmodelo): Resultado<Modelo> {
  const ref = modelo.submodelos?.[refId];
  if (!ref) return { ok: false, error: `Submodelo no existe: ${refId}` };
  const opdVistaId = ref.opdVistaId;
  const opd = opdVistaId ? modelo.opds[opdVistaId] : undefined;
  const refActualizada = refConEstadoDerivado({ ...ref, estado });
  return {
    ok: true,
    value: {
      ...modelo,
      submodelos: {
        ...(modelo.submodelos ?? {}),
        [refId]: estado === "desconectado" ? { ...refActualizada, estado } : refActualizada,
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
  if (estadoSubmodelo(ref) === "desconectado") return { ok: true, value: modelo };
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

function siguienteId(nextSeq: number, prefijo: string): Id {
  return `${prefijo}-${nextSeq}`;
}

function normalizarCompartidas(value: Record<Id, Id> | undefined): Record<Id, Id> | undefined {
  if (!value || Object.keys(value).length === 0) return undefined;
  return { ...value };
}

function omitirIds<T>(record: Record<Id, T>, ids: readonly Id[]): Record<Id, T> {
  const omitidos = new Set(ids);
  return Object.fromEntries(Object.entries(record).filter(([id]) => !omitidos.has(id))) as Record<Id, T>;
}
