// Primitiva de plegado de secciones del Inspector con memoria de SESIÓN.
//
// M-4 (re-auditoría 2026-07-07): la ficha del Inspector se apilaba siempre
// expandida (1803px en 852px). Esta primitiva da estado abierto/plegado por
// sección, persistido en `sessionStorage` (sobrevive la sesión, nace limpio en
// la siguiente — memoria de sesión, no cross-sesión). Sin DOM/JointJS: lógica
// pura testeable; el toggle/render lo cubre `browser:smoke`.

const PREFIJO = "opm.inspector.colapso.";

/** Evento que fuerza a abrir una sección por su clave (expandir-al-navegar). */
export const EVENTO_ABRIR_COLAPSO = "opm:inspector-abrir-colapso";

export function claveColapso(id: string): string {
  return PREFIJO + id;
}

function almacen(): Storage | null {
  try {
    return typeof sessionStorage !== "undefined" ? sessionStorage : null;
  } catch {
    // sessionStorage puede lanzar en contextos con storage bloqueado.
    return null;
  }
}

/** Estado abierto de una sección; `pordefecto` si no hay entrada de sesión. */
export function leerAbierta(id: string, pordefecto: boolean): boolean {
  const s = almacen();
  if (!s) return pordefecto;
  const v = s.getItem(claveColapso(id));
  if (v === null || v === undefined) return pordefecto;
  return v === "1";
}

export function escribirAbierta(id: string, abierta: boolean): void {
  const s = almacen();
  if (!s) return;
  try {
    s.setItem(claveColapso(id), abierta ? "1" : "0");
  } catch {
    // cuota / modo privado: la memoria de sesión es best-effort.
  }
}

function despacharAbrir(key: string): void {
  if (typeof window === "undefined" || typeof window.dispatchEvent !== "function") return;
  const evento = typeof CustomEvent === "function"
    ? new CustomEvent(EVENTO_ABRIR_COLAPSO, { detail: { key } })
    : ({ type: EVENTO_ABRIR_COLAPSO, detail: { key } } as unknown as Event);
  window.dispatchEvent(evento);
}

/**
 * Sube por los ancestros con `data-colapso-key` desde `el`, marca cada uno como
 * abierto en sesión y despacha `EVENTO_ABRIR_COLAPSO` para que la sección se
 * expanda ya montada. Lo usan las quick-actions que enfocan una sección que
 * pudo quedar plegada (p. ej. «alias» dentro del disclosure «Avanzado»).
 */
export function abrirSeccionesDe(el: HTMLElement | null): void {
  let nodo: HTMLElement | null = el;
  while (nodo) {
    const key = typeof nodo.getAttribute === "function" ? nodo.getAttribute("data-colapso-key") : null;
    if (key) {
      escribirAbierta(key, true);
      despacharAbrir(key);
    }
    nodo = nodo.parentElement;
  }
}
