import type { VersionResumen } from "../modelo/tipos";

/** El CLI de agente etiqueta cada push `agente·<nota>` (mesa-cli.ts). */
export function esVersionDeAgente(v: VersionResumen): boolean {
  return v.nombre.startsWith("agente·");
}

export type FilaHistorial =
  | { tipo: "individual"; version: VersionResumen }
  | { tipo: "sesion-agente"; versiones: VersionResumen[]; desde: string; hasta: string };

/**
 * Agrupa corridas CONSECUTIVAS de versiones de agente en un hito colapsable.
 * El orden de entrada se preserva (el caller entrega desc por `creadoEn`).
 * Una «sesión» = maximal run de versiones `agente·` sin versión humana en medio.
 * `hasta` = más nueva de la corrida, `desde` = más antigua (extremos por creadoEn).
 * El pre-agente (ancla de rollback) es la fila individual siguiente en el orden desc.
 */
export function agruparHistorialPorSesionAgente(versiones: VersionResumen[]): FilaHistorial[] {
  const filas: FilaHistorial[] = [];
  let corrida: VersionResumen[] = [];
  const cerrar = () => {
    if (corrida.length === 0) return;
    const fechas = corrida.map((v) => v.creadoEn);
    filas.push({ tipo: "sesion-agente", versiones: corrida, desde: minStr(fechas), hasta: maxStr(fechas) });
    corrida = [];
  };
  for (const version of versiones) {
    if (esVersionDeAgente(version)) {
      corrida.push(version);
    } else {
      cerrar();
      filas.push({ tipo: "individual", version });
    }
  }
  cerrar();
  return filas;
}

function minStr(xs: string[]): string {
  return xs.reduce((a, b) => (a <= b ? a : b));
}
function maxStr(xs: string[]): string {
  return xs.reduce((a, b) => (a >= b ? a : b));
}
