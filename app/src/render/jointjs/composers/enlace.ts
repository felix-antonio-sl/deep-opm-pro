import { CANON } from "../../../modelo/constantes";
import { etiquetaEnlaceNormalizada } from "../../../modelo/etiquetasEnlace";
import { entidadIdDeExtremo } from "../../../modelo/extremos";
import { modoPlegadoApariencia, partesDePlegado } from "../../../modelo/plegado";
import type { Apariencia, Enlace, ExtremoEnlace, Id, Modelo, Posicion, TipoEnlace } from "../../../modelo/tipos";
import { etiquetasRuta } from "../rutaLabels";
import type { JointCellJson, OpmJointMetadata } from "../proyeccionTipos";
import { selectorCapsulaEstado } from "./estados";
import { etiquetaBadgeModificadorCanonico, marcadorDestino, marcadorFuente, marcadoresEstructurales, textoSubtipoModificador } from "./markers";

/**
 * Composer de enlaces OPM: endpoints, etiquetas, rutas, vertices,
 * refinamientos estructurales sinteticos y proxies de plegado.
 * Consumidor: proyeccion.ts.
 *
 * BUG-1fc4d2 (estados): un enlace que apunta a un estado interno se resuelve
 * via `endpoint.selectorEstado = "stateCapsuleN"` (sub-elemento del cell
 * padre montado por composers/entidad.ts). El endpoint JointJS resultante es
 * `{ id: aparienciaPadre, selector, anchor, connectionPoint }`, lo cual:
 *   1. Termina la flecha en el sub-rect de la capsula (no en el bbox padre).
 *   2. Reposiciona el extremo automaticamente en cada drag (id-based, no
 *      punto literal {x,y}).
 *   3. Permite subir el `z` del link a 20 (encima del padre con z=10) para
 *      que la linea no quede oculta por el contorno del Objeto contenedor.
 */
export interface EndpointVisual {
  apariencia: Apariencia;
  proxy?: { entidadId: Id; nombre: string };
  selectorEstado?: string;
  /**
   * Mantenido como compat para callers historicos (busesAgregacion). No se
   * popula en el flujo a-estado porque los enlaces a estado nunca pueden
   * formar parte de un bus de agregacion (regla OPM).
   */
  punto?: Posicion;
}

export function resolverEndpointVisual(
  modelo: Modelo,
  opd: { apariencias: Record<Id, Apariencia> },
  aparienciaPorEntidad: Map<Id, Apariencia>,
  extremo: ExtremoEnlace,
): EndpointVisual | null {
  const entidadId = entidadIdDeExtremo(modelo, extremo);
  if (!entidadId) return null;
  const directa = aparienciaPorEntidad.get(entidadId);
  if (directa) {
    if (extremo.kind === "estado") {
      const target = selectorCapsulaEstado(modelo, directa, extremo.id);
      return target ? { apariencia: directa, selectorEstado: target.selector } : { apariencia: directa };
    }
    return { apariencia: directa };
  }
  for (const apariencia of Object.values(opd.apariencias)) {
    if (modoPlegadoApariencia(apariencia) !== "parcial") continue;
    const parte = partesDePlegado(modelo, apariencia.entidadId).find((item) => item.entidadId === entidadId);
    if (parte) return { apariencia, proxy: { entidadId, nombre: parte.nombre } };
  }
  return null;
}

export function proyectarProxyExtraccion(opdId: Id, opd: { apariencias: Record<Id, Apariencia> }, apariencia: Apariencia): JointCellJson[] {
  const extraida = apariencia.parteExtraidaDe;
  if (!extraida) return [];
  const padre = opd.apariencias[extraida.padreAparienciaId];
  if (!padre) return [];
  return [{
    id: `proxy-${apariencia.id}`,
    type: "standard.Link",
    source: extremo(padre.id),
    target: extremo(apariencia.id),
    router: routerManhattan(),
    connector: { name: "straight" },
    attrs: {
      wrapper: {
        stroke: "transparent",
        strokeWidth: CANON.dims.enlaceHitArea,
        cursor: "default",
      },
      line: {
        stroke: "#98a2b3",
        strokeWidth: 1.5,
        strokeDasharray: "5 4",
        sourceMarker: null,
        targetMarker: null,
      },
    },
    opm: {
      kind: "proxy-plegado",
      opdId,
      padreAparienciaId: padre.id,
      parteAparienciaId: apariencia.id,
      parteEntidadId: extraida.parteEntidadId,
    },
    z: 0,
  }];
}

