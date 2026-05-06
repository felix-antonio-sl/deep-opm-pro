/**
 * Tipos comunes del modelo OPM compartidos por todos los dominios.
 * Sin dependencias entre sub-archivos de tipos/.
 */

export type Id = string;
export type PestanaId = string;

export interface Posicion {
  x: number;
  y: number;
}

export type Resultado<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };
