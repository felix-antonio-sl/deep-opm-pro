import { CANON } from "../../modelo/constantes";
import { estadosDeEntidad } from "../../modelo/operaciones";
import { modoPlegadoApariencia, partesDePlegado, type PartePlegada } from "../../modelo/plegado";
import type { Apariencia, Enlace, Entidad, Estado, Id, Modelo, Posicion, TipoEnlace } from "../../modelo/tipos";
import { LINK_ASSETS } from "./linkAssets";

export type RolApariencia = "contorno" | "interno" | "externo";

export type OpmJointMetadata =
  | {
      kind: "entidad";
      opdId: Id;
      entidadId: Id;
      aparienciaId: Id;
      rol: RolApariencia;
    }
  | {
      kind: "enlace";
      opdId: Id;
      enlaceId: Id;
      aparienciaEnlaceId: Id;
      tipo: TipoEnlace;
    };

export interface JointCellJson {
  id: Id;
  type:
    | "standard.Rectangle"
    | "standard.Ellipse"
    | "standard.Link"
    | "standard.Polygon"
    | "standard.Path"
    | "standard.Circle";
  opm: OpmJointMetadata;
  z: number;
  [key: string]: unknown;
}

const TIPOS_REFINAMIENTO_ESTRUCTURAL: readonly TipoEnlace[] = [
  "agregacion",
  "exhibicion",
  "generalizacion",
  "clasificacion",
] as const;

export function proyectarModeloAJointCells(
  modelo: Modelo,
  opdId: Id,
  seleccionEntidadId: Id | null,
  seleccionEnlaceId: Id | null,
): JointCellJson[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];

  const apariencias = Object.values(opd.apariencias);
  const aparienciaPorEntidad = new Map(apariencias.map((apariencia) => [apariencia.entidadId, apariencia]));
  const elementos = apariencias.flatMap((apariencia) => {
    const entidad = modelo.entidades[apariencia.entidadId];
    return entidad ? [proyectarEntidad(modelo, opdId, apariencia, entidad, entidad.id === seleccionEntidadId)] : [];
  });
  const enlaces = Object.values(opd.enlaces).flatMap((aparienciaEnlace) => {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) return [];
    const origen = aparienciaPorEntidad.get(enlace.origenId);
    const destino = aparienciaPorEntidad.get(enlace.destinoId);
    if (!origen || !destino) return [];
    return TIPOS_REFINAMIENTO_ESTRUCTURAL.includes(enlace.tipo)
      ? proyectarRefinamientoEstructural(opdId, enlace, aparienciaEnlace.id, origen, destino, enlace.id === seleccionEnlaceId)
      : [proyectarEnlace(opdId, enlace, aparienciaEnlace.id, origen, destino, aparienciaEnlace.vertices, enlace.id === seleccionEnlaceId)];
  });

  return [...enlaces, ...elementos];
}

