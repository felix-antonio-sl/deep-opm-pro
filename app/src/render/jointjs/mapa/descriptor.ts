import type { Id, Modelo, Opd } from "../../../modelo/tipos";
import { ordenarHermanos } from "../../../modelo/opdReorden";
import {
  NODE_GAP_X,
  NODE_GAP_Y,
  NODE_H,
  NODE_W,
  type AristaMapa,
  type DescriptorMapa,
  type NodoMapa,
} from "./tipos";

/**
 * Construcción del descriptor del meta-grafo del mapa del sistema.
 * Produce 1 NodoMapa por OPD + 1 AristaMapa por par (padre, hijo).
 * Layout: árbol vertical, raíz arriba.
 *
 * HU-21.003.
 */
export function construirDescriptorMapa(modelo: Modelo): DescriptorMapa {
  const raiz = modelo.opds[modelo.opdRaizId];
  if (!raiz) {
    return { nodos: [], aristas: [], bboxTotal: { w: NODE_W, h: NODE_H } };
  }

  const nodos: NodoMapa[] = [];
  const aristas: AristaMapa[] = [];

  interface TreeNode {
    opd: Opd;
    hijos: TreeNode[];
    depth: number;
    breadthOffset: number;
  }

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
      profundidad: actual.depth + 1,
      thumbnailEntidades: Object.keys(actual.opd.apariencias).length,
      thumbnailEnlaces: Object.keys(actual.opd.enlaces).length,
      thumbnailProcesos: contarEntidadesOpd(modelo, actual.opd, "proceso"),
      thumbnailObjetos: contarEntidadesOpd(modelo, actual.opd, "objeto"),
      thumbnailEstados: contarEstadosOpd(modelo, actual.opd),
    });

    for (const hijo of actual.hijos) {
      aristas.push({
        desdeOpdId: actual.opd.id,
        haciaOpdId: hijo.opd.id,
      });
      cola.push(hijo);
    }
  }

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

function contarEntidadesOpd(modelo: Modelo, opd: Opd, tipo: "objeto" | "proceso"): number {
  return Object.values(opd.apariencias).filter((apariencia) => modelo.entidades[apariencia.entidadId]?.tipo === tipo).length;
}

function contarEstadosOpd(modelo: Modelo, opd: Opd): number {
  const entidadesOpd = new Set(Object.values(opd.apariencias).map((apariencia) => apariencia.entidadId));
  return Object.values(modelo.estados).filter((estado) => entidadesOpd.has(estado.entidadId)).length;
}
