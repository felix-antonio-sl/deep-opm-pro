import { useEffect, useState } from "preact/hooks";

/**
 * Helper puro de breakpoints responsive del modelador OPM.
 *
 * Ronda 21 L2: el modelador deja de ser "desktop comprimido" en mobile y se
 * comporta como modo revisión/navegación. Este helper centraliza la decisión
 * de viewport para que `App.tsx`, `ToolbarBase.tsx` y `ModoRevisionMobile.tsx`
 * compartan la misma noción de breakpoint sin duplicar literales.
 *
 * Decisiones bloqueadas (brief §6, §9):
 * - `< 640px` → `mobile` (modo revisión, toolbar primaria oculta).
 * - `640-1023px` → `tablet` (toolbar reducida, paneles como drawers).
 * - `≥ 1024px` → `desktop` (comportamiento canónico, sin cambios).
 *
 * No hay viewport-width para font-size (regla dura ronda 21 §2).
 */

export type BreakpointOpm = "mobile" | "tablet" | "desktop";

export const BREAKPOINT_MOBILE_MAX = 640;
export const BREAKPOINT_TABLET_MAX = 1024;

/**
 * Resuelve el breakpoint OPM canónico desde el ancho del viewport.
 *
 * Función pura: idéntica entrada → idéntica salida. Usable en SSR, tests
 * unitarios y en hooks reactivos sobre `window.innerWidth`.
 */
export function resolverBreakpoint(width: number): BreakpointOpm {
  if (!Number.isFinite(width) || width < 0) return "desktop";
  if (width < BREAKPOINT_MOBILE_MAX) return "mobile";
  if (width < BREAKPOINT_TABLET_MAX) return "tablet";
  return "desktop";
}

/**
 * Indica si el breakpoint admite la toolbar primaria de modelado pesado.
 * Solo desktop la muestra completa; tablet la compacta; mobile la oculta.
 */
export function permiteToolbarModeladoPesado(bp: BreakpointOpm): boolean {
  return bp === "desktop";
}

/**
 * Lee el breakpoint actual del viewport. Seguro en SSR (sin window → desktop).
 * No usa hooks; la suscripción a resize se hace en `useBreakpoint`.
 */
export function leerBreakpointActual(): BreakpointOpm {
  if (typeof window === "undefined") return "desktop";
  return resolverBreakpoint(window.innerWidth);
}

/**
 * Hook reactivo: escucha `resize` y devuelve el breakpoint OPM actual.
 * En SSR/test sin `window` retorna `"desktop"` y nunca suscribe.
 *
 * Nota: usa la altura del viewport para forzar re-render solo cuando cambia
 * el ancho relevante para los thresholds; un debounce mínimo es innecesario
 * porque `resize` ya es throttled por el navegador.
 */
export function useBreakpoint(): BreakpointOpm {
  const [bp, setBp] = useState<BreakpointOpm>(leerBreakpointActual);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => {
      const proximo = resolverBreakpoint(window.innerWidth);
      setBp((actual) => (actual === proximo ? actual : proximo));
    };
    window.addEventListener("resize", onResize);
    // Sincronizar al montar por si el viewport cambió antes de la suscripción.
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return bp;
}

/**
 * Indica si el breakpoint admite el dock dividido de la biblioteca de cosas.
 * Mobile siempre fuerza overlay/drawer; tablet/desktop pueden mostrarlo.
 *
 * Bloqueo explícito ronda 21 L2: aunque la rama ronda20 L3 (biblioteca dock)
 * todavía no esté mergeada, este helper asegura que mobile nunca dock-divida.
 */
export function permiteDockBiblioteca(bp: BreakpointOpm): boolean {
  return bp !== "mobile";
}

/**
 * Indica si el breakpoint debe usar paneles como drawers (overlay) en lugar
 * de columnas fijas en grid. Mobile sí; tablet sí (drawers desde el borde);
 * desktop no.
 */
export function usaPanelesComoDrawers(bp: BreakpointOpm): boolean {
  return bp !== "desktop";
}

/**
 * Mobile readonly v1: indica si el breakpoint es mobile y el flag de build
 * está activo. Helper testeable; no esconder esta decisión dentro de App.tsx.
 */
export function esMobileLectura(bp: BreakpointOpm, flag: boolean): boolean {
  return bp === "mobile" && flag;
}
