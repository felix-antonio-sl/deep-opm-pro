import type { Id } from "../tipos";
import type { ContextoSimulacion } from "./tipos";

/**
 * F-D3 (Cost-category) — el enriquecimiento cuantitativo de OPM como categoría
 * enriquecida sobre el monoide de costos, NO como agregación estadística.
 *
 * Cost = ([0, ∞], ≥, 0, +) es el espacio métrico de Lawvere (`icas-enriquecimiento`):
 * el hom-object X(x, y) es el costo (duración acumulada) de ir de x a y, con
 * X(x, x) = 0 (unidad del monoide) y X(x, y) + X(y, z) ≥ X(x, z) (desigualdad
 * triangular). La composición de la categoría ES la suma del monoide.
 *
 * Conexión con `icas-adjunciones`: la traza de simulación es el monoide libre de
 * pasos; `costoDeCamino = foldMap(duración)` es el homomorfismo canónico de ese
 * monoide libre al monoide de costos. Complementa (no reemplaza) el resumen
 * estadístico de `enriquecimiento.ts`: aquí está la ESTRUCTURA, allí los agregados.
 */

/** Unidad del monoide de costos: la distancia de un punto a sí mismo. */
export const COSTO_IDENTIDAD = 0;
/** Costo de un par sin camino: el ∞ del orden invertido de Cost. */
export const COSTO_INALCANZABLE = Infinity;

/** El tensor del monoide de costos: ⊗ = + (composición de la Cost-category). */
export function componerCosto(a: number, b: number): number {
  return a + b;
}

/**
 * `foldMap(duración)`: homomorfismo del monoide libre de pasos de una corrida al
 * monoide de costos. El costo total de un camino es la suma de las duraciones de
 * sus pasos (unidad = 0 para la traza vacía).
 */
export function costoDeCamino(corrida: ContextoSimulacion): number {
  return corrida.trace.reduce((acc, paso) => componerCosto(acc, paso.duracion ?? 0), COSTO_IDENTIDAD);
}

export interface AristaCosto {
  origen: Id;
  destino: Id;
  costo: number;
}

/**
 * Aristas pesadas (estadoAntes → estadoDespués, costo = duración del paso) que la
 * traza de una corrida genera. Son los generadores de la Cost-category sobre el
 * grafo de transición de estados.
 */
export function aristasDeCorrida(corrida: ContextoSimulacion): AristaCosto[] {
  const aristas: AristaCosto[] = [];
  for (const paso of corrida.trace) {
    const costo = paso.duracion ?? 0;
    for (const transicion of paso.transicionesAplicadas) {
      if (transicion.estadoAntesId && transicion.estadoDespuesId) {
        aristas.push({ origen: transicion.estadoAntesId, destino: transicion.estadoDespuesId, costo });
      }
    }
  }
  return aristas;
}

export interface CategoriaCosto {
  objetos: Id[];
  /** hom-object X(origen, destino) ∈ [0, ∞] = costo mínimo del camino. */
  hom(origen: Id, destino: Id): number;
}

/**
 * Construye la categoría enriquecida en Cost: objetos = estados, hom-object
 * X(x, y) = costo mínimo del camino vía cerradura (min, +) (Floyd-Warshall sobre
 * el semianillo tropical). Satisface POR CONSTRUCCIÓN la identidad X(x, x) = 0 y
 * la desigualdad triangular X(x, z) ≤ X(x, y) + X(y, z); el costo directo más caro
 * que un rodeo se corrige al shortest-path (corpus: X(A,C)=min(10, 3+2)=5).
 */
export function categoriaDeCosto(objetos: Id[], aristas: AristaCosto[]): CategoriaCosto {
  const indice = new Map<Id, number>();
  objetos.forEach((objeto, i) => indice.set(objeto, i));
  const n = objetos.length;
  const dist: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? COSTO_IDENTIDAD : COSTO_INALCANZABLE)),
  );

  for (const arista of aristas) {
    const i = indice.get(arista.origen);
    const j = indice.get(arista.destino);
    if (i === undefined || j === undefined) continue;
    dist[i]![j] = Math.min(dist[i]![j]!, arista.costo); // min sobre aristas paralelas
  }

  // Cerradura (min, +): la composición transitiva de la Cost-category.
  for (let k = 0; k < n; k += 1) {
    for (let i = 0; i < n; i += 1) {
      for (let j = 0; j < n; j += 1) {
        const via = componerCosto(dist[i]![k]!, dist[k]![j]!);
        if (via < dist[i]![j]!) dist[i]![j] = via;
      }
    }
  }

  return {
    objetos,
    hom(origen, destino) {
      const i = indice.get(origen);
      const j = indice.get(destino);
      if (i === undefined || j === undefined) return COSTO_INALCANZABLE;
      return dist[i]![j]!;
    },
  };
}

/** Categoría de costo derivada directamente de una o más corridas de simulación. */
export function categoriaDeCostoDeCorridas(corridas: ContextoSimulacion[]): CategoriaCosto {
  const aristas = corridas.flatMap(aristasDeCorrida);
  const objetos = [...new Set(aristas.flatMap((a) => [a.origen, a.destino]))];
  return categoriaDeCosto(objetos, aristas);
}
