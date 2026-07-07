import { useOpmStore } from "../../store";
import { evaluarVitrina, type EstadoVitrina } from "../../mesa/revisionVitrina";
import { useZustandPersistencePort } from "../ports/zustandPersistencePort";

/**
 * Resolución pura store → EstadoVitrina: fija la «base» del modelo activo desde
 * el mapa por-modelo antes de delegar en el selector. Testeable sin render.
 */
export function estadoVitrinaDelStore(s: {
  modeloPersistidoId: string | null;
  revisionRemota: { modeloId: string; revision: number } | null;
  revisionBasePorModelo: Record<string, number>;
  dirty: boolean;
}): EstadoVitrina {
  return evaluarVitrina({
    modeloPersistidoId: s.modeloPersistidoId,
    revisionRemota: s.revisionRemota,
    revisionBase: s.modeloPersistidoId ? (s.revisionBasePorModelo[s.modeloPersistidoId] ?? null) : null,
    dirty: s.dirty,
  });
}

export interface ChipRevisionViewModel {
  estado: EstadoVitrina;
  traer: () => void;
  verVersion: () => void;
  iniciarPoll: () => void;
  detenerPoll: () => void;
}

export function useChipRevisionViewModel(): ChipRevisionViewModel {
  const p = useZustandPersistencePort();
  const dirty = useOpmStore((s) => s.dirty);
  const estado = evaluarVitrina({
    modeloPersistidoId: p.modeloPersistidoId,
    revisionRemota: p.revisionRemota,
    revisionBase: p.revisionBase,
    dirty,
  });
  return {
    estado,
    traer: p.traerRevisionDelAgente,
    verVersion: p.verVersionDelAgente,
    iniciarPoll: p.iniciarPollRevision,
    detenerPoll: p.detenerPollRevision,
  };
}
