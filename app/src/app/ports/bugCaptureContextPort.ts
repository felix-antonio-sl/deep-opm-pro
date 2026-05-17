import type { OpmStore } from "../../store";

export interface BugCaptureStoreContext {
  modeloId: OpmStore["modelo"]["id"];
  modeloNombre: OpmStore["modelo"]["nombre"];
  opdActivoId: OpmStore["opdActivoId"];
  opdActivoNombre: string;
  seleccionEntidadId: OpmStore["seleccionId"];
  seleccionEnlaceId: OpmStore["enlaceSeleccionId"];
  pestanaActivaId: OpmStore["pestanaActivaId"];
  vistaMapaActiva: OpmStore["vistaMapaActiva"];
}

export interface BugCaptureEnvironmentContext {
  url: string;
  userAgent: string;
  viewport: {
    width: number;
    height: number;
    devicePixelRatio: number;
  };
  capturedAt: string;
}

export type BugCaptureContext = BugCaptureStoreContext & BugCaptureEnvironmentContext;

export function crearBugCaptureContext(
  storeContext: BugCaptureStoreContext,
  environmentContext: BugCaptureEnvironmentContext = leerBugCaptureEnvironmentContext(),
): BugCaptureContext {
  return {
    ...storeContext,
    ...environmentContext,
  };
}

export function leerBugCaptureEnvironmentContext(): BugCaptureEnvironmentContext {
  return {
    url: globalThis.location?.href ?? "",
    userAgent: globalThis.navigator?.userAgent ?? "",
    viewport: {
      width: globalThis.innerWidth,
      height: globalThis.innerHeight,
      devicePixelRatio: globalThis.devicePixelRatio,
    },
    capturedAt: new Date().toISOString(),
  };
}