function proyectarEntidad(modelo: Modelo, opdId: Id, apariencia: Apariencia, entidad: Entidad, seleccionada: boolean): JointCellJson {
  const stroke = entidad.tipo === "objeto" ? CANON.colores.objeto : CANON.colores.proceso;
  const partes = partesDePlegado(modelo, entidad.id);
  const tienePartes = partes.length > 0;
  const modoParcial = modoPlegadoApariencia(apariencia) === "parcial" && tienePartes;
  const estadosVisibles = entidad.tipo === "objeto" && !modoParcial ? estadosDeEntidad(modelo, entidad.id) : [];
  const refinada = !!entidad.refinamiento;
  const contornoRefinamiento = refinada && entidad.refinamiento?.opdId === opdId;
  const size = modoParcial
    ? dimensionesPlegadoParcial(apariencia, entidad.nombre, partes)
    : estadosVisibles.length > 0
      ? dimensionesConEstados(apariencia, entidad.nombre, estadosVisibles)
      : { width: apariencia.width, height: apariencia.height };
  const strokeBase = refinada ? 4 : CANON.dims.enlaceVisible;
  const strokeWidth = seleccionada ? strokeBase + 2 : strokeBase;
  const bodyTag = entidad.tipo === "objeto" ? "rect" : "ellipse";
  const body = {
    fill: CANON.colores.relleno,
    stroke,
    strokeWidth,
    strokeDasharray: entidad.afiliacion === "ambiental" ? "8 4" : undefined,
    filter: entidad.esencia === "fisica" ? "drop-shadow(1px 2px 2px rgb(0 0 0 / 0.25))" : undefined,
    cursor: "pointer",
  };
  const attrsBase = {
    body: entidad.tipo === "objeto"
      ? { ...body, width: size.width, height: size.height, rx: 4, ry: 4 }
      : { ...body, cx: size.width / 2, cy: size.height / 2, rx: size.width / 2, ry: size.height / 2 },
    label: {
      text: entidad.nombre,
      fill: CANON.colores.texto,
      fontFamily: CANON.dims.fontFamily,
      fontSize: CANON.dims.fontSize,
      fontWeight: CANON.dims.fontWeight,
      textWrap: { width: -12 },
      refY: refYEtiquetaEntidad(contornoRefinamiento, modoParcial, estadosVisibles.length > 0),
      textVerticalAnchor: contornoRefinamiento || modoParcial ? "top" : "middle",
      textAnchor: "middle",
      pointerEvents: "none",
    },
  };

  return {
    id: apariencia.id,
    type: entidad.tipo === "objeto" ? "standard.Rectangle" : "standard.Ellipse",
    position: { x: apariencia.x, y: apariencia.y },
    size,
    ...(modoParcial
      ? { markup: markupPlegadoParcial(bodyTag, partes), attrs: attrsPlegadoParcial(attrsBase, size, partes) }
      : estadosVisibles.length > 0
        ? { markup: markupConEstados(bodyTag, estadosVisibles, tienePartes), attrs: attrsConEstados(attrsBase, size, estadosVisibles, tienePartes) }
        : tienePartes
          ? { markup: markupConBadge(bodyTag), attrs: attrsConBadge(attrsBase, size) }
          : { attrs: attrsBase }),
    opm: {
      kind: "entidad",
      opdId,
      entidadId: entidad.id,
      aparienciaId: apariencia.id,
      rol: rolApariencia(modelo, opdId, entidad, contornoRefinamiento),
    },
    z: contornoRefinamiento ? 0 : 10,
  };
}

// Distingue el rol de una apariencia dentro de su OPD para que el render
// (embed JointJS) y el kernel (drag delta) tomen decisiones consistentes
// sobre qué cells siguen al contorno y cuáles son anclas externas.
//
// - "contorno": apariencia del refinable cuyo OPD descompuesto es el actual.
// - "externo": apariencia proxy de una entidad que tambien tiene apariencia
//   en otro OPD (típicamente el padre); representa el contexto del
//   refinamiento, no su contenido.
// - "interno": apariencia creada como parte de este OPD (subproceso, parte
//   refinadora, objeto interno). Único OPD donde aparece.
function rolApariencia(modelo: Modelo, opdId: Id, entidad: Entidad, esContorno: boolean): RolApariencia {
  if (esContorno) return "contorno";
  for (const otroOpdId of Object.keys(modelo.opds)) {
    if (otroOpdId === opdId) continue;
    const otroOpd = modelo.opds[otroOpdId];
    if (!otroOpd) continue;
    for (const ap of Object.values(otroOpd.apariencias)) {
      if (ap.entidadId === entidad.id) return "externo";
    }
  }
  return "interno";
}

function dimensionesPlegadoParcial(apariencia: Apariencia, nombrePadre: string, partes: PartePlegada[]): { width: number; height: number } {
  const textoMasLargo = [nombrePadre, ...partes.map((parte) => parte.nombre)]
    .reduce((max, texto) => Math.max(max, texto.length), 0);
  const width = Math.max(apariencia.width, CANON.dims.cosaWidth, textoMasLargo * 7 + 36);
  const height = Math.max(apariencia.height, PLEGADO.headerHeight + partes.length * PLEGADO.rowHeight + PLEGADO.paddingBottom);
  return { width, height };
}

