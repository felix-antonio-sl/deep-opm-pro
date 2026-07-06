/**
 * Especie de un record de persistencia, decodificada UNA vez al borde de
 * lectura desde los dos flags aditivos existentes (esApunte/esBiblioteca).
 * Fundación del programa «experiencia ágil mesa↔skill» (comité 2026-07-06):
 * concentra el decode que si no se dispersaría por CLI/gestor/graduación (O(N²)).
 * NO toca el encoding — migrar los dos booleanos a un discriminado está
 * prohibido antes del 3er flag de especie (CLAUDE.md §Deuda categorial).
 * La forma futura del discriminado es el producto rigor×rol restringido, no
 * un coproducto plano de 3 (spec 2026-07-06-apuntes-taller-design.md §2-bis).
 */
export type Especie = "apunte" | "modelo" | "biblioteca";

export function especieDe(record: { esApunte?: boolean; esBiblioteca?: boolean }): Especie {
  if (record.esApunte) return "apunte";
  if (record.esBiblioteca) return "biblioteca";
  return "modelo";
}
