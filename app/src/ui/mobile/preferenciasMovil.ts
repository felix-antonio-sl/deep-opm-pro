/**
 * preferenciasMovil.ts — Persistencia de preferencias UI en mobile readonly.
 *
 * Actualmente solo almacena el toggle "Buscar también en diagnóstico".
 * Clave: `deep-opm.mobile.busqueda.incluirDiagnostico`
 * Default: false
 *
 * Cuando exista auth/tenants real, migrar a:
 *   deep-opm.mobile.<tenantId>.<userId>.busqueda.incluirDiagnostico
 */

const KEY = "deep-opm.mobile.busqueda.incluirDiagnostico";

export function leerIncluirDiagnostico(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw === "true";
  } catch {
    return false;
  }
}

export function guardarIncluirDiagnostico(valor: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (valor) {
      window.localStorage.setItem(KEY, "true");
    } else {
      window.localStorage.removeItem(KEY);
    }
  } catch {
    // Silencio: storage puede estar bloqueado o lleno.
  }
}