function dimensionesConEstados(apariencia: Apariencia, nombre: string, estados: Estado[]): { width: number; height: number } {
  const capsulas = estados.map((estado) => anchoCapsulaEstado(estado.nombre));
  const anchoEstados = capsulas.reduce((total, ancho) => total + ancho, 0) + Math.max(0, capsulas.length - 1) * ESTADOS.gap;
  const width = Math.max(apariencia.width, CANON.dims.cosaWidth, nombre.length * 7 + 24, anchoEstados + ESTADOS.paddingX * 2);
  const height = Math.max(apariencia.height, CANON.dims.cosaHeight + ESTADOS.regionHeight);
  return { width, height };
}

function refYEtiquetaEntidad(contornoRefinamiento: boolean, modoParcial: boolean, tieneEstados: boolean): string {
  if (contornoRefinamiento || modoParcial) return "8%";
  if (tieneEstados) return "34%";
  return "50%";
}

function markupConBadge(bodyTag: "rect" | "ellipse"): Array<Record<string, unknown>> {
  return [
    { tagName: bodyTag, selector: "body" },
    { tagName: "text", selector: "label" },
    { tagName: "text", selector: "foldBadge" },
  ];
}

function markupConEstados(
  bodyTag: "rect" | "ellipse",
  estados: Estado[],
  tienePartes: boolean,
): Array<Record<string, unknown>> {
  const capsulas = estados.flatMap((_, index) => [
    { tagName: "rect", selector: `stateCapsule${index}` },
    { tagName: "text", selector: `stateLabel${index}` },
  ]);
  return [
    { tagName: bodyTag, selector: "body" },
    { tagName: "text", selector: "label" },
    ...capsulas,
    ...(tienePartes ? [{ tagName: "text", selector: "foldBadge" }] : []),
  ];
}

function markupPlegadoParcial(bodyTag: "rect" | "ellipse", partes: PartePlegada[]): Array<Record<string, unknown>> {
  const rows = partes.flatMap((_, index) => [
    { tagName: "line", selector: `partSeparator${index}` },
    { tagName: "text", selector: `partLabel${index}` },
  ]);
  return [
    { tagName: bodyTag, selector: "body" },
    { tagName: "text", selector: "label" },
    ...rows,
  ];
}

function attrsConBadge(
  attrsBase: Record<string, unknown>,
  size: { width: number; height: number },
): Record<string, unknown> {
  return {
    ...attrsBase,
    foldBadge: {
      text: "▾",
      x: size.width - 14,
      y: 17,
      fill: CANON.colores.enlace,
      fontFamily: CANON.dims.fontFamily,
      fontSize: 16,
      fontWeight: 700,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      cursor: "pointer",
      title: "Plegado parcial",
    },
  };
}

function attrsConEstados(
  attrsBase: Record<string, unknown>,
  size: { width: number; height: number },
  estados: Estado[],
  tienePartes: boolean,
): Record<string, unknown> {
  const attrs: Record<string, unknown> = {
    ...attrsBase,
    label: {
      ...(attrsBase.label as Record<string, unknown>),
      textWrap: { width: size.width - 24, height: size.height - ESTADOS.regionHeight - 8 },
    },
  };
  if (tienePartes) attrs.foldBadge = attrsConBadge(attrsBase, size).foldBadge;
  const anchos = estados.map((estado) => anchoCapsulaEstado(estado.nombre));
  const anchoTotal = anchos.reduce((total, ancho) => total + ancho, 0) + Math.max(0, anchos.length - 1) * ESTADOS.gap;
  let x = (size.width - anchoTotal) / 2;
  const y = size.height - ESTADOS.paddingBottom - ESTADOS.capsuleHeight;

  for (const [index, estado] of estados.entries()) {
    const width = anchos[index] ?? ESTADOS.minWidth;
    attrs[`stateCapsule${index}`] = {
      x,
      y,
      width,
      height: ESTADOS.capsuleHeight,
      rx: ESTADOS.radius,
      ry: ESTADOS.radius,
      fill: estado.esFinal ? "#eef8ff" : CANON.colores.relleno,
      stroke: CANON.colores.enlace,
      strokeWidth: estado.esInicial ? 3 : 1,
      pointerEvents: "none",
    };
    attrs[`stateLabel${index}`] = {
      text: estado.nombre,
      x: x + width / 2,
      y: y + ESTADOS.capsuleHeight / 2,
      fill: CANON.colores.texto,
      fontFamily: CANON.dims.fontFamily,
      fontSize: ESTADOS.fontSize,
      fontWeight: CANON.dims.fontWeight,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      textWrap: { width: width - ESTADOS.paddingHorizontal * 2, height: ESTADOS.capsuleHeight - 4 },
      pointerEvents: "none",
    };
    x += width + ESTADOS.gap;
  }
  return attrs;
}