export function proyectarEnlace(
  opdId: Id,
  enlace: Enlace,
  aparienciaEnlaceId: Id,
  origen: EndpointVisual,
  destino: EndpointVisual,
  vertices: Posicion[],
  seleccionada: boolean,
  enAbanico = false,
): JointCellJson {
  const verticesRender = verticesEnlace(enlace.tipo, origen.apariencia, destino.apariencia, vertices);
  const estiloE = enlace.estilo;
  const colorEnlace = estiloE?.color ?? CANON.colores.enlace;
  const grosorEnlace = estiloE?.strokeWidth ?? CANON.dims.enlaceVisible;
  const dashOverride = estiloE?.dashArray !== undefined ? estiloE.dashArray || undefined : undefined;
  const router = enlace.tipo === "invocacion" || enAbanico ? undefined : routerManhattan();
  // Ronda 15 L4: enlaces procedurales con routerManhattan usan connector
  // 'jumpover' para que los cruces se dibujen como puentes (mejora real de
  // legibilidad). Invocacion y enlaces en abanico mantienen 'straight' porque
  // sus vertices/dock-points son explicitos. Refinamientos estructurales
  // (agregacion/exhibicion/...) tambien quedan 'straight' (cruzan triangulos
  // centrales, jumpover introduciria saltos artificiales).
  const connector = router ? connectorJumpover() : { name: "straight" };
  // BUG-1fc4d2: cuando el enlace toca un estado, el path debe quedar por
  // encima del bbox del padre (z=10) para que la flecha no se vea cortada
  // por el contorno del Objeto contenedor. Resto de enlaces conservan z=1
  // (debajo de los cells de entidad, layout natural JointJS).
  const tocaEstado = !!origen.selectorEstado || !!destino.selectorEstado;
  return {
    id: aparienciaEnlaceId,
    type: "standard.Link",
    source: endpointJoint(origen),
    target: endpointJoint(destino),
    vertices: verticesRender,
    router,
    connector,
    labels: [...etiquetasMultiplicidad(enlace), ...etiquetasModificador(enlace), ...etiquetaEnlace(enlace), ...etiquetasRuta(enlace), ...etiquetasProxyParte(origen, destino)],
    attrs: {
      wrapper: {
        stroke: seleccionada ? "rgba(61, 168, 255, 0.35)" : "transparent",
        strokeWidth: CANON.dims.enlaceHitArea,
        cursor: "pointer",
      },
      line: {
        stroke: colorEnlace,
        strokeWidth: seleccionada ? grosorEnlace + 2 : grosorEnlace,
        ...(dashOverride !== undefined ? { strokeDasharray: dashOverride } : {}),
        sourceMarker: marcadorFuente(enlace.tipo),
        targetMarker: marcadorDestino(enlace.tipo),
      },
    },
    opm: {
      kind: "enlace",
      opdId,
      enlaceId: enlace.id,
      aparienciaEnlaceId,
      tipo: enlace.tipo,
    },
    z: tocaEstado ? 20 : 1,
  };
}

export function etiquetasProxyParte(origen: EndpointVisual, destino: EndpointVisual): Array<Record<string, unknown>> {
  const labels: Array<Record<string, unknown>> = [];
  if (origen.proxy) labels.push(etiquetaProxyParte(origen.proxy.nombre, 28));
  if (destino.proxy) labels.push(etiquetaProxyParte(destino.proxy.nombre, -28));
  return labels;
}

export function etiquetaProxyParte(text: string, distance: number): Record<string, unknown> {
  return {
    markup: [{ tagName: "text", selector: "label" }],
    attrs: {
      label: {
        text,
        fill: "#475467",
        fontFamily: CANON.dims.fontFamily,
        fontSize: 12,
        fontWeight: 700,
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        pointerEvents: "none",
      },
    },
    position: {
      distance,
      offset: 14,
      angle: 0,
      args: {
        keepGradient: false,
        ensureLegibility: true,
      },
    },
  };
}

export function endpointJoint(endpoint: EndpointVisual): Record<string, unknown> {
  if (endpoint.selectorEstado) return extremoEstado(endpoint.apariencia.id, endpoint.selectorEstado);
  if (endpoint.punto) return { x: endpoint.punto.x, y: endpoint.punto.y };
  return extremo(endpoint.apariencia.id);
}

/**
 * BUG-1fc4d2: extremo de enlace que apunta a un sub-rect del cell padre
 * (capsula de estado). JointJS resuelve `selector` contra el markup del cell;
 * el anchor `midSide` aplica `getNodeBBox(magnet)` sobre ese sub-elemento
 * (joint.core.js:28161-28197), por lo que la linea engancha al lado mas
 * cercano de la capsula, no al bbox del Objeto contenedor. ConnectionPoint
 * `boundary` corta la linea en el borde del rect de la capsula. El endpoint
 * es id-based (no punto literal), por lo que JointJS lo reposiciona en
 * cada drag/resize del padre sin intervencion del store.
 */
