import type { TipoEnlace } from "./tipos";

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
  return tipo === "agregacion" ||
    tipo === "exhibicion" ||
    tipo === "generalizacion" ||
    tipo === "clasificacion"
    ? "estructural"
    : "procedural";
}
