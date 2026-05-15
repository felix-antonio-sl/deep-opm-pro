import type { BreakpointOpm } from "./layoutResponsive";

export type ContextDeviceWorkbench = BreakpointOpm;
export type ContextModoWorkbench = "edicion" | "mapa" | "simulacion";
export type ViewPointWorkbench = "Mobile" | "Edicion" | "Mapa" | "Simulacion";

export interface ContextoWorkbench {
  device: ContextDeviceWorkbench;
  modo: ContextModoWorkbench;
  viewPoint: ViewPointWorkbench;
  viewPointDefault: boolean;
}

export interface ResolverModoWorkbenchInput {
  vistaMapaActiva: boolean;
  modoSimulacionActivo: boolean;
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
  const viewPoint = resolverViewPointWorkbench({ device, modo });
  return {
    device,
    modo,
    viewPoint,
    viewPointDefault: viewPoint === "Edicion",
  };
}
