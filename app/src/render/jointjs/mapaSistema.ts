import type { Id, Modelo, Opd } from "../../modelo/tipos";
import { ordenarHermanos } from "../../modelo/opdReorden";

// ─── Descriptor del meta-grafo ──────────────────────────────────────

export interface NodoMapa {
  opdId: Id;
  nombre: string;
  tipoRefinamiento: "descompuesto" | "desplegado" | "raiz";
  bbox: { x: number; y: number; w: number; h: number };
  thumbnailEntidades: number;
  thumbnailEnlaces: number;
}

export interface AristaMapa {
  desdeOpdId: Id;
  haciaOpdId: Id;
}

export interface DescriptorMapa {
  nodos: NodoMapa[];
  aristas: AristaMapa[];
  bboxTotal: { w: number; h: number };
}

// ─── Constantes de layout ────────────────────────────────────────────

const NODE_W = 200;
const NODE_H = 150;
const NODE_GAP_X = 60;
const NODE_GAP_Y = 120;

// ─── Construcción del descriptor ─────────────────────────────────────

/**
 * Construye el descriptor del mapa del sistema a partir de un modelo.
 * Produce 1 NodoMapa por OPD + 1 AristaMapa por par (padre, hijo).
 * El layout es árbol vertical: raíz arriba, hijos abajo.
 * HU-21.003.
 */
export function construirDescriptorMapa(modelo: Modelo): DescriptorMapa {
  const raiz = modelo.opds[modelo.opdRaizId];
  if (!raiz) {
    return { nodos: [], aristas: [], bboxTotal: { w: NODE_W, h: NODE_H } };
  }

  const nodos: NodoMapa[] = [];
  const aristas: AristaMapa[] = [];

  // Construir árbol: nodo con hijos ordenados
  interface TreeNode {
    opd: Opd;
    hijos: TreeNode[];
    depth: number;
    breadthOffset: number;
  }

  // Obtener hijos directos de un OPD (los que tienen `padreId === opd.id`)
  // y ordenarlos según ordenLocal o alfabético
  function hijosDe(padreId: Id): Opd[] {
    const hijos = Object.values(modelo.opds).filter(
      (opd) => opd.padreId === padreId,
    );
    const idsOrdenados = ordenarHermanos(hijos);
    return idsOrdenados.map((id) => modelo.opds[id]!).filter(Boolean);
  }

  function armarArbol(opd: Opd, depth: number, offset: number): TreeNode {
    const children = hijosDe(opd.id);
    let currentOffset = 0;
    const arbolHijos: TreeNode[] = [];

    for (const hijo of children) {
      const arbolHijo = armarArbol(hijo, depth + 1, currentOffset);
      arbolHijos.push(arbolHijo);
      currentOffset += subarbolWidth(arbolHijo);
    }

    // Calcular el breadthOffset del nodo actual
    const miBreadthOffset =
      arbolHijos.length > 0
        ? arbolHijos[0]!.breadthOffset +
          (arbolHijos[arbolHijos.length - 1]!.breadthOffset -
            arbolHijos[0]!.breadthOffset) /
            2
        : offset;

    return { opd, hijos: arbolHijos, depth, breadthOffset: miBreadthOffset };
  }

  function subarbolWidth(nodo: TreeNode): number {
    if (nodo.hijos.length === 0) return NODE_W + NODE_GAP_X;
    return nodo.hijos.reduce((sum, h) => sum + subarbolWidth(h), 0);
  }

  const arbolRaiz = armarArbol(raiz, 0, 0);

  // Aplanar árbol para producir nodos y aristas
  const cola: TreeNode[] = [arbolRaiz];

  while (cola.length > 0) {
    const actual = cola.shift()!;
    const tipo: NodoMapa["tipoRefinamiento"] =
      actual.depth === 0
        ? "raiz"
        : actual.opd.padreId
          ? tieneRefinamientoTipo(modelo, actual.opd)
          : "raiz";

    nodos.push({
      opdId: actual.opd.id,
      nombre: nombreVisible(modelo, actual.opd),
      tipoRefinamiento: tipo,
      bbox: {
        x: actual.breadthOffset,
        y: actual.depth * (NODE_H + NODE_GAP_Y),
        w: NODE_W,
        h: NODE_H,
      },
      thumbnailEntidades: Object.keys(actual.opd.apariencias).length,
      thumbnailEnlaces: Object.keys(actual.opd.enlaces).length,
    });

    for (const hijo of actual.hijos) {
      aristas.push({
        desdeOpdId: actual.opd.id,
        haciaOpdId: hijo.opd.id,
      });
      cola.push(hijo);
    }
  }

  // Calcular bboxTotal
  const xs = nodos.map((n) => n.bbox.x);
  const ys = nodos.map((n) => n.bbox.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs) + NODE_W;
  const maxY = Math.max(...ys) + NODE_H;

  return {
    nodos,
    aristas,
    bboxTotal: {
      w: Math.max(NODE_W, maxX - minX + NODE_GAP_X),
      h: Math.max(NODE_H, maxY + NODE_GAP_Y),
    },
  };
}

// ─── Ayudantes ───────────────────────────────────────────────────────

function tieneRefinamientoTipo(modelo: Modelo, opd: Opd): NodoMapa["tipoRefinamiento"] {
  const refinador = Object.values(modelo.entidades).find(
    (entidad) => entidad.refinamiento?.opdId === opd.id,
  );
  if (!refinador?.refinamiento) return "raiz";
  return refinador.refinamiento.tipo === "despliegue"
    ? "desplegado"
    : "descompuesto";
}

function nombreVisible(modelo: Modelo, opd: Opd): string {
  const refinador = Object.values(modelo.entidades).find(
    (entidad) => entidad.refinamiento?.opdId === opd.id,
  );
  if (refinador) {
    const sufijo =
      refinador.refinamiento?.tipo === "despliegue" ? "desplegado" : "descompuesto";
    const codigo = /^SD(?:\d+(?:\.\d+)*)?/.exec(opd.nombre.trim())?.[0] ?? opd.nombre;
    return `${codigo}: ${refinador.nombre} ${sufijo}`;
  }
  return opd.nombre;
}

// ─── Proyección JointJS para el meta-grafo ───────────────────────────

export interface JointCellJson {
  id: string;
  type: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  attrs?: Record<string, unknown>;
  z?: number;
  source?: { id: string };
  target?: { id: string };
}

/**
 * Proyecta el descriptor de mapa del sistema a celdas JointJS.
 * Los nodos son `standard.Rectangle` con nombre + contadores.
 * Las aristas son `standard.Link` con estilo neutro (gris, línea simple,
 * marker triangular pequeño) — distinto del estilo OPM.
 * HU-21.004: flechas con estilo neutro, no enlaces OPM.
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
      position: { x: nodo.bbox.x, y: nodo.bbox.y },
      size: { width: nodo.bbox.w, height: nodo.bbox.h },
      z: 1,
      attrs: {
        body: {
          fill: "#ffffff",
          stroke: "#a0b3c8",
          strokeWidth: 2,
          rx: 8,
          ry: 8,
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
          strokeDasharray: "6 3", // línea punteada para diferenciar de enlaces OPM
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
