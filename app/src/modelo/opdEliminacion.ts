import { entidadIdDeExtremo } from "./extremos";
import { quitarRefinamiento, refinaA } from "./refinamientos";
import type { Abanico, Enlace, Entidad, Estado, Id, Modelo, Resultado } from "./tipos";

export const MENSAJE_ELIMINAR_DESCENDIENTES = "Eliminar descendientes primero";

export function diagnosticarEliminacionOpd(modelo: Modelo, opdId: Id): Resultado<{
  hoja: boolean;
  hijos: Id[];
  motivoBloqueo?: string;
}> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  if (opdId === modelo.opdRaizId) {
    return ok({ hoja: false, hijos: [], motivoBloqueo: "No se puede eliminar el OPD raíz SD" });
  }

  const hijos = Object.values(modelo.opds)
    .filter((candidato) => candidato.padreId === opdId)
    .map((hijo) => hijo.id)
    .sort((a, b) => a.localeCompare(b, "es"));

  if (hijos.length > 0) {
    return ok({ hoja: false, hijos, motivoBloqueo: `${MENSAJE_ELIMINAR_DESCENDIENTES}: ${hijos.join(", ")}` });
  }

  return ok({ hoja: true, hijos });
}

export function eliminarOpdHoja(modelo: Modelo, opdId: Id): Resultado<{
  modelo: Modelo;
  opdActivoSugerido: Id;
  entidadRefinadaId: Id | null;
}> {
  const diagnostico = diagnosticarEliminacionOpd(modelo, opdId);
  if (!diagnostico.ok) return diagnostico;
  if (!diagnostico.value.hoja) {
    return fallo(diagnostico.value.motivoBloqueo ?? MENSAJE_ELIMINAR_DESCENDIENTES);
  }

  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);

  const entidadRefinada = Object.values(modelo.entidades).find(
    (entidad) => refinaA(entidad, opdId) !== null,
  );
  const opds = { ...modelo.opds };
  delete opds[opdId];
  const entidadesVisibles = new Set(
    Object.values(opds).flatMap((opdRestante) => (
      Object.values(opdRestante.apariencias).map((apariencia) => apariencia.entidadId)
    )),
  );
  const entidades = Object.fromEntries(
    Object.entries(modelo.entidades)
      .filter(([id]) => entidadesVisibles.has(id))
      .map(([id, entidad]) => [id, quitarRefinamientoAOpd(entidad, opdId)]),
  ) as Record<Id, Entidad>;
  const estados = Object.fromEntries(
    Object.entries(modelo.estados ?? {}).filter(([, estado]) => entidades[estado.entidadId]),
  ) as Record<Id, Estado>;
  const enlacesVisibles = new Set(
    Object.values(opds).flatMap((opdRestante) => (
      Object.values(opdRestante.enlaces).map((apariencia) => apariencia.enlaceId)
    )),
  );
  const modeloSinOpd = { ...modelo, opds, entidades, estados };
  const enlaces = Object.fromEntries(
    Object.entries(modelo.enlaces).filter(([enlaceId, enlace]) => (
      enlacesVisibles.has(enlaceId) &&
      entidadIdDeExtremo(modeloSinOpd, enlace.origenId) !== null &&
      entidadIdDeExtremo(modeloSinOpd, enlace.destinoId) !== null
    )),
  ) as Record<Id, Enlace>;
  const opdsSinReferencias = Object.fromEntries(
    Object.entries(opds).map(([opdRestanteId, opdRestante]) => [
      opdRestanteId,
      {
        ...opdRestante,
        enlaces: Object.fromEntries(
          Object.entries(opdRestante.enlaces).filter(([, apariencia]) => enlaces[apariencia.enlaceId]),
        ),
      },
    ]),
  );
  const abanicos = limpiarAbanicos(modelo, opdsSinReferencias, enlaces);

  const siguiente: Modelo = {
    ...modelo,
    entidades,
    estados,
    enlaces,
    opds: opdsSinReferencias,
    ...(abanicos ? { abanicos } : {}),
  };
  const padreId = opd.padreId && siguiente.opds[opd.padreId] ? opd.padreId : siguiente.opdRaizId;
  return ok({
    modelo: siguiente,
    opdActivoSugerido: padreId,
    entidadRefinadaId: entidadRefinada?.id ?? null,
  });
}

function limpiarAbanicos(
  modelo: Modelo,
  opds: Modelo["opds"],
  enlaces: Modelo["enlaces"],
): Modelo["abanicos"] {
  if (!modelo.abanicos) return undefined;
  const entradas: Array<[Id, Abanico]> = [];
  for (const [abanicoId, abanico] of Object.entries(modelo.abanicos)) {
    const siguiente = {
      ...abanico,
      enlaceIds: abanico.enlaceIds.filter((enlaceId) => enlaces[enlaceId]),
    };
    if (opds[siguiente.opdId] && siguiente.enlaceIds.length >= 2) entradas.push([abanicoId, siguiente]);
  }
  return Object.fromEntries(entradas);
}

function quitarRefinamientoAOpd(entidad: Entidad, opdId: Id): Entidad {
  const ref = refinaA(entidad, opdId);
  if (!ref) return entidad;
  return quitarRefinamiento(entidad, ref.tipo);
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo<T = never>(error: string): Resultado<T> {
  return { ok: false, error };
}
