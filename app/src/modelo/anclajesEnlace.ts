import type { Apariencia, Posicion, PuertoApariencia } from "./tipos";

export const ANCLAS_RELOJ_ENLACE = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"] as const;

export type AnclaRelojEnlace = (typeof ANCLAS_RELOJ_ENLACE)[number];

export interface OpcionAnclaRelojEnlace {
  id: AnclaRelojEnlace;
  hora: "12:00" | "13:30" | "15:00" | "16:30" | "18:00" | "19:30" | "21:00" | "22:30";
  label: string;
}

export const OPCIONES_ANCLA_RELOJ_ENLACE: readonly OpcionAnclaRelojEnlace[] = [
  { id: "N", hora: "12:00", label: "12:00" },
  { id: "NE", hora: "13:30", label: "13:30" },
  { id: "E", hora: "15:00", label: "15:00" },
  { id: "SE", hora: "16:30", label: "16:30" },
  { id: "S", hora: "18:00", label: "18:00" },
  { id: "SO", hora: "19:30", label: "19:30" },
  { id: "O", hora: "21:00", label: "21:00" },
  { id: "NO", hora: "22:30", label: "22:30" },
] as const;

export function esAnclaRelojEnlace(valor: string | null | undefined): valor is AnclaRelojEnlace {
  return ANCLAS_RELOJ_ENLACE.includes(valor as AnclaRelojEnlace);
}

export function puertoRelativoAnclaEnlace(ancla: AnclaRelojEnlace): PuertoApariencia {
  switch (ancla) {
    case "N":
      return { x: 0.5, y: 0 };
    case "NE":
      return { x: 1, y: 0 };
    case "E":
      return { x: 1, y: 0.5 };
    case "SE":
      return { x: 1, y: 1 };
    case "S":
      return { x: 0.5, y: 1 };
    case "SO":
      return { x: 0, y: 1 };
    case "O":
      return { x: 0, y: 0.5 };
    case "NO":
      return { x: 0, y: 0 };
  }
}

export function anclaEnlaceMasCercana(puerto: PuertoApariencia): AnclaRelojEnlace {
  return ANCLAS_RELOJ_ENLACE.reduce((mejor, candidato) => {
    const puntoMejor = puertoRelativoAnclaEnlace(mejor);
    const puntoCandidato = puertoRelativoAnclaEnlace(candidato);
    return distancia2(puerto, puntoCandidato) < distancia2(puerto, puntoMejor) ? candidato : mejor;
  }, "N" as AnclaRelojEnlace);
}

export function anclaEnlaceMasCercanaAPunto(apariencia: Apariencia, punto: Posicion): AnclaRelojEnlace {
  return anclaEnlaceMasCercana({
    x: (punto.x - apariencia.x) / apariencia.width,
    y: (punto.y - apariencia.y) / apariencia.height,
  });
}

function distancia2(a: PuertoApariencia, b: PuertoApariencia): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}
