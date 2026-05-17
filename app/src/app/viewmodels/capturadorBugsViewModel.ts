import { useOpmStore } from "../../store";

export function useBugCaptureContext() {
  return useOpmStore((s) => ({
    modeloId: s.modelo.id,
    modeloNombre: s.modelo.nombre,
    opdActivoId: s.opdActivoId,
    opdActivoNombre: s.modelo.opds[s.opdActivoId]?.nombre ?? s.opdActivoId,
    seleccionEntidadId: s.seleccionId,
    seleccionEnlaceId: s.enlaceSeleccionId,
    pestanaActivaId: s.pestanaActivaId,
    vistaMapaActiva: s.vistaMapaActiva,
    url: globalThis.location?.href ?? "",
    userAgent: globalThis.navigator?.userAgent ?? "",
    viewport: {
      width: globalThis.innerWidth,
      height: globalThis.innerHeight,
      devicePixelRatio: globalThis.devicePixelRatio,
    },
    capturedAt: new Date().toISOString(),
  }));
}

export type BugCaptureContext = ReturnType<typeof useBugCaptureContext>;
