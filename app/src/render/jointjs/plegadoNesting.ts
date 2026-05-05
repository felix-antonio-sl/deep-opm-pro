import { filasPlegadoParcial, partePlegadaTienePartes, type FilaPlegadoParcial } from "../../modelo/plegado";
import type { Id, Modelo } from "../../modelo/tipos";

export type FilaPlegadoParcialExtendida =
  | (Extract<FilaPlegadoParcial, { tipo: "parte" }> & { tienePartes: boolean; indicadorNesting?: "▸" })
  | Extract<FilaPlegadoParcial, { tipo: "contador" }>;

export function filasPlegadoConNesting(args: {
  modelo: Modelo;
  opdId: Id;
  padreAparienciaId: Id;
}): FilaPlegadoParcialExtendida[] {
  return filasPlegadoParcial(args.modelo, args.opdId, args.padreAparienciaId).map((fila) => {
    if (fila.tipo !== "parte") return fila;
    const tienePartes = partePlegadaTienePartes(args.modelo, fila.entidadId);
    return {
      ...fila,
      tienePartes,
      ...(tienePartes ? { indicadorNesting: "▸" as const } : {}),
    };
  });
}
