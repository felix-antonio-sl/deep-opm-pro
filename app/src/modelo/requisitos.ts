import { entidadIdDeExtremo } from "./extremos";
import { crearObjeto } from "./operaciones/creacion";
import type {
  Apariencia,
  AparienciaEnlace,
  EstadoSatisfaccionRequisito,
  Id,
  Modelo,
  Opd,
  RequisitoEntidadMetadata,
  Resultado,
  SatisfaccionRequisito,
  TargetSatisfaccionRequisito,
} from "./tipos";

export interface RequisitoCreado {
  modelo: Modelo;
  requisitoEntidadId: Id;
}

export function crearRequisito(
  modelo: Modelo,
  opdId: Id,
  posicion: { x: number; y: number },
  nombre: string,
  metadata: Omit<RequisitoEntidadMetadata, "idLogico"> & { idLogico?: string },
): Resultado<RequisitoCreado> {
  const creado = crearObjeto(modelo, opdId, posicion, nombre);
  if (!creado.ok) return creado;
  const requisitoEntidadId = Object.keys(creado.value.entidades).find((id) => !modelo.entidades[id]);
  if (!requisitoEntidadId) return { ok: false, error: "No se pudo crear el requisito" };
  const marcado = marcarEntidadComoRequisito(creado.value, requisitoEntidadId, {
    ...metadata,
    idLogico: metadata.idLogico ?? siguienteReqId(creado.value),
  });
  return marcado.ok ? { ok: true, value: { modelo: marcado.value, requisitoEntidadId } } : marcado;
}

export function marcarEntidadComoRequisito(
  modelo: Modelo,
  entidadId: Id,
  metadata: RequisitoEntidadMetadata,
): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad || entidad.tipo !== "objeto") return { ok: false, error: "El requisito debe ser un objeto OPM" };
  const normalizada = normalizarRequisito(metadata);
  if (!normalizada.ok) return normalizada;
  return {
    ok: true,
    value: {
      ...modelo,
      entidades: {
        ...modelo.entidades,
        [entidadId]: {
          ...entidad,
          estereotipo: "requirement",
          requisito: normalizada.value,
        },
      },
    },
  };
}

export function satisfacerRequisito(
  modelo: Modelo,
  requisitoEntidadId: Id,
  target: TargetSatisfaccionRequisito,
  estado: EstadoSatisfaccionRequisito = "satisface",
  descripcion?: string,
): Resultado<Modelo> {
  const requisito = modelo.entidades[requisitoEntidadId];
  if (requisito?.estereotipo !== "requirement" || !requisito.requisito) {
    return { ok: false, error: "Entidad requisito inválida" };
  }
  if (target.tipo === "entidad" && !modelo.entidades[target.id]) return { ok: false, error: `Entidad no existe: ${target.id}` };
  if (target.tipo === "enlace" && !modelo.enlaces[target.id]) return { ok: false, error: `Enlace no existe: ${target.id}` };
  if (!esEstadoSatisfaccionRequisito(estado)) return { ok: false, error: "Estado de satisfacción inválido" };

  const satisfaccionId = satisfaccionExistente(modelo, requisitoEntidadId, target)?.id ?? siguienteId(modelo, "sr");
  const satisfaccion: SatisfaccionRequisito = {
    id: satisfaccionId,
    requisitoEntidadId,
    target,
    estado,
    ...(descripcion?.trim() ? { descripcion: descripcion.trim() } : {}),
  };
  const nextSeq = modelo.satisfaccionesRequisito?.[satisfaccionId] ? modelo.nextSeq : modelo.nextSeq + 1;
  let enlaces = modelo.enlaces;
  if (target.tipo === "enlace") {
    const enlace = modelo.enlaces[target.id]!;
    const reqId = requisito.requisito.idLogico;
    enlaces = {
      ...modelo.enlaces,
      [enlace.id]: {
        ...enlace,
        requisitos: reqId,
        mostrarRequisitos: true,
      },
    };
  }
  return {
    ok: true,
    value: {
      ...modelo,
      nextSeq,
      enlaces,
      satisfaccionesRequisito: {
        ...(modelo.satisfaccionesRequisito ?? {}),
        [satisfaccionId]: satisfaccion,
      },
    },
  };
}

