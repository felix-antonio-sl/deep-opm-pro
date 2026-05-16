import type { OpmStore } from "../store/tipos";
import { resolverBreakpoint, type BreakpointOpm } from "./layoutResponsive";
import {
  resolverContextModoWorkbench,
  resolverContextSubModoWorkbench,
  resolverContextoWorkbench,
  type ContextModoWorkbench,
  type ContextSubModoEdicion,
} from "./contextoWorkbench";

export type DeviceSize = BreakpointOpm;
export type ModoWorkbench = ContextModoWorkbench;
export type SubModoEdicion = ContextSubModoEdicion;

type EstadoModoWorkbench = Pick<OpmStore, "contextoSimulacion" | "vistaMapaActiva" | "modoEnlace" | "modoCreacion">;

export const Context = {
  Device: {
    dimension: (viewportWidth: number): DeviceSize => resolverBreakpoint(viewportWidth),
  },
  Modo: {
    activacion: (state: EstadoModoWorkbench): ModoWorkbench => resolverContextModoWorkbench({
      vistaMapaActiva: state.vistaMapaActiva,
      modoSimulacionActivo: state.contextoSimulacion !== null,
      modoEnlaceActivo: state.modoEnlace !== null,
      modoCreacionActivo: state.modoCreacion !== null,
    }),
    subModo: (state: EstadoModoWorkbench): SubModoEdicion => resolverContextSubModoWorkbench({
      vistaMapaActiva: state.vistaMapaActiva,
      modoSimulacionActivo: state.contextoSimulacion !== null,
      modoEnlaceActivo: state.modoEnlace !== null,
      modoCreacionActivo: state.modoCreacion !== null,
    }),
  },
} as const;

export function vistaActivaIFML(
  state: EstadoModoWorkbench,
  viewportWidth = typeof window === "undefined" ? 1024 : window.innerWidth,
): { device: DeviceSize; modo: ModoWorkbench; subModo: SubModoEdicion } {
  return {
    device: Context.Device.dimension(viewportWidth),
    modo: Context.Modo.activacion(state),
    subModo: Context.Modo.subModo(state),
  };
}

export { resolverContextoWorkbench };
