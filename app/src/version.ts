// Versión de opforja para mostrarla discretamente en la UI (footer del panel
// de Atajos). Los globals los inyecta `vite.config.ts` vía `define` en el build:
// la FECHA se computa al construir (calver ISO, coherente con la convención de
// fechas del host) y el BUILD (short SHA) llega por el arg `VITE_OPFORJA_BUILD`.
// En dev/test los globals no existen; `typeof` sobre un identificador sin bindear
// es seguro (no lanza ReferenceError) y caemos a los valores de desarrollo.
declare const __OPFORJA_FECHA__: string | undefined;
declare const __OPFORJA_BUILD__: string | undefined;

/** Fecha de build en ISO (`AAAA-MM-DD`), o `dev` fuera del build de producción. */
export const OPFORJA_FECHA: string =
  typeof __OPFORJA_FECHA__ !== "undefined" ? __OPFORJA_FECHA__ : "dev";

/** Identificador de build (short SHA del commit desplegado), o `local`. */
export const OPFORJA_BUILD: string =
  typeof __OPFORJA_BUILD__ !== "undefined" ? __OPFORJA_BUILD__ : "local";

/** Etiqueta compacta para la superficie visible; el SHA queda para el `title`. */
export const OPFORJA_VERSION: string = OPFORJA_FECHA;