function attrsPlegadoParcial(
  attrsBase: Record<string, unknown>,
  size: { width: number; height: number },
  partes: PartePlegada[],
): Record<string, unknown> {
  const attrs: Record<string, unknown> = {
    ...attrsBase,
    label: {
      ...(attrsBase.label as Record<string, unknown>),
      textWrap: { width: size.width - 24 },
    },
  };
  for (const [index, parte] of partes.entries()) {
    const y = PLEGADO.headerHeight + index * PLEGADO.rowHeight;
    attrs[`partSeparator${index}`] = {
      x1: 12,
      x2: size.width - 12,
      y1: y,
      y2: y,
      stroke: "#d9e0ea",
      strokeWidth: 1,
      pointerEvents: "none",
    };
    attrs[`partLabel${index}`] = {
      text: parte.nombre,
      x: size.width / 2,
      y: y + PLEGADO.rowHeight / 2,
      fill: CANON.colores.texto,
      fontFamily: CANON.dims.fontFamily,
      fontSize: 12,
      fontWeight: CANON.dims.fontWeight,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      textWrap: { width: size.width - 24, height: PLEGADO.rowHeight - 4 },
      pointerEvents: "none",
    };
  }
  return attrs;
}

function anchoCapsulaEstado(nombre: string): number {
  return Math.max(ESTADOS.minWidth, nombre.length * 7 + ESTADOS.paddingHorizontal * 2);
}

function proyectarEnlace(
  opdId: Id,
  enlace: Enlace,
  aparienciaEnlaceId: Id,
  origen: Apariencia,
  destino: Apariencia,
  vertices: Posicion[],
  seleccionada: boolean,
): JointCellJson {
  const verticesRender = verticesEnlace(enlace.tipo, origen, destino, vertices);
  return {
    id: aparienciaEnlaceId,
    type: "standard.Link",
    source: {
      id: origen.id,
      anchor: { name: "midSide", args: { rotate: true } },
      connectionPoint: { name: "boundary", args: { offset: 1 } },
    },
    target: {
      id: destino.id,
      anchor: { name: "midSide", args: { rotate: true } },
      connectionPoint: { name: "boundary", args: { offset: 1 } },
    },
    vertices: verticesRender,
    router: enlace.tipo === "invocacion" ? undefined : routerManhattan(),
    connector: { name: "straight" },
    labels: etiquetasMultiplicidad(enlace),
    attrs: {
      wrapper: {
        stroke: "transparent",
        strokeWidth: CANON.dims.enlaceHitArea,
        cursor: "pointer",
      },
      line: {
        stroke: CANON.colores.enlace,
        strokeWidth: seleccionada ? CANON.dims.enlaceVisible + 2 : CANON.dims.enlaceVisible,
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
    z: 1,
  };
}

function etiquetasMultiplicidad(enlace: Enlace): Array<Record<string, unknown>> {
  const labels: Array<Record<string, unknown>> = [];
  if (enlace.multiplicidadOrigen) {
    labels.push(etiquetaMultiplicidad(enlace.multiplicidadOrigen, 18));
  }
  if (enlace.multiplicidadDestino) {
    labels.push(etiquetaMultiplicidad(enlace.multiplicidadDestino, -18));
  }
  return labels;
}

function etiquetaMultiplicidad(text: string, distance: number): Record<string, unknown> {
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
function proyectarRefinamientoEstructural(
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
    x: source.x + (target.x - source.x) * 0.38,
    y: source.y + (target.y - source.y) * 0.38,
  };
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
      target: extremo(triangleId),
      router: routerManhattan(),
      connector: { name: "straight" },
      attrs: lineAttrs,
      opm: meta,
      z: 1,
    },
    {
      id: `${aparienciaEnlaceId}-refinador`,
      type: "standard.Link",
      source: extremo(triangleId),
      target: extremo(destino.id),
      router: routerManhattan(),
      connector: { name: "straight" },
      attrs: lineAttrs,
      opm: meta,
      z: 1,
    },
    ...marcadoresEstructurales(enlace.tipo, triangleId, center, triangleSize, source, seleccionada, meta),
  ];
}

