/**
 * Functor de efecto de la simulacion. La simulacion es el unfold (anamorfismo)
 * de una coalgebra `paso : EstadoSistema -> F(EstadoSistema)`; `Efecto<T>` ES ese
 * F. En el modo determinista (F = Identidad) hay exactamente un sucesor con
 * peso 1. S2 lo extendera: Powerset (varios sucesores, exhaustivo) y Dist
 * (sucesores con peso = probabilidad, muestreo). Ver
 * docs/roadmap/simulacion-categorial-opforja.md S3.
 */
export interface Sucesor<T> {
  estado: T;
  rama?: string;
  peso?: number;
}

export interface Efecto<T> {
  sucesores: Sucesor<T>[];
}

export function efectoUnico<T>(estado: T): Efecto<T> {
  return { sucesores: [{ estado, peso: 1 }] };
}

export function tomarUnico<T>(efecto: Efecto<T>): T {
  const primero = efecto.sucesores[0];
  if (!primero) throw new Error("Efecto de simulacion sin sucesores");
  return primero.estado;
}
