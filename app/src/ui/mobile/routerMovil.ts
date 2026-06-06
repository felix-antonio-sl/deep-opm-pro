/**
 * routerMovil.ts — Parser de rutas mobile readonly.
 *
 * Rutas válidas:
 *   /m/:modeloId
 *   /m/:modeloId/opd/:opdId
 *   /m/:modeloId/vista/:vista
 *   /m/:modeloId/opd/:opdId/vista/:vista
 *
 * Donde vista ∈ {diagrama, opds, opl, acerca}.
 * Segments vacíos o malformados se ignoran con fallback.
 */

export interface RutaMobileLectura {
  modeloId: string;
  opdId: string | null;
  vista: string | null;
}

/** Regex permisiva para IDs: alfanumérico, guiones, puntos, dos puntos. */
const ID_SEGMENT_RE = /^[A-Za-z0-9._:-]{1,128}$/;

export const VISTAS_VALIDAS = new Set(["diagrama", "opds", "opl", "acerca"]);

/**
 * Parsea la ruta actual del navegador. Devuelve null si la ruta
 * no empieza por /m/ o está vacía.
 */
export function parsearRutaMobile(): RutaMobileLectura | null {
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  return parsearPathMobile(path);
}

export function parsearPathMobile(path: string): RutaMobileLectura | null {
  if (!path.startsWith("/m/")) return null;
  const sinPrefijo = path.slice(3); // quita /m/
  if (sinPrefijo.length === 0) return null;

  const partes = sinPrefijo.split("/").map((s) => decodeURIComponent(s));
  const modeloId = partes[0] ?? "";
  if (!ID_SEGMENT_RE.test(modeloId)) return null;

  let opdId: string | null = null;
  let vista: string | null = null;

  let i = 1;
  while (i < partes.length) {
    const clave = partes[i];
    const valor = partes[i + 1];

    if (clave === "opd" && valor !== undefined && ID_SEGMENT_RE.test(valor)) {
      opdId = valor;
      i += 2;
      continue;
    }
    if (clave === "vista" && valor !== undefined && VISTAS_VALIDAS.has(valor)) {
      vista = valor;
      i += 2;
      continue;
    }
    // Segmento no reconocido: abortar parseo pero devolver lo que ya tenemos
    break;
  }

  return { modeloId, opdId, vista };
}

export function construirPathMobile(ruta: Omit<RutaMobileLectura, "vista"> & { vista?: string | null }): string {
  let path = `/m/${encodeURIComponent(ruta.modeloId)}`;
  if (ruta.opdId) {
    path += `/opd/${encodeURIComponent(ruta.opdId)}`;
  }
  if (ruta.vista && VISTAS_VALIDAS.has(ruta.vista)) {
    path += `/vista/${encodeURIComponent(ruta.vista)}`;
  }
  return path;
}

/** Normaliza la ruta actual con replaceState si difiere del canonical. */
export function normalizarUrlMobile(ruta: RutaMobileLectura): void {
  if (typeof window === "undefined") return;
  const canonical = construirPathMobile(ruta);
  if (window.location.pathname !== canonical) {
    window.history.replaceState(null, "", canonical);
  }
}

/** Escribe la ruta con pushState (cuando el usuario navega internamente). */
export function empujarUrlMobile(ruta: RutaMobileLectura): void {
  if (typeof window === "undefined") return;
  const canonical = construirPathMobile(ruta);
  if (window.location.pathname !== canonical) {
    window.history.pushState(null, "", canonical);
  }
}
