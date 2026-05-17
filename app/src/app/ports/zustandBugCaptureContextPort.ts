import { useOpmStore } from "../../store";
import type { BugCaptureStoreContext } from "./bugCaptureContextPort";

export function useZustandBugCaptureContextPort(): BugCaptureStoreContext {
  return useOpmStore((s) => ({
    modeloId: s.modelo.id,
    modeloNombre: s.modelo.nombre,
    opdActivoId: s.opdActivoId,
    opdActivoNombre: s.modelo.opds[s.opdActivoId]?.nombre ?? s.opdActivoId,
    seleccionEntidadId: s.seleccionId,
    seleccionEnlaceId: s.enlaceSeleccionId,
    pestanaActivaId: s.pestanaActivaId,
    vistaMapaActiva: s.vistaMapaActiva,
  }));
}
