import { ordenarOpdsParaOpl } from "../../opl/bloquesJerarquicos";
import { generarOpl } from "../../opl/generar";
import type { Id, Modelo } from "../tipos";

export interface OplBloque {
  opdId: Id;
  opdNombre: string;
  sentencias: string[];
}

/**
 * Wrapper de compatibilidad para scripts antiguos.
 * La fuente canonica de OPL vive en `src/opl/generar.ts`.
 */
export function generarOplEstructurado(modelo: Modelo): OplBloque[] {
  return ordenarOpdsParaOpl(modelo).map((opdId) => ({
    opdId,
    opdNombre: modelo.opds[opdId]?.nombre ?? opdId,
    sentencias: generarOpl(modelo, opdId),
  }));
}

export function generarOplTexto(modelo: Modelo): string {
  return `${generarOplEstructurado(modelo).flatMap((bloque) => bloque.sentencias).join("\n")}\n`;
}
