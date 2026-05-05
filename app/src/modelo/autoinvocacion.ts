import { extremoEntidad, extremoVisibleEnOpd } from "./extremos";
import { definirDemora } from "./modificadores";
import type { AparienciaEnlace, Enlace, Id, Modelo, Resultado } from "./tipos";

export function crearAutoInvocacion(
  modelo: Modelo,
  opdId: Id,
  procesoId: Id,
  demora = "1s",
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const proceso = modelo.entidades[procesoId];
  if (!proceso) return fallo(`Proceso no existe: ${procesoId}`);
  if (proceso.tipo !== "proceso") return fallo("La auto-invocacion requiere un proceso [V-240]");
  const extremo = extremoEntidad(procesoId);
  if (!extremoVisibleEnOpd(modelo, opd, extremo)) {
    return fallo("La auto-invocacion requiere que el proceso tenga apariencia en el OPD activo");
  }
  if (autoInvocacionDeProceso(modelo, opdId, procesoId)) {
    return fallo("La auto-invocacion ya existe para este proceso en el OPD activo [opm-visual-es §9.1]");
  }

  const enlaceId = siguienteId(modelo, "e");
  const aparienciaId = siguienteId({ ...modelo, nextSeq: modelo.nextSeq + 1 }, "ae");
  const enlace: Enlace = {
    id: enlaceId,
    tipo: "invocacion",
    origenId: extremo,
    destinoId: extremo,
    etiqueta: "",
  };
  const apariencia: AparienciaEnlace = { id: aparienciaId, enlaceId, opdId, vertices: [] };
  const creado: Modelo = {
    ...modelo,
    nextSeq: modelo.nextSeq + 2,
    enlaces: { ...modelo.enlaces, [enlaceId]: enlace },
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces: { ...opd.enlaces, [aparienciaId]: apariencia },
      },
    },
  };

  return definirDemora(creado, enlaceId, demora);
}

export function esAutoInvocacion(enlace: Enlace): boolean {
  return enlace.tipo === "invocacion" &&
    enlace.origenId.kind === "entidad" &&
    enlace.destinoId.kind === "entidad" &&
    enlace.origenId.id === enlace.destinoId.id;
}

export function autoInvocacionDeProceso(modelo: Modelo, opdId: Id, procesoId: Id): Enlace | undefined {
  const opd = modelo.opds[opdId];
  if (!opd) return undefined;
  return Object.values(opd.enlaces)
    .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
    .find((enlace): enlace is Enlace => !!enlace && esAutoInvocacion(enlace) && enlace.origenId.id === procesoId);
}

function siguienteId(modelo: Modelo, prefijo: string): Id {
  return `${prefijo}-${modelo.nextSeq}`;
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
