/**
 * CANON-V2 — Paleta OPM Bauhaus lavada (Ronda 28 L4).
 *
 * Decisión de producto crítica:
 *   NO se elimina la heurística cromática OPM en el canvas. Verde objeto /
 *   azul proceso son convención de Dov Dori desde los 90; el modelador
 *   habituado escanea por color primero, forma después. En modelos densos
 *   (HODOM 35 entidades / 102 enlaces) forma rect/ellipse sola no basta.
 *
 * Solución Bauhaus:
 *   - Fills OPM lavados al ~12% saturación (verde/azul papel, casi pastel
 *     grisáceo). Mantienen el canal cromático del canon Dori sin saturar.
 *   - Stroke ink puro `#0A0A0A` (2px). No el viejo gris-azul `#586D8C`.
 *   - Selección cinabrio `#C8392F` + handles cuadrados 6×6 (no círculos).
 *   - Markers diferenciados por tipo de enlace (lollipop, rombo, triángulos).
 *   - Canvas paper `#FAFAFA`, dots `#D2D2D2` (ink-15) cada 8px.
 *
 * Chrome / inspector / OPL siguen Bauhaus puro monocromático (L1-L3).
 * Sólo el canvas conserva el canal cromático OPM lavado.
 *
 * Esta paleta SUSTITUYE a la V1 (`#70E483 #3BC3FF #586D8C #fdffff #000002`).
 * No hay fallback. `constantes.ts` re-exporta desde aquí vía aliasing.
 */

export const CANON_V2 = {
  /** Objeto OPM (rectángulo). */
  objeto: {
    /** Verde papel lavado (sat ~12%). */
    fill: "#EFF7EB",
    /** Stroke ink puro. */
    stroke: "#0A0A0A",
    /** Selección cinabrio. */
    strokeSeleccion: "#C8392F",
  },
  /** Proceso OPM (elipse). */
  proceso: {
    /** Azul papel lavado (sat ~10%). */
    fill: "#E8F0F8",
    stroke: "#0A0A0A",
    strokeSeleccion: "#C8392F",
  },
  /** Enlaces OPM (procedurales y estructurales). */
  enlace: {
    /** Ink puro — sustituye el viejo gris-azul `#586D8C`. */
    stroke: "#0A0A0A",
    /** Selección cinabrio. */
    strokeSeleccion: "#C8392F",
  },
  /** Texto sobre fills lavados. */
  texto: "#0A0A0A",
  /** Texto secundario (etiquetas auxiliares, multiplicidades, modificadores). */
  textoSecundario: "#6E6E6E",
  /** Cápsulas de estado interno (rectángulos dentro de un objeto). */
  estado: {
    /** Paper puro — neutro entre verde objeto y stroke ink. */
    fill: "#FAFAFA",
    stroke: "#0A0A0A",
  },
  /** Fondo del paper JointJS. */
  fondoCanvas: "#FAFAFA",
  /** Dots de cuadrícula (ink-15) cada 8px. */
  cuadriculaDots: "#D2D2D2",
  /**
   * Markers canónicos OPM diferenciados por tipo de enlace (Ronda 28 L4):
   *   - consumo/resultado: swallowtail cerrado con interior paper.
   *   - efecto: swallowtail bidireccional.
   *   - instrumento: lollipop círculo vacío ink fill paper (○).
   *   - agente: lollipop círculo lleno ink (●).
   *   - invocación: rayo en tramo + swallowtail cerrado.
   */
  marcadores: {
    consumo: "swallowtail-paper-ink",
    resultado: "swallowtail-paper-ink",
    efecto: "swallowtail-bidireccional-paper-ink",
    instrumento: "circulo-vacio-ink",
    agente: "circulo-lleno-ink",
    invocacion: "rayo-swallowtail-paper-ink",
  },
  /** Stroke base: 2px (no 1.5; el 1.5 colapsa en densidad). */
  strokeWidth: 2,
  /** Stroke selección: 2.5px. */
  strokeWidthSeleccion: 2.5,
  /** Selección lasso (rubber band) — cinabrio dashed. */
  seleccion: {
    /** Color del borde dashed del lasso. */
    color: "#C8392F",
    /** Fill cinabrio soft al 10% (rgba para alpha real). */
    fill: "rgba(200, 57, 47, 0.10)",
  },
  /** Refinamiento in-zoom (contorno dashed). */
  refinamiento: {
    stroke: "#0A0A0A",
    /** Pattern dashed `8 4`. */
    strokeDasharray: "8 4",
    /** Paper semi-transparente al 96%. */
    fill: "rgba(250, 250, 250, 0.96)",
  },
  /** Tipografía canvas Bauhaus. */
  fuente: {
    /** Inter Tight para labels de entidad (objetos/procesos). */
    familia: '"Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    /** JetBrains Mono para etiquetas de enlace, multiplicidades, estados. */
    familiaMono: '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    /** Peso medium 500 (no semibold/bold). */
    pesoEntidad: 500,
    /** Tamaño label entidad: 13px. */
    tamanoEntidad: 13,
    /** Tamaño label enlace: 10px. */
    tamanoEnlace: 10,
    /** Tamaño estado: 10px JetBrains Mono. */
    tamanoEstado: 10,
  },
} as const;
