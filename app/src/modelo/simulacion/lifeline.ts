import type { Id } from "../tipos";
import type { ContextoSimulacion } from "./tipos";

export interface FotogramaLifeline {
  t: number;
  vivos: Id[];
  estados: Record<Id, Id>;
  procesosActivos: Id[];
}

/**
 * Seccion del sheaf temporal: para cada paso de la traza, proyecta el estado
 * del sistema. Pura. S3 tiempo hibrido.
 */
export function lifeline(contexto: ContextoSimulacion): FotogramaLifeline[] {
  const fotogramas: FotogramaLifeline[] = [];
  let reloj = 0;
  let estados: Record<Id, Id> = {};
  // Reconstruir desde la traza: cada entrada avanza el reloj por su duracion.
  for (const entrada of contexto.trace) {
    reloj += entrada.duracion ?? 1;
    // Aplicar transiciones para reconstruir estados en este instante.
    for (const t of entrada.transicionesAplicadas) {
      if (t.estadoDespuesId !== null) estados = { ...estados, [t.entidadId]: t.estadoDespuesId };
      else if (t.estadoAntesId !== null) {
        const next = { ...estados };
        delete next[t.entidadId];
        estados = next;
      }
    }
    fotogramas.push({
      t: reloj,
      vivos: Object.keys(estados),
      estados: { ...estados },
      procesosActivos: [entrada.procesoId],
    });
  }
  return fotogramas;
}