export function extremoEstado(id: Id, selector: string): Record<string, unknown> {
  return {
    id,
    selector,
    anchor: { name: "midSide" },
    connectionPoint: { name: "boundary", args: { offset: 1 } },
  };
}

export function etiquetasMultiplicidad(enlace: Enlace): Array<Record<string, unknown>> {
  const labels: Array<Record<string, unknown>> = [];
  if (enlace.multiplicidadOrigen) {
    labels.push(etiquetaMultiplicidad(enlace.multiplicidadOrigen, 18));
  }
  if (enlace.multiplicidadDestino) {
    labels.push(etiquetaMultiplicidad(enlace.multiplicidadDestino, -18));
  }
  return labels;
}

export function etiquetasModificador(enlace: Enlace): Array<Record<string, unknown>> {
  const labels: Array<Record<string, unknown>> = [];
  const subtipo = textoSubtipoModificador(enlace);
  if (subtipo) {
    labels.push(etiquetaBadgeModificadorCanonico(subtipo, 0));
  }
  if (enlace.modificador === "evento" && enlace.probabilidad !== undefined) {
    labels.push(etiquetaTextoModificador(`${Math.round(enlace.probabilidad * 100)}%`, 0, 22));
  }
  if (enlace.tipo === "invocacion" && enlace.demora) {
    labels.push(etiquetaTextoModificador(enlace.demora, 0, -28));
  }
  return labels;
}

export function textoModificador(modificador: NonNullable<Enlace["modificador"]>): string {
  if (modificador === "condicion") return "C";
  if (modificador === "evento") return "E";
  return "¬";
}

export function etiquetaBadgeModificador(text: string, distance: number): Record<string, unknown> {
  return {
    markup: [
      { tagName: "rect", selector: "badge" },
      { tagName: "text", selector: "label" },
    ],
    attrs: {
      badge: {
        width: 18,
        height: 18,
        x: -9,
        y: -9,
        rx: 9,
        ry: 9,
        fill: "#ffffff",
        stroke: CANON.colores.enlace,
        strokeWidth: 1.5,
        pointerEvents: "none",
      },
      label: {
        text,
        fill: "#1f2937",
        fontFamily: CANON.dims.fontFamily,
        fontSize: 12,
        fontWeight: 700,
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        pointerEvents: "none",
      },
    },
    position: {
      distance,
      offset: -20,
      angle: 0,
      args: {
        keepGradient: false,
        ensureLegibility: true,
      },
    },
  };
}

export function etiquetaTextoModificador(text: string, distance: number, offset: number): Record<string, unknown> {
  return {
    markup: [{ tagName: "text", selector: "label" }],
    attrs: {
      label: {
        text,
        fill: "#475467",
        fontFamily: CANON.dims.fontFamily,
        fontSize: 11,
        fontWeight: 700,
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        pointerEvents: "none",
      },
    },
    position: {
      distance,
      offset,
      angle: 0,
      args: {
        keepGradient: false,
        ensureLegibility: true,
      },
    },
  };
}

export function etiquetaEnlace(enlace: Enlace): Array<Record<string, unknown>> {
  const etiqueta = etiquetaEnlaceNormalizada(enlace.etiqueta);
  return etiqueta ? [etiquetaTextoEnlace(etiqueta)] : [];
}

export function etiquetaTextoEnlace(text: string): Record<string, unknown> {
  return {
    markup: [{ tagName: "text", selector: "label" }],
    attrs: {
      label: {
        text,
        fill: "#475467",
        fontFamily: CANON.dims.fontFamily,
        fontSize: 12,
        fontStyle: "italic",
        fontWeight: CANON.dims.fontWeight,
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        pointerEvents: "none",
      },
    },
    position: {
      distance: 0.5,
      offset: -20,
      angle: 0,
      args: {
        keepGradient: false,
        ensureLegibility: true,
      },
    },
  };
}

export function etiquetaMultiplicidad(text: string, distance: number): Record<string, unknown> {
  return {
    markup: [{ tagName: "text", selector: "label" }],
    attrs: {
      label: {
        text,
        fill: "#1f2937",
        fontFamily: "Arial",
        fontSize: 12,
        fontWeight: 600,
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        pointerEvents: "none",
      },
    },
    position: {
      distance,
      offset: -12,
      angle: 0,
      args: {
        keepGradient: false,
        ensureLegibility: true,
      },
    },
  };
}

