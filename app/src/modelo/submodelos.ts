import type { EstadoCargaSubmodelo, Id, Modelo, Opd, Resultado, SubmodeloReferencia } from "./tipos";

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
  const referencia: SubmodeloReferencia = {
    id: refId,
    modeloId: opciones.modeloId,
    nombre,
    anchorEntidadId: opciones.anchorEntidadId,
    opdVistaId,
    estado: "descargado",
    ...(opciones.compartidas && Object.keys(opciones.compartidas).length > 0 ? { compartidas: opciones.compartidas } : {}),
  };
  const opd: Opd = {
    id: opdVistaId,
    nombre,
    padreId: modelo.opdRaizId,
    apariencias: {},
    enlaces: {},
    vista: { kind: "submodel-view", submodeloRefId: refId, readOnly: true, syncState: "descargado" },
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
      },
      refId,
      opdVistaId,
    },
  };
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
