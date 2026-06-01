import type { EstadoCargaSubmodelo, Modelo, SubmodeloReferencia } from "../tipos";

export function estadoSubmodelo(ref: SubmodeloReferencia): EstadoCargaSubmodelo {
  if (ref.estado === "desconectado") return "desconectado";
  const materializacion = ref.materializacion;
  if (!materializacion) {
    if (ref.opdVistaId && ref.estado !== "descargado") return ref.estado;
    return "descargado";
  }
  const sourceHash = ref.source?.revisionHash;
  if (sourceHash && materializacion.sourceHash && sourceHash !== materializacion.sourceHash) {
    return "cargado-no-sincronizado";
  }
  return "cargado-sincronizado";
}

export function refConEstadoDerivado(ref: SubmodeloReferencia): SubmodeloReferencia {
  const estado = estadoSubmodelo(ref);
  return {
    ...ref,
    estado,
    modeloId: ref.source?.modeloId ?? ref.modeloId,
    anchorEntidadId: ref.anchor?.entidadId ?? ref.anchorEntidadId,
    ...(ref.materializacion?.opdVistaId ? { opdVistaId: ref.materializacion.opdVistaId } : ref.opdVistaId ? { opdVistaId: ref.opdVistaId } : {}),
    ...(ref.contrato?.compartidas ? { compartidas: ref.contrato.compartidas } : ref.compartidas ? { compartidas: ref.compartidas } : {}),
  };
}

export function firmaSnapshotSubmodelo(modelo: Modelo): string {
  return hashFNV1a(JSON.stringify(ordenarJson({
    id: modelo.id,
    nombre: modelo.nombre,
    opdRaizId: modelo.opdRaizId,
    opds: modelo.opds,
    entidades: modelo.entidades,
    estados: modelo.estados,
    enlaces: modelo.enlaces,
    abanicos: modelo.abanicos ?? {},
  })));
}

function ordenarJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(ordenarJson);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b, "es"))
      .map(([key, item]) => [key, ordenarJson(item)]),
  );
}

function hashFNV1a(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}