// Refinamiento estructural: agregacion (lleno), exhibicion (sub-triangulos),
// generalizacion (vacio), clasificacion (vacio + dot). Los markers canonicos
// viven en assets/svg/links/structural/ y se exponen via LINK_ASSETS.structural.

export function proyectarRefinamientoEstructural(
  opdId: Id,
  enlace: Enlace,
  aparienciaEnlaceId: Id,
  origen: Apariencia,
  destino: Apariencia,
  seleccionada: boolean,
): JointCellJson[] {
  const triangleSize = 30;
  const source = centro(origen);
  const target = centro(destino);
  const center = {
    x: (source.x + target.x) / 2,
    y: (source.y + target.y) / 2,
  };
  const topTriangle = { x: center.x, y: center.y - triangleSize / 2 };
  const bottomTriangle = { x: center.x, y: center.y + triangleSize / 2 };
  const triangleId = `${aparienciaEnlaceId}-triangulo`;
  const meta: OpmJointMetadata = {
    kind: "enlace",
    opdId,
    enlaceId: enlace.id,
    aparienciaEnlaceId,
    tipo: enlace.tipo,
  };
  const lineAttrs = attrsLinea(seleccionada);
  return [
    {
      id: `${aparienciaEnlaceId}-refinable`,
      type: "standard.Link",
      source: extremo(origen.id),
      target: topTriangle,
      router: routerManhattan(),
      connector: { name: "straight" },
      attrs: lineAttrs,
      opm: meta,
      z: 1,
    },
    {
      id: `${aparienciaEnlaceId}-refinador`,
      type: "standard.Link",
      source: bottomTriangle,
      target: extremo(destino.id),
      router: routerManhattan(),
      connector: { name: "straight" },
      labels: etiquetaEnlace(enlace),
      attrs: lineAttrs,
      opm: meta,
      z: 1,
    },
    ...marcadoresEstructurales(enlace.tipo, triangleId, center, triangleSize, seleccionada, meta),
  ];
}

export function attrsLinea(seleccionada: boolean): Record<string, unknown> {
  return {
    wrapper: {
      stroke: seleccionada ? "rgba(61, 168, 255, 0.35)" : "transparent",
      strokeWidth: CANON.dims.enlaceHitArea,
      cursor: "pointer",
    },
    line: {
      stroke: CANON.colores.enlace,
      strokeWidth: seleccionada ? CANON.dims.enlaceVisible + 2 : CANON.dims.enlaceVisible,
      targetMarker: null,
    },
  };
}

export function extremo(id: Id): Record<string, unknown> {
  return {
    id,
    anchor: { name: "midSide", args: { rotate: true } },
    connectionPoint: { name: "boundary", args: { offset: 1 } },
  };
}

export function centro(apariencia: Apariencia): Posicion {
  return {
    x: apariencia.x + apariencia.width / 2,
    y: apariencia.y + apariencia.height / 2,
  };
}

export function routerManhattan(): Record<string, unknown> {
  return { name: "manhattan", args: { padding: 5, step: 11 } };
}

// Connector 'jumpover': cuando dos enlaces se cruzan, el de encima dibuja un
// pequeño arco sobre el otro. Mejora legibilidad real en modelos medianos sin
// migrar de JointJS ni cambiar router. Tipos: 'arc' (arco) | 'gap' (corte) |
// 'cubic'. Tamano por defecto JointJS es 10px; bajamos a 8 para no comerse
// markers swallowtail (23x17) cuando estan cerca de un cruce.
export function connectorJumpover(): Record<string, unknown> {
  return { name: "jumpover", args: { type: "arc", size: 8 } };
}

export function verticesEnlace(tipo: TipoEnlace, origen: Apariencia, destino: Apariencia, vertices: Posicion[]): Posicion[] {
  if (tipo !== "invocacion" || vertices.length > 0) return vertices;
  return verticesInvocacion(origen, destino);
}

export function verticesInvocacion(origen: Apariencia, destino: Apariencia): Posicion[] {
  const source = centro(origen);
  const target = centro(destino);
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const px = -uy;
  const py = ux;
  const offset = Math.min(22, Math.max(12, length * 0.08));

  return [
    puntoZigzag(source, dx, dy, px, py, 0.62, 0),
    puntoZigzag(source, dx, dy, px, py, 0.48, offset),
    puntoZigzag(source, dx, dy, px, py, 0.86, offset),
  ];
}

export function puntoZigzag(source: Posicion, dx: number, dy: number, px: number, py: number, t: number, offset: number): Posicion {
  return {
    x: Math.round(source.x + dx * t + px * offset),
    y: Math.round(source.y + dy * t + py * offset),
  };
}
