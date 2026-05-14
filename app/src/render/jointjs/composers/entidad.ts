import { CANON } from "../../../modelo/constantes";
import { rolAparienciaEnRefinamiento } from "../../../modelo/contextoRefinamiento";
import { designacionesEstado } from "../../../modelo/estadosDesignaciones";
import { formatearNombreCompuesto } from "../../../modelo/objetoMetadata";
import { estadosDeEntidad, relacionesEstructuralesOcultas } from "../../../modelo/operaciones";
import { modoPlegadoApariencia, partesDePlegado } from "../../../modelo/plegado";
import { obtenerRefinamiento, tieneRefinamiento } from "../../../modelo/refinamientos";
import type { Apariencia, Entidad, Estado, Id, Modelo } from "../../../modelo/tipos";
import { targetsEstado } from "../estadoTargets";
import { filasPlegadoConNesting } from "../plegadoNesting";
import type { FilaPlegadoParcialExtendida } from "../plegadoNesting";
import type { JointCellJson, OpcionesProyeccion, RolApariencia } from "../proyeccionTipos";
import { colorTextoParaFill } from "./colores";
import { anchoCapsulaEstado, dimensionesConEstados, ESTADOS } from "./estados";
import { attrsPlegadoParcial, dimensionesPlegadoParcial, markupPlegadoParcial, selectoresPartesPlegadas, textoFilaPlegado, PLEGADO } from "./plegado";

/**
 * Composer de cosas OPM (objetos/procesos): markup, attrs, metadatos,
 * estados embebidos y plegado parcial. Consumidor: proyeccion.ts.
 */