function marcadoresEstructurales(
  tipo: TipoEnlace,
  triangleId: Id,
  center: Posicion,
  size: number,
  source: Posicion,
  seleccionada: boolean,
  meta: OpmJointMetadata,
): JointCellJson[] {
  const angle = anguloTriangulo(source, center);
  const position = { x: center.x - size / 2, y: center.y - size / 2 };
  const strokeWidth = seleccionada ? CANON.dims.enlaceVisible + 2 : CANON.dims.enlaceVisible;
  const stroke = CANON.colores.enlace;

  if (tipo === "exhibicion") {
    // Exhibicion = triangulo lleno con sub-triangulos anidados visibles. En
    // OPCloud se dibuja con un solo path SVG y fill-rule="evenodd"; en
    // JointJS la traduccion camelCase->kebab-case de fillRule es fragil y
    // ademas el bbox de standard.Path se computa distinto al de Polygon, lo
    // que rompe rotacion y routing. Lo replicamos con tres polygons anidados
    // (igual rotacion y bbox que los demas estructurales): grande relleno,
    // medio vacio (hueco visual), pequeno relleno.
    const innerStrokeWidth = Math.max(1, strokeWidth - 1);
    return [
      polyShapeCell(triangleId, "standard.Polygon", position, size, angle, {
        refPoints: "0,15 30,0 30,30",
        fill: stroke,
        stroke,
        strokeWidth,
        cursor: "pointer",
      }, meta),
      {
        id: `${triangleId}-medio`,
        type: "standard.Polygon",
        position,
        size: { width: size, height: size },
        angle,
        attrs: {
          body: {
            refPoints: "5,15 25,5 25,25",
            fill: "white",
            stroke,
            strokeWidth: innerStrokeWidth,
            cursor: "pointer",
          },
          label: { text: "", display: "none" },
        },
        opm: meta,
        z: 3,
      },
      {
        id: `${triangleId}-pequeno`,
        type: "standard.Polygon",
        position,
        size: { width: size, height: size },
        angle,
        attrs: {
          body: {
            refPoints: "10,15 22,9 22,21",
            fill: stroke,
            stroke,
            strokeWidth: innerStrokeWidth,
            cursor: "pointer",
          },
          label: { text: "", display: "none" },
        },
        opm: meta,
        z: 4,
      },
    ];
  }

  if (tipo === "generalizacion") {
    return [
      polyShapeCell(triangleId, "standard.Polygon", position, size, angle, {
        refPoints: LINK_ASSETS.structural.generalizacion.markerPoints,
        fill: LINK_ASSETS.structural.generalizacion.markerFill,
        stroke,
        strokeWidth,
        cursor: "pointer",
      }, meta),
    ];
  }

  if (tipo === "clasificacion") {
    const dot = LINK_ASSETS.structural.clasificacion.markerDot;
    return [
      polyShapeCell(triangleId, "standard.Polygon", position, size, angle, {
        refPoints: LINK_ASSETS.structural.clasificacion.markerPoints,
        fill: LINK_ASSETS.structural.clasificacion.markerFill,
        stroke,
        strokeWidth,
        cursor: "pointer",
      }, meta),
      {
        id: `${triangleId}-dot`,
        type: "standard.Circle",
        position: { x: center.x - dot.r, y: center.y - dot.r },
        size: { width: dot.r * 2, height: dot.r * 2 },
        attrs: {
          body: { fill: stroke, stroke, cursor: "pointer" },
          label: { text: "", display: "none" },
        },
        opm: meta,
        z: 3,
      },
    ];
  }

  // agregacion (default): triangulo solido con fill = color de enlace.
  return [
    polyShapeCell(triangleId, "standard.Polygon", position, size, angle, {
      refPoints: LINK_ASSETS.structural.agregacion.markerPoints,
      fill: stroke,
      stroke,
      strokeWidth,
      cursor: "pointer",
    }, meta),
  ];
}

