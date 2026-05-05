import type { Id, Modelo, Opd } from "../../modelo/tipos";
import { ordenarHermanos } from "../../modelo/opdReorden";

// ─── Descriptor del meta-grafo ──────────────────────────────────────

export interface NodoMapa {
  opdId: Id;
  nombre: string;
  tipoRefinamiento: "descompuesto" | "desplegado" | "raiz";
  bbox: { x: number; y: number; w: number; h: number };
  profundidad: number;
  thumbnailEntidades: number;
  thumbnailEnlaces: number;
  thumbnailProcesos: number;
  thumbnailObjetos: number;
  thumbnailEstados: number;
  estiloResaltado?: EstiloResaltadoMapa;
  marcadorActivo?: boolean;
  marcadorVisitado?: boolean;
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

export type EstiloResaltadoMapa = "verde-lima" | "cyan" | "gris" | "azul" | "naranja";

export type CriterioResaltado =
  | "predominanciaProceso"
  | "predominanciaObjeto"
  | "tieneEstados"
  | "raiz"
  | "ninguno";

export interface EstadisticasModelo {
  totalEntidades: number;
  totalEnlaces: number;
  totalOpds: number;
  profundidadMaxima: number;
  totalRamas: number;
  porTipoCosa: { proceso: number; objeto: number; estados: number };
  porFamiliaEnlace: {
    agregacion: number;
    etiquetado: number;
    procedural: number;
    logico: number;
  };
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
  markup?: Array<{ tagName: string; selector: string }>;
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
          fill: "#70E483",
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

// ─── Lentes derivadas del mapa ──────────────────────────────────────

export function calcularEstadisticas(modelo: Modelo): EstadisticasModelo {
  const descriptor = construirDescriptorMapa(modelo);
  const totalEntidades = Object.keys(modelo.entidades).length;
  const totalEnlaces = Object.keys(modelo.enlaces).length;
  const opdsConHijos = new Set(descriptor.aristas.map((arista) => arista.desdeOpdId));
  const procesos = Object.values(modelo.entidades).filter((entidad) => entidad.tipo === "proceso").length;
  const objetos = Object.values(modelo.entidades).filter((entidad) => entidad.tipo === "objeto").length;
  const enlaces = Object.values(modelo.enlaces);

  return {
    totalEntidades,
    totalEnlaces,
    totalOpds: descriptor.nodos.length,
    profundidadMaxima: descriptor.nodos.reduce((max, nodo) => Math.max(max, nodo.profundidad), 0),
    totalRamas: descriptor.nodos.filter((nodo) => !opdsConHijos.has(nodo.opdId)).length,
    porTipoCosa: {
      proceso: procesos,
      objeto: objetos,
      estados: Object.keys(modelo.estados).length,
    },
    porFamiliaEnlace: {
      agregacion: enlaces.filter((enlace) =>
        enlace.tipo === "agregacion" ||
        enlace.tipo === "exhibicion" ||
        enlace.tipo === "generalizacion" ||
        enlace.tipo === "clasificacion"
      ).length,
      etiquetado: 0,
      procedural: enlaces.filter((enlace) =>
        enlace.tipo === "agente" ||
        enlace.tipo === "instrumento" ||
        enlace.tipo === "consumo" ||
        enlace.tipo === "resultado" ||
        enlace.tipo === "efecto" ||
        enlace.tipo === "invocacion"
      ).length,
      logico: Object.keys(modelo.abanicos ?? {}).length,
    },
  };
}

export function filtrarPorProfundidad(
  descriptor: DescriptorMapa,
  maxProfundidad: number | null,
): DescriptorMapa {
  if (maxProfundidad === null) return clonarDescriptor(descriptor);
  const max = Math.max(1, Math.floor(maxProfundidad));
  const nodos = descriptor.nodos.filter((nodo) => nodo.profundidad <= max);
  return descriptorConNodos(descriptor, nodos);
}

export function filtrarPorSubarbol(
  descriptor: DescriptorMapa,
  raizOpdId: Id | null,
): DescriptorMapa {
  if (!raizOpdId) return clonarDescriptor(descriptor);
  if (!descriptor.nodos.some((nodo) => nodo.opdId === raizOpdId)) {
    return clonarDescriptor(descriptor);
  }
  const visitados = new Set<Id>([raizOpdId]);
  let cambio = true;
  while (cambio) {
    cambio = false;
    for (const arista of descriptor.aristas) {
      if (visitados.has(arista.desdeOpdId) && !visitados.has(arista.haciaOpdId)) {
        visitados.add(arista.haciaOpdId);
        cambio = true;
      }
    }
  }
  const nodos = descriptor.nodos.filter((nodo) => visitados.has(nodo.opdId));
  return descriptorConNodos(descriptor, nodos);
}

export function resaltarPorTipo(
  descriptor: DescriptorMapa,
  criterio: CriterioResaltado,
): DescriptorMapa {
  if (criterio === "ninguno") {
    return {
      ...clonarDescriptor(descriptor),
      nodos: descriptor.nodos.map((nodo) => {
        const { estiloResaltado: _omitido, ...resto } = nodo;
        void _omitido;
        return { ...resto, bbox: { ...nodo.bbox } };
      }),
    };
  }

  return {
    ...clonarDescriptor(descriptor),
    nodos: descriptor.nodos.map((nodo) => ({
      ...nodo,
      estiloResaltado: estiloParaCriterio(nodo, criterio),
    })),
  };
}

export function aplicarMarcadores(
  descriptor: DescriptorMapa,
  opdActivoId: Id | null,
  opdUltimoVisitadoId: Id | null,
): DescriptorMapa {
  return {
    ...clonarDescriptor(descriptor),
    nodos: descriptor.nodos.map((nodo) => ({
      ...nodo,
      marcadorActivo: Boolean(opdActivoId && nodo.opdId === opdActivoId),
      marcadorVisitado: Boolean(opdUltimoVisitadoId && nodo.opdId === opdUltimoVisitadoId && nodo.opdId !== opdActivoId),
    })),
  };
}

function contarEntidadesOpd(modelo: Modelo, opd: Opd, tipo: "objeto" | "proceso"): number {
  return Object.values(opd.apariencias).filter((apariencia) => modelo.entidades[apariencia.entidadId]?.tipo === tipo).length;
}

function contarEstadosOpd(modelo: Modelo, opd: Opd): number {
  const entidadesOpd = new Set(Object.values(opd.apariencias).map((apariencia) => apariencia.entidadId));
  return Object.values(modelo.estados).filter((estado) => entidadesOpd.has(estado.entidadId)).length;
}

function descriptorConNodos(descriptor: DescriptorMapa, nodos: NodoMapa[]): DescriptorMapa {
  const ids = new Set(nodos.map((nodo) => nodo.opdId));
  return recalcularBbox({
    nodos: nodos.map((nodo) => ({ ...nodo })),
    aristas: descriptor.aristas
      .filter((arista) => ids.has(arista.desdeOpdId) && ids.has(arista.haciaOpdId))
      .map((arista) => ({ ...arista })),
    bboxTotal: { ...descriptor.bboxTotal },
  });
}

function clonarDescriptor(descriptor: DescriptorMapa): DescriptorMapa {
  return {
    nodos: descriptor.nodos.map((nodo) => ({ ...nodo, bbox: { ...nodo.bbox } })),
    aristas: descriptor.aristas.map((arista) => ({ ...arista })),
    bboxTotal: { ...descriptor.bboxTotal },
  };
}

function recalcularBbox(descriptor: DescriptorMapa): DescriptorMapa {
  if (descriptor.nodos.length === 0) return { ...descriptor, bboxTotal: { w: NODE_W, h: NODE_H } };
  const minX = Math.min(...descriptor.nodos.map((nodo) => nodo.bbox.x));
  const maxX = Math.max(...descriptor.nodos.map((nodo) => nodo.bbox.x + nodo.bbox.w));
  const maxY = Math.max(...descriptor.nodos.map((nodo) => nodo.bbox.y + nodo.bbox.h));
  return {
    ...descriptor,
    bboxTotal: {
      w: Math.max(NODE_W, maxX - minX + NODE_GAP_X),
      h: Math.max(NODE_H, maxY + NODE_GAP_Y),
    },
  };
}

function estiloParaCriterio(nodo: NodoMapa, criterio: CriterioResaltado): EstiloResaltadoMapa {
  if (criterio === "predominanciaProceso") {
    return nodo.thumbnailProcesos > nodo.thumbnailObjetos ? "cyan" : "gris";
  }
  if (criterio === "predominanciaObjeto") {
    return nodo.thumbnailObjetos >= nodo.thumbnailProcesos && nodo.thumbnailObjetos > 0 ? "verde-lima" : "gris";
  }
  if (criterio === "tieneEstados") {
    return nodo.thumbnailEstados > 0 ? "azul" : "gris";
  }
  if (criterio === "raiz") {
    return nodo.tipoRefinamiento === "raiz" || nodo.profundidad === 1 ? "naranja" : "gris";
  }
  return "gris";
}

function colorResaltado(estilo: EstiloResaltadoMapa | undefined): string {
  if (estilo === "cyan") return "#3BC3FF";
  if (estilo === "verde-lima") return "#70E483";
  if (estilo === "azul") return "#3DA8FF";
  if (estilo === "naranja") return "#FF9F43";
  return "#a0b3c8";
}
