import type { DescriptorMapa, EstiloResaltadoMapa, JointCellJson } from "../../../canvas/mapa/tipos";
import { CODEX } from "../constantes.codex";
import { jointCanvasPalette } from "../palette";

/**
 * Proyección JointJS del meta-grafo.
 * Nodos como `standard.Rectangle` con marcadores activo/visitado y estilo
 * resaltado opcional. Aristas como `standard.Link` con estilo neutro
 * (gris dasharray, distinto del estilo OPM).
 *
 * HU-21.004.
 */
export function proyectarMapaSistemaAJointCells(
  descriptor: DescriptorMapa,
): JointCellJson[] {
  const celdas: JointCellJson[] = [];

  for (const nodo of descriptor.nodos) {
    const cellId = `mapa-nodo-${nodo.opdId}`;
    const nombreCorto = nodo.nombre.length > 35
      ? nodo.nombre.slice(0, 32) + "..."
      : nodo.nombre;

    celdas.push({
      id: cellId,
      type: "standard.Rectangle",
      markup: [
        { tagName: "rect", selector: "body" },
        { tagName: "circle", selector: "marcadorActivo" },
        { tagName: "circle", selector: "marcadorVisitado" },
        { tagName: "text", selector: "label" },
      ],
      position: { x: nodo.bbox.x, y: nodo.bbox.y },
      size: { width: nodo.bbox.w, height: nodo.bbox.h },
      z: 1,
      attrs: {
        body: {
          fill: "#ffffff",
          stroke: colorResaltado(nodo.estiloResaltado),
          strokeWidth: nodo.estiloResaltado && nodo.estiloResaltado !== "gris" ? 4 : 2,
          rx: 8,
          ry: 8,
        },
        marcadorActivo: {
          cx: 16,
          cy: 16,
          r: 6,
          // Codex L6 (C-04): marcador OPD activo = crimson editorial (señal de
          // current/selección UI), no lime legacy.
          fill: jointCanvasPalette.seleccion,
          stroke: "#ffffff",
          strokeWidth: 2,
          opacity: nodo.marcadorActivo ? 1 : 0,
        },
        marcadorVisitado: {
          cx: nodo.bbox.w - 16,
          cy: 16,
          r: 6,
          fill: "#CC0A0E",
          stroke: "#ffffff",
          strokeWidth: 2,
          opacity: nodo.marcadorVisitado ? 1 : 0,
        },
        label: {
          text: `${nombreCorto}\n\n${nodo.thumbnailEntidades} cosas · ${nodo.thumbnailEnlaces} enlaces`,
          fill: "#1f2937",
          fontSize: 12,
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
          textVerticalAnchor: "middle",
        },
      },
    });
  }

  for (const arista of descriptor.aristas) {
    const sourceId = `mapa-nodo-${arista.desdeOpdId}`;
    const targetId = `mapa-nodo-${arista.haciaOpdId}`;

    celdas.push({
      id: `mapa-arista-${arista.desdeOpdId}-${arista.haciaOpdId}`,
      type: "standard.Link",
      source: { id: sourceId },
      target: { id: targetId },
      z: 0,
      attrs: {
        line: {
          stroke: "#9ca3af",
          strokeWidth: 2,
          strokeDasharray: "6 3",
          targetMarker: {
            type: "path",
            d: "M 6 -4 L 0 0 L 6 4 z",
            fill: "#9ca3af",
          },
        },
      },
    });
  }

  return celdas;
}

function colorResaltado(estilo: EstiloResaltadoMapa | undefined): string {
  // Codex L6 (C-04): los resaltados del mini-mapa de OPDs ecoan la clase OPM
  // del foco; se mapean al set canónico (constantes.codex / ui-forja tokens),
  // erradicando lime/cyan legacy. `azul`→crimson (selección UI).
  if (estilo === "cyan") return CODEX.colores.opmProceso;
  if (estilo === "verde-lima") return CODEX.colores.opmObjeto;
  if (estilo === "azul") return jointCanvasPalette.seleccion;
  if (estilo === "naranja") return CODEX.colores.opmEstado;
  return CODEX.colores.inkSoft;
}