export function proyectarEntidad(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  entidad: Entidad,
  seleccionada: boolean,
  resaltada: boolean,
  opciones: OpcionesProyeccion,
): JointCellJson {
  const stroke = apariencia.estilo?.borderColor ?? (entidad.tipo === "objeto" ? CANON.colores.objeto : CANON.colores.proceso);
  const fillBase = apariencia.estilo?.fill ?? CANON.colores.relleno;
  const fill = resaltada ? "#E1E6EB" : fillBase;
  const partes = partesDePlegado(modelo, entidad.id);
  const tienePartes = partes.length > 0;
  const modoPlegado = modoPlegadoApariencia(apariencia);
  const modoParcial = modoPlegado === "parcial" && tienePartes;
  const estructuralesOcultas = modoPlegado === "parcial" || modoPlegado === "plegado"
    ? relacionesEstructuralesOcultas(modelo, opdId, entidad.id).faltantes
    : 0;
  const filasParciales = modoParcial ? filasPlegadoConNesting({ modelo, opdId, padreAparienciaId: apariencia.id }) : [];
  const estadosTotales = entidad.tipo === "objeto" && !modoParcial ? estadosDeEntidad(modelo, entidad.id) : [];
  const estadosVisibles = estadosTotales.filter((estado) => !estado.suprimido);
  // SSOT §1.8 / V-192: cuando un objeto tiene estados suprimidos no
  // visibles en el OPD activo, el canon canonico exige un indicador
  // textual `...` en esquina inferior derecha como gramatica auxiliar
  // de "hay mas, no se muestra todo". Implementado abajo via
  // metadatos.suppressedBadge para reusar la infraestructura de badges.
  const tieneEstadosSuprimidos = estadosTotales.length > estadosVisibles.length;
  const nombreRender = formatearNombreCompuesto(entidad, { aliasVisible: opciones.aliasVisibles !== false });
  const refinada = tieneRefinamiento(entidad);
  // BUG-372334: distinguir descomposicion (inzoom: partes EMBEBIDAS dentro del
  // contorno) vs despliegue (unfold: partes FUERA, conectadas via enlaces
  // estructurales canonicos). Solo descomposicion entra en modo contorno
  // (stroke grueso, label-top, z=0, embedding via embedirContorno). Despliegue
  // renderiza el padre como entidad normal en el OPD hijo; los enlaces
  // estructurales (proyectarRefinamientoEstructural) ya manejan la conexion.
  // Ronda 15.2: la entidad puede tener ambos refinamientos. El contorno
  // aplica solo cuando el OPD activo es el de descomposicion del slot.
  const contornoRefinamiento = obtenerRefinamiento(entidad, "descomposicion")?.opdId === opdId;
  const size = modoParcial
    ? dimensionesPlegadoParcial(apariencia, nombreRender, filasParciales)
    : estadosVisibles.length > 0
      ? dimensionesConEstados(apariencia, nombreRender, estadosVisibles, entidad.layoutEstados)
      : { width: apariencia.width, height: apariencia.height };
  const strokeBase = refinada ? 4 : CANON.dims.enlaceVisible;
  const strokeWidth = seleccionada ? strokeBase + 2 : strokeBase;
  const bodyTag = entidad.tipo === "objeto" ? "rect" : "ellipse";
  const body = {
    fill,
    stroke,
    strokeWidth,
    // Atributos opcionales: solo presentes cuando aplican; pasar undefined a JointJS
    // serializa el string literal "undefined" en el SVG.
    ...(entidad.afiliacion === "ambiental" ? { strokeDasharray: "8 4" } : {}),
    // SSOT V-124/V-127, JOYAS §8: la sombra de esencia "fisica" es un canal
    // semantico OPM (no decoracion UI). Usamos el filtro `dropShadow` de
    // JointJS que se serializa a `<feDropShadow>` SVG nativo en `<defs>`, en
    // vez del shorthand CSS `filter: "drop-shadow(...)"`. Esto preserva la
    // sombra como propiedad recuperable del canon-diagrama y evita colision
    // perceptual con filtros CSS UI (ver halo de modo enlace, N11).
    ...(entidad.esencia === "fisica" ? { filter: { name: "dropShadow", args: { dx: 1, dy: 2, blur: 2, color: "rgba(0,0,0,0.25)" } } } : {}),
    cursor: "pointer",
  };
  const attrsBase = {
    body: entidad.tipo === "objeto"
      ? { ...body, width: size.width, height: size.height, rx: 4, ry: 4 }
      : { ...body, cx: size.width / 2, cy: size.height / 2, rx: size.width / 2, ry: size.height / 2 },
    label: {
      text: nombreRender,
      fill: colorTextoParaFill(fill),
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
  const metadatos = metadatosEntidad(
    entidad,
    opciones,
    tienePartes || estructuralesOcultas > 0,
    tieneEstadosSuprimidos,
    modoPlegado === "plegado" ? "▸" : "▾",
    estructuralesOcultas > 0
      ? `${estructuralesOcultas} relación(es) estructural(es) plegadas`
      : "Plegado parcial",
  );
  const renderBase = modoParcial
    ? { markup: markupPlegadoParcial(bodyTag, filasParciales), attrs: attrsPlegadoParcial(attrsBase, size, filasParciales) }
    : estadosVisibles.length > 0
      ? { markup: markupConEstados(bodyTag, estadosVisibles, metadatos), attrs: attrsConEstados(attrsBase, size, estadosVisibles, metadatos, entidad.layoutEstados) }
      : tienePartes
        ? { markup: markupConBadge(bodyTag, metadatos), attrs: attrsConBadge(attrsBase, size, metadatos) }
        : metadatos.tieneMetadatos
          ? { markup: markupConBadge(bodyTag, metadatos), attrs: attrsConBadge(attrsBase, size, metadatos) }
          : { attrs: attrsBase };
  const render = seleccionada
    ? {
        ...renderBase,
        markup: markupConResizeHandles(renderBase.markup ?? markupBase(bodyTag)),
        attrs: attrsConResizeHandles(renderBase.attrs, size),
      }
    : renderBase;
  const ports = portsEntidad(apariencia, entidad.tipo);

  return {
    id: apariencia.id,
    type: entidad.tipo === "objeto" ? "standard.Rectangle" : "standard.Ellipse",
    position: { x: apariencia.x, y: apariencia.y },
    size,
    ...render,
    ...(ports ? { ports } : {}),
    opm: {
      kind: "entidad",
      opdId,
      entidadId: entidad.id,
      aparienciaId: apariencia.id,
      rol: rolApariencia(modelo, opdId, apariencia, contornoRefinamiento),
      ...(estadosVisibles.length > 0 ? { estadosInteractivos: targetsEstado(estadosVisibles) } : {}),
      ...(modoParcial ? { partesPlegadas: selectoresPartesPlegadas(filasParciales) } : {}),
    },
    z: contornoRefinamiento ? 0 : 10,
  };
}

function portsEntidad(apariencia: Apariencia, tipo: Entidad["tipo"]): Record<string, unknown> | undefined {
  const ports = apariencia.ports ? Object.entries(apariencia.ports) : [];
  if (ports.length === 0) return undefined;
  if (tipo === "proceso") {
    return {
      groups: Object.fromEntries(ports.map(([id, port]) => [id, {
        ...grupoPuertoBase(),
        position: (_ports: unknown[], elBBox: { width: number; height: number }) => [puntoPuertoElipse(port.x, port.y, elBBox)],
      }])),
      items: ports.map(([id]) => ({ id, group: id })),
    };
  }
  return {
    groups: {
      aaa: {
        ...grupoPuertoBase(),
        position: "absolute",
      },
    },
    items: ports.map(([id, port]) => ({
      id,
      group: "aaa",
      args: {
        x: tipo === "objeto" ? `${port.x * 100}%` : port.x,
        y: tipo === "objeto" ? `${port.y * 100}%` : port.y,
      },
      position: {
        args: {
          x: tipo === "objeto" ? `${port.x * 100}%` : port.x,
          y: tipo === "objeto" ? `${port.y * 100}%` : port.y,
        },
      },
    })),
  };
}

function grupoPuertoBase(): Record<string, unknown> {
  return {
    markup: [{ tagName: "rect", selector: "portBody" }],
    attrs: {
      portBody: {
        width: 8,
        height: 8,
        x: -4,
        y: -4,
        fill: "transparent",
        stroke: "transparent",
        magnet: true,
      },
    },
  };
}

function puntoPuertoElipse(refX: number, refY: number, elBBox: { width: number; height: number }): { x: number; y: number; angle: number } {
  const rx = elBBox.width / 2;
  const ry = elBBox.height / 2;
  const cx = rx;
  const cy = ry;
  const dx = refX * elBBox.width - cx;
  const dy = refY * elBBox.height - cy;
  const denom = Math.sqrt((dx * dx) / (rx * rx || 1) + (dy * dy) / (ry * ry || 1));
  if (denom === 0) return { x: cx + rx, y: cy, angle: 0 };
  const t = 1 / denom;
  return { x: cx + dx * t, y: cy + dy * t, angle: 0 };
}

function markupBase(bodyTag: "rect" | "ellipse"): Array<Record<string, unknown>> {
  return [
    { tagName: bodyTag, selector: "body" },
    { tagName: "text", selector: "label" },
  ];
}

function markupConResizeHandles(markup: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
  return [
    ...markup,
    ...["nw", "n", "ne", "e", "se", "s", "sw", "w"].map((handle) => ({
      tagName: "rect",
      selector: `resize-${handle}`,
    })),
  ];
}

function attrsConResizeHandles(
  attrsBase: Record<string, unknown>,
  size: { width: number; height: number },
): Record<string, unknown> {
  const points: Record<string, { x: number; y: number; cursor: string }> = {
    "resize-nw": { x: 0, y: 0, cursor: "nwse-resize" },
    "resize-n": { x: size.width / 2, y: 0, cursor: "ns-resize" },
    "resize-ne": { x: size.width, y: 0, cursor: "nesw-resize" },
    "resize-e": { x: size.width, y: size.height / 2, cursor: "ew-resize" },
    "resize-se": { x: size.width, y: size.height, cursor: "nwse-resize" },
    "resize-s": { x: size.width / 2, y: size.height, cursor: "ns-resize" },
    "resize-sw": { x: 0, y: size.height, cursor: "nesw-resize" },
    "resize-w": { x: 0, y: size.height / 2, cursor: "ew-resize" },
  };
  const attrs: Record<string, unknown> = { ...attrsBase };
  for (const [selector, point] of Object.entries(points)) {
    attrs[selector] = {
      x: point.x - 4,
      y: point.y - 4,
      width: 8,
      height: 8,
      rx: 1,
      ry: 1,
      fill: "#ffffff",
      stroke: CANON.colores.enlace,
      strokeWidth: 1.5,
      cursor: point.cursor,
      pointerEvents: "auto",
      title: "Redimensionar",
    };
  }
  return attrs;
}

export function rolApariencia(modelo: Modelo, opdId: Id, apariencia: Apariencia, esContorno: boolean): RolApariencia {
  return rolAparienciaEnRefinamiento(modelo, opdId, apariencia, esContorno);
}

export function refYEtiquetaEntidad(contornoRefinamiento: boolean, modoParcial: boolean, tieneEstados: boolean): string {
  if (contornoRefinamiento || modoParcial) return "8%";
  if (tieneEstados) return "34%";
  return "50%";
}

interface MetadatosEntidadRender {
  foldBadge: boolean;
  foldBadgeText: string;
  foldBadgeTitle: string;
  descripcion?: string;
  url?: string;
  suppressedBadge: boolean;
  tieneMetadatos: boolean;
}

export function metadatosEntidad(
  entidad: Entidad,
  opciones: OpcionesProyeccion,
  tienePartes: boolean,
  tieneEstadosSuprimidos = false,
  foldBadgeText = "▾",
  foldBadgeTitle = "Plegado parcial",
): MetadatosEntidadRender {
  const descripcion = opciones.descripcionesVisibles !== false ? entidad.descripcion?.trim() : undefined;
  const url = entidad.urls?.[0]?.url;
  return {
    foldBadge: tienePartes,
    foldBadgeText,
    foldBadgeTitle,
    ...(descripcion ? { descripcion } : {}),
    ...(url ? { url } : {}),
    suppressedBadge: tieneEstadosSuprimidos,
    tieneMetadatos: tienePartes || !!descripcion || !!url || tieneEstadosSuprimidos,
  };
}

export function markupConBadge(bodyTag: "rect" | "ellipse", metadatos: MetadatosEntidadRender): Array<Record<string, unknown>> {
  return [
    { tagName: bodyTag, selector: "body" },
    { tagName: "text", selector: "label" },
    ...(metadatos.foldBadge ? [{ tagName: "text", selector: "foldBadge" }] : []),
    ...(metadatos.descripcion ? [{ tagName: "text", selector: "descBadge" }] : []),
    ...(metadatos.url ? [{
      tagName: "a",
      selector: "urlLink",
      children: [{ tagName: "text", selector: "urlBadge" }],
    }] : []),
    ...(metadatos.suppressedBadge ? [{ tagName: "text", selector: "suppressedBadge" }] : []),
  ];
}

export function markupConEstados(
  bodyTag: "rect" | "ellipse",
  estados: Estado[],
  metadatos: MetadatosEntidadRender,
): Array<Record<string, unknown>> {
  const capsulas = estados.flatMap((_, index) => [
    { tagName: "rect", selector: `stateCapsule${index}` },
    { tagName: "rect", selector: `stateFinalInner${index}` },
    { tagName: "text", selector: `stateLabel${index}` },
    { tagName: "text", selector: `stateDefaultMarker${index}` },
    { tagName: "text", selector: `stateCurrentMarker${index}` },
  ]);
  return [
    { tagName: bodyTag, selector: "body" },
    { tagName: "text", selector: "label" },
    ...capsulas,
    ...(metadatos.foldBadge ? [{ tagName: "text", selector: "foldBadge" }] : []),
    ...(metadatos.descripcion ? [{ tagName: "text", selector: "descBadge" }] : []),
    ...(metadatos.url ? [{
      tagName: "a",
      selector: "urlLink",
      children: [{ tagName: "text", selector: "urlBadge" }],
    }] : []),
    ...(metadatos.suppressedBadge ? [{ tagName: "text", selector: "suppressedBadge" }] : []),
  ];
}

export function attrsConBadge(
  attrsBase: Record<string, unknown>,
  size: { width: number; height: number },
  metadatos: MetadatosEntidadRender,
): Record<string, unknown> {
  const attrs: Record<string, unknown> = {
    ...attrsBase,
  };
  if (metadatos.foldBadge) {
    attrs.foldBadge = {
      text: metadatos.foldBadgeText,
      x: size.width - 14,
      y: 17,
      fill: CANON.colores.enlace,
      fontFamily: CANON.dims.fontFamily,
      fontSize: 16,
      fontWeight: 700,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      cursor: "pointer",
      title: metadatos.foldBadgeTitle,
    };
  }
  aplicarMetadatosAttrs(attrs, size, metadatos);
  return attrs;
}

export function attrsConEstados(
  attrsBase: Record<string, unknown>,
  size: { width: number; height: number },
  estados: Estado[],
  metadatos: MetadatosEntidadRender,
  layout: Entidad["layoutEstados"],
): Record<string, unknown> {
  const attrs: Record<string, unknown> = {
    ...attrsBase,
    label: {
      ...(attrsBase.label as Record<string, unknown>),
      textWrap: { width: size.width - 24, height: size.height - ESTADOS.regionHeight - 8 },
    },
  };
  if (metadatos.foldBadge) attrs.foldBadge = attrsConBadge(attrsBase, size, metadatos).foldBadge;
  aplicarMetadatosAttrs(attrs, size, metadatos);
  const vertical = layout === "vertical";
  const anchos = estados.map((estado) => anchoCapsulaEstado(estado.nombre));
  const anchoTotal = vertical
    ? Math.max(...anchos, ESTADOS.minWidth)
    : anchos.reduce((total, ancho) => total + ancho, 0) + Math.max(0, anchos.length - 1) * ESTADOS.gap;
  let x = (size.width - anchoTotal) / 2;
  const altoTotal = vertical
    ? estados.length * ESTADOS.capsuleHeight + Math.max(0, estados.length - 1) * ESTADOS.gap
    : ESTADOS.capsuleHeight;
  let y = size.height - ESTADOS.paddingBottom - altoTotal;

  for (const [index, estado] of estados.entries()) {
    const width = anchos[index] ?? ESTADOS.minWidth;
    if (vertical) x = (size.width - width) / 2;
    const designaciones = designacionesEstado(estado);
    attrs[`stateCapsule${index}`] = {
      x,
      y,
      width,
      height: ESTADOS.capsuleHeight,
      rx: ESTADOS.radius,
      ry: ESTADOS.radius,
      fill: designaciones.includes("final") ? "#eef8ff" : CANON.colores.relleno,
      stroke: CANON.colores.enlace,
      strokeWidth: designaciones.includes("inicial") ? 3 : 1,
      pointerEvents: "auto",
      cursor: "crosshair",
    };
    attrs[`stateFinalInner${index}`] = {
      x: x + 3,
      y: y + 3,
      width: Math.max(0, width - 6),
      height: ESTADOS.capsuleHeight - 6,
      rx: Math.max(0, ESTADOS.radius - 2),
      ry: Math.max(0, ESTADOS.radius - 2),
      fill: "transparent",
      stroke: CANON.colores.enlace,
      strokeWidth: designaciones.includes("final") ? 1 : 0,
      pointerEvents: "none",
      display: designaciones.includes("final") ? undefined : "none",
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
      pointerEvents: "auto",
      cursor: "crosshair",
    };
    attrs[`stateDefaultMarker${index}`] = {
      text: "↗",
      x: x + width - 10,
      y: y + 7,
      fill: CANON.colores.enlace,
      fontFamily: CANON.dims.fontFamily,
      fontSize: 12,
      fontWeight: 700,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      pointerEvents: "none",
      display: designaciones.includes("default") ? undefined : "none",
    };
    attrs[`stateCurrentMarker${index}`] = {
      text: "●",
      x: x + 10,
      y: y + 7,
      fill: "#70E483",
      fontFamily: CANON.dims.fontFamily,
      fontSize: 10,
      fontWeight: 700,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      pointerEvents: "none",
      display: designaciones.includes("current") ? undefined : "none",
    };
    if (vertical) y += ESTADOS.capsuleHeight + ESTADOS.gap;
    else x += width + ESTADOS.gap;
  }
  return attrs;
}

export function aplicarMetadatosAttrs(
  attrs: Record<string, unknown>,
  size: { width: number; height: number },
  metadatos: MetadatosEntidadRender,
): void {
  let x = 14;
  if (metadatos.descripcion) {
    attrs.descBadge = {
      text: "i",
      x,
      y: 17,
      fill: "#586D8C",
      fontFamily: CANON.dims.fontFamily,
      fontSize: 12,
      fontWeight: 700,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      pointerEvents: "none",
      title: metadatos.descripcion,
    };
    x += 16;
  }
  if (metadatos.url) {
    attrs.urlLink = {
      href: metadatos.url,
      xlinkHref: metadatos.url,
      target: "_blank",
      rel: "noopener noreferrer",
      cursor: "pointer",
    };
    attrs.urlBadge = {
      text: "↗",
      x,
      y: 17,
      fill: "#3BC3FF",
      fontFamily: CANON.dims.fontFamily,
      fontSize: 13,
      fontWeight: 700,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      cursor: "pointer",
      title: metadatos.url,
    };
  }
  if (metadatos.foldBadge && !attrs.foldBadge) {
    attrs.foldBadge = {
      text: metadatos.foldBadgeText,
      x: size.width - 14,
      y: 17,
      fill: CANON.colores.enlace,
      fontFamily: CANON.dims.fontFamily,
      fontSize: 16,
      fontWeight: 700,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      cursor: "pointer",
      title: metadatos.foldBadgeTitle,
    };
  }
  if (metadatos.suppressedBadge) {
    // SSOT §1.8 / V-192: "..." en esquina inferior derecha del objeto
    // como indicador canonico de estados suprimidos en el OPD activo.
    attrs.suppressedBadge = {
      text: "…",
      x: size.width - 14,
      y: size.height - 8,
      fill: CANON.colores.enlace,
      fontFamily: CANON.dims.fontFamily,
      fontSize: 14,
      fontWeight: 700,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      pointerEvents: "none",
      title: "Tiene estados suprimidos en este OPD",
    };
  }
}

export { dimensionesConEstados, ESTADOS } from "./estados";
export { dimensionesPlegadoParcial, PLEGADO, attrsPlegadoParcial, markupPlegadoParcial, selectoresPartesPlegadas, textoFilaPlegado } from "./plegado";
