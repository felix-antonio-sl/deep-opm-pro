import { CANON } from "../../../modelo/constantes";
import { designacionesEstado } from "../../../modelo/estadosDesignaciones";
import { formatearNombreCompuesto } from "../../../modelo/objetoMetadata";
import { estadosDeEntidad } from "../../../modelo/operaciones";
import { modoPlegadoApariencia, partesDePlegado } from "../../../modelo/plegado";
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
  const modoParcial = modoPlegadoApariencia(apariencia) === "parcial" && tienePartes;
  const filasParciales = modoParcial ? filasPlegadoConNesting({ modelo, opdId, padreAparienciaId: apariencia.id }) : [];
  const estadosVisibles = entidad.tipo === "objeto" && !modoParcial
    ? estadosDeEntidad(modelo, entidad.id).filter((estado) => !estado.suprimido)
    : [];
  const nombreRender = formatearNombreCompuesto(entidad, { aliasVisible: opciones.aliasVisibles !== false });
  const refinada = !!entidad.refinamiento;
  // BUG-372334: distinguir descomposicion (inzoom: partes EMBEBIDAS dentro del
  // contorno) vs despliegue (unfold: partes FUERA, conectadas via enlaces
  // estructurales canonicos). Solo descomposicion entra en modo contorno
  // (stroke grueso, label-top, z=0, embedding via embedirContorno). Despliegue
  // renderiza el padre como entidad normal en el OPD hijo; los enlaces
  // estructurales (proyectarRefinamientoEstructural) ya manejan la conexion.
  const contornoRefinamiento = refinada
    && entidad.refinamiento?.opdId === opdId
    && entidad.refinamiento?.tipo === "descomposicion";
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
    ...(entidad.esencia === "fisica" ? { filter: "drop-shadow(1px 2px 2px rgb(0 0 0 / 0.25))" } : {}),
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
  const metadatos = metadatosEntidad(entidad, opciones, tienePartes);
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

  return {
    id: apariencia.id,
    type: entidad.tipo === "objeto" ? "standard.Rectangle" : "standard.Ellipse",
    position: { x: apariencia.x, y: apariencia.y },
    size,
    ...render,
    opm: {
      kind: "entidad",
      opdId,
      entidadId: entidad.id,
      aparienciaId: apariencia.id,
      rol: rolApariencia(modelo, opdId, entidad, contornoRefinamiento),
      ...(estadosVisibles.length > 0 ? { estadosInteractivos: targetsEstado(estadosVisibles) } : {}),
      ...(modoParcial ? { partesPlegadas: selectoresPartesPlegadas(filasParciales) } : {}),
    },
    z: contornoRefinamiento ? 0 : 10,
  };
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

export function rolApariencia(modelo: Modelo, opdId: Id, entidad: Entidad, esContorno: boolean): RolApariencia {
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

export function refYEtiquetaEntidad(contornoRefinamiento: boolean, modoParcial: boolean, tieneEstados: boolean): string {
  if (contornoRefinamiento || modoParcial) return "8%";
  if (tieneEstados) return "34%";
  return "50%";
}

interface MetadatosEntidadRender {
  foldBadge: boolean;
  descripcion?: string;
  url?: string;
  tieneMetadatos: boolean;
}

export function metadatosEntidad(entidad: Entidad, opciones: OpcionesProyeccion, tienePartes: boolean): MetadatosEntidadRender {
  const descripcion = opciones.descripcionesVisibles !== false ? entidad.descripcion?.trim() : undefined;
  const url = entidad.urls?.[0]?.url;
  return {
    foldBadge: tienePartes,
    ...(descripcion ? { descripcion } : {}),
    ...(url ? { url } : {}),
    tieneMetadatos: tienePartes || !!descripcion || !!url,
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
    };
  }
}

export { dimensionesConEstados, ESTADOS } from "./estados";
export { dimensionesPlegadoParcial, PLEGADO, attrsPlegadoParcial, markupPlegadoParcial, selectoresPartesPlegadas, textoFilaPlegado } from "./plegado";
