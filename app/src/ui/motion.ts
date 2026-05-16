export function prefiereReducirMovimiento(matchMediaRef: typeof globalThis.matchMedia | undefined = globalThis.matchMedia): boolean {
  if (typeof matchMediaRef !== "function") return false;
  try {
    return matchMediaRef("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export function scrollBehaviorPreferido(matchMediaRef: typeof globalThis.matchMedia | undefined = globalThis.matchMedia): ScrollBehavior {
  return prefiereReducirMovimiento(matchMediaRef) ? "auto" : "smooth";
}

export function transitionPreferida(valor: string, matchMediaRef: typeof globalThis.matchMedia | undefined = globalThis.matchMedia): string {
  return prefiereReducirMovimiento(matchMediaRef) ? "none" : valor;
}
