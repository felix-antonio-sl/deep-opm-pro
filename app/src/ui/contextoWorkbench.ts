import type { BreakpointOpm } from "./layoutResponsive";

export type ContextDeviceWorkbench = BreakpointOpm;
export type ContextModoWorkbench = "edicion" | "mapa" | "simulacion";
export type ContextSubModoEdicion = "conectando" | "insertando" | null;
export type ViewPointWorkbench = "Mobile" | "Edicion" | "Mapa" | "Simulacion";

export interface ContextoWorkbench {
  device: ContextDeviceWorkbench;
  modo: ContextModoWorkbench;
  subModo: ContextSubModoEdicion;
  viewPoint: ViewPointWorkbench;
  viewPointDefault: boolean;
}

export interface ResolverModoWorkbenchInput {
  vistaMapaActiva: boolean;
  modoSimulacionActivo: boolean;
  modoEnlaceActivo?: boolean;
  modoCreacionActivo?: boolean;
}

export interface ResolverContextoWorkbenchInput extends ResolverModoWorkbenchInput {
  breakpoint: BreakpointOpm;
}

/**
 * Context.Device IFML: ActivationExpression derivada del breakpoint OPM.
 */
export function resolverContextDeviceWorkbench(breakpoint: BreakpointOpm): ContextDeviceWorkbench {
  return breakpoint;
}

/**
 * Context.Modo IFML: XOR top-level del workbench.
 *
 * Simulación prevalece si una transición deja flags incompatibles por un frame.
 */
export function resolverContextModoWorkbench(input: ResolverModoWorkbenchInput): ContextModoWorkbench {
  if (input.modoSimulacionActivo) return "simulacion";
  if (input.vistaMapaActiva) return "mapa";
  return "edicion";
}

/**
 * Context.Modo.subModo IFML: ActivationExpression de edición.
 *
 * Solo se declara dentro de `edicion`; mapa y simulación son ViewPoints XOR
 * alternativos y no heredan submodo de insertar/conectar.
 */
export function resolverContextSubModoWorkbench(input: ResolverModoWorkbenchInput): ContextSubModoEdicion {
  if (resolverContextModoWorkbench(input) !== "edicion") return null;
  if (input.modoEnlaceActivo) return "conectando";
  if (input.modoCreacionActivo) return "insertando";
  return null;
}

export function resolverViewPointWorkbench(input: {
  device: ContextDeviceWorkbench;
  modo: ContextModoWorkbench;
}): ViewPointWorkbench {
  if (input.device === "mobile") return "Mobile";
  if (input.modo === "simulacion") return "Simulacion";
  if (input.modo === "mapa") return "Mapa";
  return "Edicion";
}

export function resolverContextoWorkbench(input: ResolverContextoWorkbenchInput): ContextoWorkbench {
  const device = resolverContextDeviceWorkbench(input.breakpoint);
  const modo = resolverContextModoWorkbench(input);
  const subModo = resolverContextSubModoWorkbench(input);
  const viewPoint = resolverViewPointWorkbench({ device, modo });
  return {
    device,
    modo,
    subModo,
    viewPoint,
    viewPointDefault: viewPoint === "Edicion",
  };
}