function polyShapeCell(
  id: Id,
  type: "standard.Polygon" | "standard.Path",
  position: Posicion,
  size: number,
  angle: number,
  bodyAttrs: Record<string, unknown>,
  meta: OpmJointMetadata,
): JointCellJson {
  return {
    id,
    type,
    position,
    size: { width: size, height: size },
    angle,
    attrs: {
      body: bodyAttrs,
      label: { text: "", display: "none" },
    },
    opm: meta,
    z: 2,
  };
}

function marcadorFuente(tipo: TipoEnlace): Record<string, unknown> | null {
  if (tipo === "efecto") {
    return markerAttrs(LINK_ASSETS.procedural.efecto.marker);
  }
  if (tipo === "invocacion") {
    return markerAttrs(LINK_ASSETS.procedural.invocacion.marker);
  }
  return null;
}

function marcadorDestino(tipo: TipoEnlace): Record<string, unknown> | null {
  if (tipo === "agente") {
    return markerAttrs(LINK_ASSETS.procedural.agente.marker);
  }
  if (tipo === "instrumento") {
    return markerAttrs(LINK_ASSETS.procedural.instrumento.marker);
  }
  if (tipo === "consumo") {
    return markerAttrs(LINK_ASSETS.procedural.consumo.marker);
  }
  if (tipo === "resultado") {
    return markerAttrs(LINK_ASSETS.procedural.resultado.marker);
  }
  if (tipo === "efecto") {
    return markerAttrs(LINK_ASSETS.procedural.efecto.marker);
  }
  return null;
}

function attrsLinea(seleccionada: boolean): Record<string, unknown> {
  return {
    wrapper: {
      stroke: "transparent",
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

function extremo(id: Id): Record<string, unknown> {
  return {
    id,
    anchor: { name: "midSide", args: { rotate: true } },
    connectionPoint: { name: "boundary", args: { offset: 1 } },
  };
}

function centro(apariencia: Apariencia): Posicion {
  return {
    x: apariencia.x + apariencia.width / 2,
    y: apariencia.y + apariencia.height / 2,
  };
}

function anguloTriangulo(source: Posicion, center: Posicion): number {
  const angleToSource = Math.atan2(source.y - center.y, source.x - center.x) * 180 / Math.PI;
  return angleToSource - 180;
}

function routerManhattan(): Record<string, unknown> {
  return { name: "manhattan", args: { padding: 5, step: 11 } };
}

function verticesEnlace(tipo: TipoEnlace, origen: Apariencia, destino: Apariencia, vertices: Posicion[]): Posicion[] {
  if (tipo !== "invocacion" || vertices.length > 0) return vertices;
  return verticesInvocacion(origen, destino);
}

function verticesInvocacion(origen: Apariencia, destino: Apariencia): Posicion[] {
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

function puntoZigzag(source: Posicion, dx: number, dy: number, px: number, py: number, t: number, offset: number): Posicion {
  return {
    x: Math.round(source.x + dx * t + px * offset),
    y: Math.round(source.y + dy * t + py * offset),
  };
}

function markerAttrs(marker: Record<string, unknown>): Record<string, unknown> {
  return { ...marker };
}

const PLEGADO = {
  headerHeight: 38,
  rowHeight: 25,
  paddingBottom: 10,
} as const;

const ESTADOS = {
  capsuleHeight: 24,
  minWidth: 52,
  paddingHorizontal: 6,
  paddingX: 8,
  paddingBottom: 6,
  gap: 4,
  radius: 8,
  fontSize: 12,
  regionHeight: 34,
} as const;
