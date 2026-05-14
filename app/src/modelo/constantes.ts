import type { TipoEnlace } from "./tipos";

export type TipoEnlaceExcepcionTemporal = Extract<
  TipoEnlace,
  "excepcionSobretiempo" | "excepcionSubtiempo" | "excepcionSubSobretiempo"
>;

export const CANON = {
  colores: {
    objeto: "#70E483",
    proceso: "#3BC3FF",
    enlace: "#586D8C",
    relleno: "#fdffff",
    texto: "#000002",
  },
  dims: {
    cosaWidth: 135,
    cosaHeight: 60,
    enlaceVisible: 2,
    enlaceHitArea: 15,
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "Arial",
  },
} as const;

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