export function crearRequirementView(modelo: Modelo, requisitoEntidadId: Id, nombre?: string): Resultado<{ modelo: Modelo; opdId: Id }> {
  const requisito = modelo.entidades[requisitoEntidadId];
  if (requisito?.estereotipo !== "requirement" || !requisito.requisito) {
    return { ok: false, error: "Entidad requisito inválida" };
  }

  let nextSeq = modelo.nextSeq;
  const opdId = siguienteId({ ...modelo, nextSeq }, "opd");
  nextSeq += 1;
  const entidadIds = new Set<Id>([requisitoEntidadId]);
  const enlaceIds = new Set<Id>();
  for (const sat of Object.values(modelo.satisfaccionesRequisito ?? {})) {
    if (sat.requisitoEntidadId !== requisitoEntidadId) continue;
    if (sat.target.tipo === "entidad") entidadIds.add(sat.target.id);
    if (sat.target.tipo === "enlace") {
      const enlace = modelo.enlaces[sat.target.id];
      if (!enlace) continue;
      enlaceIds.add(enlace.id);
      const origenId = entidadIdDeExtremo(modelo, enlace.origenId);
      const destinoId = entidadIdDeExtremo(modelo, enlace.destinoId);
      if (origenId) entidadIds.add(origenId);
      if (destinoId) entidadIds.add(destinoId);
    }
  }

  const apariencias: Record<Id, Apariencia> = {};
  const mapaApariencias = new Map<Id, Apariencia>();
  for (const entidadId of entidadIds) {
    const fuente = primeraApariencia(modelo, entidadId);
    if (!fuente) continue;
    const aparienciaId = siguienteId({ ...modelo, nextSeq }, "a");
    nextSeq += 1;
    const apariencia: Apariencia = { ...fuente, id: aparienciaId, opdId };
    apariencias[aparienciaId] = apariencia;
    mapaApariencias.set(entidadId, apariencia);
  }

  const enlaces: Record<Id, AparienciaEnlace> = {};
  for (const enlaceId of enlaceIds) {
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace) continue;
    const origenId = entidadIdDeExtremo(modelo, enlace.origenId);
    const destinoId = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (!origenId || !destinoId || !mapaApariencias.has(origenId) || !mapaApariencias.has(destinoId)) continue;
    const aparienciaId = siguienteId({ ...modelo, nextSeq }, "ae");
    nextSeq += 1;
    enlaces[aparienciaId] = { id: aparienciaId, enlaceId, opdId, vertices: [] };
  }

  const opd: Opd = {
    id: opdId,
    nombre: nombre?.trim() || `Requirement ${requisito.requisito.idLogico}`,
    padreId: modelo.opdRaizId,
    apariencias,
    enlaces,
    vista: { kind: "requirement-view", requisitoEntidadId, readOnly: true },
  };

  return {
    ok: true,
    value: {
      modelo: {
        ...modelo,
        nextSeq,
        opds: {
          ...modelo.opds,
          [opdId]: opd,
        },
      },
      opdId,
    },
  };
}

export function normalizarRequisito(metadata: RequisitoEntidadMetadata): Resultado<RequisitoEntidadMetadata> {
  const idLogico = metadata.idLogico.trim();
  const descripcion = metadata.descripcion.trim();
  if (!idLogico) return { ok: false, error: "El requisito requiere id lógico" };
  if (!descripcion) return { ok: false, error: "El requisito requiere descripción" };
  if (metadata.dureza !== "hard" && metadata.dureza !== "soft") return { ok: false, error: "Dureza de requisito inválida" };
  if (metadata.satisfaction !== undefined && !esEstadoSatisfaccionRequisito(metadata.satisfaction)) {
    return { ok: false, error: "Satisfacción de requisito inválida" };
  }
  return {
    ok: true,
    value: {
      idLogico,
      descripcion,
      dureza: metadata.dureza,
      ...(metadata.actor?.trim() ? { actor: metadata.actor.trim() } : {}),
      ...(metadata.satisfaction ? { satisfaction: metadata.satisfaction } : {}),
    },
  };
}

function primeraApariencia(modelo: Modelo, entidadId: Id): Apariencia | null {
  for (const opd of Object.values(modelo.opds)) {
    const apariencia = Object.values(opd.apariencias).find((item) => item.entidadId === entidadId);
    if (apariencia) return apariencia;
  }
  return null;
}

function satisfaccionExistente(
  modelo: Modelo,
  requisitoEntidadId: Id,
  target: TargetSatisfaccionRequisito,
): SatisfaccionRequisito | null {
  return Object.values(modelo.satisfaccionesRequisito ?? {}).find((sat) =>
    sat.requisitoEntidadId === requisitoEntidadId && sat.target.tipo === target.tipo && sat.target.id === target.id
  ) ?? null;
}

function siguienteReqId(modelo: Modelo): string {
  const usados = new Set(
    Object.values(modelo.entidades)
      .map((entidad) => entidad.requisito?.idLogico)
      .filter((id): id is string => typeof id === "string"),
  );
  for (let index = 1; index < Number.MAX_SAFE_INTEGER; index += 1) {
    const candidato = `Req#${index}`;
    if (!usados.has(candidato)) return candidato;
  }
  return `Req#${modelo.nextSeq}`;
}

function siguienteId(modelo: Modelo, prefijo: string): Id {
  return `${prefijo}-${modelo.nextSeq}`;
}

function esEstadoSatisfaccionRequisito(value: string): value is EstadoSatisfaccionRequisito {
  return value === "pendiente" || value === "satisface" || value === "parcial" || value === "no-satisface";
}
