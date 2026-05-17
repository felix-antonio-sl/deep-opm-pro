import { useMemo } from "preact/hooks";
import { obtenerRefinamiento } from "../../modelo/refinamientos";
import type { Apariencia, Entidad, Id, Modelo, Opd } from "../../modelo/tipos";
import { useZustandOpdNavigationPort } from "../ports/zustandOpdNavigationPort";
import { useZustandSelectionPort } from "../ports/zustandSelectionPort";
import { useZustandTimelinePort } from "../ports/zustandTimelinePort";

export interface TimelineContext {
  opd: Opd;
  contorno: Apariencia;
  rows: TimelineRow[];
}

export interface TimelineRow {
  apariencia: Apariencia;
  entidad: Entidad;
  parallelSize: number;
}

export function useTimelineViewModel() {
  const { modelo, opdActivoId } = useZustandOpdNavigationPort();
  const { seleccionId, seleccionarEntidad } = useZustandSelectionPort();
  const { reordenarSubprocesoEnTimeline } = useZustandTimelinePort();
  const contexto = useMemo(() => contextoTimeline(modelo, opdActivoId), [modelo, opdActivoId]);

  return {
    contexto,
    seleccionId,
    seleccionarEntidad,
    reordenarSubprocesoEnTimeline,
  };
}

export function contextoTimeline(modelo: Modelo, opdId: Id): TimelineContext | null {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return null;
  const padre = modelo.opds[opd.padreId];
  if (!padre) return null;
  const refinador = Object.values(modelo.entidades).find(
    (entidad) => entidad.tipo === "proceso" && obtenerRefinamiento(entidad, "descomposicion")?.opdId === opd.id,
  );
  if (!refinador) return null;
  if (!Object.values(padre.apariencias).some((apariencia) => apariencia.entidadId === refinador.id)) return null;
  const contorno = Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === refinador.id);
  if (!contorno) return null;

  const baseRows = Object.values(opd.apariencias)
    .flatMap((apariencia) => {
      if (apariencia.entidadId === refinador.id || !dentroDe(apariencia, contorno)) return [];
      const entidad = modelo.entidades[apariencia.entidadId];
      return entidad?.tipo === "proceso" ? [{ apariencia, entidad }] : [];
    })
    .sort((a, b) => a.apariencia.y - b.apariencia.y || a.apariencia.x - b.apariencia.x || a.apariencia.id.localeCompare(b.apariencia.id));

  const counts = new Map<number, number>();
  for (const row of baseRows) counts.set(row.apariencia.y, (counts.get(row.apariencia.y) ?? 0) + 1);

  return {
    opd,
    contorno,
    rows: baseRows.map((row) => ({
      ...row,
      parallelSize: counts.get(row.apariencia.y) ?? 1,
    })),
  };
}

function dentroDe(apariencia: Apariencia, contorno: Apariencia): boolean {
  return (
    apariencia.x >= contorno.x &&
    apariencia.y >= contorno.y &&
    apariencia.x + apariencia.width <= contorno.x + contorno.width &&
    apariencia.y + apariencia.height <= contorno.y + contorno.height
  );
}

export type TimelineViewModel = ReturnType<typeof useTimelineViewModel>;
