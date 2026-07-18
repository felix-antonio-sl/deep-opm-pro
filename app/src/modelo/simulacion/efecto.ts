/**
 * Contenedor de sucesores de un paso de simulación. Admite una lectura
 * coalgebraica bajo hipótesis adicionales, pero este tipo solo implementa la
 * estructura operativa: un sucesor de peso 1 en modo determinista o sucesores
 * alternativos ponderados para exploración y muestreo.
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
