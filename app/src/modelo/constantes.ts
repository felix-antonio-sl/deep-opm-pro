import type { TipoEnlace } from "./tipos";
import { CANON_V2 } from "./constantes.bauhaus";

export type TipoEnlaceExcepcionTemporal = Extract<
  TipoEnlace,
  "excepcionSobretiempo" | "excepcionSubtiempo" | "excepcionSubSobretiempo"
>;

/**
 * CANON — Constantes canonicas del canvas OPM.
 *
 * Ronda 28 L4 (CANON-V2 Bauhaus): la paleta es aliasing directo al
 * `CANON_V2` (modelo/constantes.bauhaus.ts). Sustitucion completa, sin
 * flag de fallback. La V1 (#70E483 / #3BC3FF / #586D8C / #fdffff / #000002)
 * esta retirada — todos los composers leen V2 a traves de este shim.
 *
 * Notas de aliasing:
 *   - `colores.objeto` ahora es el FILL lavado del objeto (verde papel).
 *     Antes era el stroke verde clasico. Bajo V2 el stroke default de
 *     objetos viene de `colores.enlace` (ink); composers/entidad.ts hizo
 *     el ajuste explicitamente. Si un usuario fijo `apariencia.estilo`
 *     con `borderColor`/`fill`, sigue dominando (override persistido).
 *   - `colores.proceso` ahora es el FILL azul papel lavado del proceso.
 *   - `colores.enlace` ahora es ink puro `#0A0A0A` — todos los markers,
 *     etiquetas auxiliares y rejillas estructurales se renderizan con el.
 *   - `colores.relleno` ahora es paper `#FAFAFA`.
 *   - `colores.texto` es ink puro.
 *   - `dims.fontFamily` migra a Inter Tight (Bauhaus self-hosted, L1).
 *   - `dims.fontSize` baja de 14 a 13 (escala Bauhaus L1).
 *   - `dims.fontWeight` baja de 600 (semibold) a 500 (medium) — peso
 *     Bauhaus para labels de entidad.
 */
export const CANON = {
  colores: {
    objeto: CANON_V2.objeto.fill,
    proceso: CANON_V2.proceso.fill,
    enlace: CANON_V2.enlace.stroke,
    relleno: CANON_V2.estado.fill,
    texto: CANON_V2.texto,
  },
  dims: {
    cosaWidth: 135,
    cosaHeight: 60,
    enlaceVisible: CANON_V2.strokeWidth,
    enlaceHitArea: 15,
    fontSize: 13,
    fontWeight: 500,
    fontFamily: CANON_V2.fuente.familia,
  },
} as const;

export { CANON_V2 } from "./constantes.bauhaus";

export type NaturalezaEnlace = "estructural" | "procedural";

export function naturalezaDeEnlace(tipo: TipoEnlace): NaturalezaEnlace {
  return esEnlaceEstructural(tipo)
    ? "estructural"
    : "procedural";
}

export function esEnlaceEstructural(tipo: TipoEnlace): boolean {
  return esEnlaceEstructuralFundamental(tipo) || esEnlaceEstructuralEtiquetado(tipo);
}

export function esEnlaceEstructuralFundamental(tipo: TipoEnlace): boolean {
  return tipo === "agregacion" ||
    tipo === "exhibicion" ||
    tipo === "generalizacion" ||
    tipo === "clasificacion";
}

export function esEnlaceEstructuralEtiquetado(tipo: TipoEnlace): boolean {
  return tipo === "etiquetado" || tipo === "etiquetadoBidireccional";
}

export function enlaceAdmiteTasa(tipo: TipoEnlace): boolean {
  return tipo === "consumo" || tipo === "resultado" || tipo === "efecto";
}

export function esEnlaceExcepcionTemporal(tipo: TipoEnlace): tipo is TipoEnlaceExcepcionTemporal {
  return tipo === "excepcionSobretiempo" ||
    tipo === "excepcionSubtiempo" ||
    tipo === "excepcionSubSobretiempo";
}

export function enlaceAdmiteTiempoMaximo(tipo: TipoEnlace): boolean {
  return tipo === "excepcionSobretiempo" || tipo === "excepcionSubSobretiempo";
}

export function enlaceAdmiteTiempoMinimo(tipo: TipoEnlace): boolean {
  return tipo === "excepcionSubtiempo" || tipo === "excepcionSubSobretiempo";
}
