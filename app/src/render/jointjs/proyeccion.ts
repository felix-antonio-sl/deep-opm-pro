import { esAutoInvocacion } from "../../modelo/autoinvocacion";
import { CANON } from "../../modelo/constantes";
import { etiquetaEnlaceNormalizada } from "../../modelo/etiquetasEnlace";
import { designacionesEstado } from "../../modelo/estadosDesignaciones";
import { entidadIdDeExtremo } from "../../modelo/extremos";
import { formatearNombreCompuesto } from "../../modelo/objetoMetadata";
import { estadosDeEntidad } from "../../modelo/operaciones";
import { modoPlegadoApariencia, partesDePlegado } from "../../modelo/plegado";
import type { Apariencia, Enlace, Entidad, Estado, ExtremoEnlace, Id, Modelo, Posicion, TipoEnlace } from "../../modelo/tipos";
import { proyectarOverlayAbanicoCanonico } from "./abanicoOverlay";
import { proyectarBusesAgregacion, type EnlaceConEndpointVisual } from "./agregacionBus";
import { proyectarAutoInvocacion } from "./autoinvocacionLoop";
import { targetsEstado, type EstadoTarget } from "./estadoTargets";
import { LINK_ASSETS } from "./linkAssets";
import { filasPlegadoConNesting, type FilaPlegadoParcialExtendida } from "./plegadoNesting";
import { etiquetasRuta } from "./rutaLabels";
import type { OplReferencia } from "../../opl/interaccion";

export type RolApariencia = "contorno" | "interno" | "externo";

export type OpmJointMetadata =
  | {
      kind: "entidad";
      opdId: Id;
      entidadId: Id;
      aparienciaId: Id;
      rol: RolApariencia;
      estadosInteractivos?: EstadoTarget[];
      partesPlegadas?: Array<{ selector: string; entidadId: Id }>;
    }
  | {
      kind: "enlace";
      opdId: Id;
      enlaceId: Id;
      aparienciaEnlaceId: Id;
      tipo: TipoEnlace;
    }
  | {
      kind: "proxy-plegado";
      opdId: Id;
      padreAparienciaId: Id;
      parteAparienciaId: Id;
      parteEntidadId: Id;
    }
  | {
      kind: "overlay-abanico";
      opdId: Id;
      abanicoId: Id;
      operador: "O" | "XOR";
    }
  | {
      kind: "selection-halo";
      opdId: Id;
      targetId: Id;
    };

export interface JointCellJson {
  id: Id;
  type:
    | "standard.Rectangle"
    | "standard.Ellipse"
    | "standard.Link"
    | "standard.Polygon"
    | "standard.Path"
    | "standard.Circle"
    | "opm.AbanicoArc";
  opm: OpmJointMetadata;
  z: number;
  [key: string]: unknown;
}

export interface OpcionesProyeccion {
  aliasVisibles?: boolean;
  descripcionesVisibles?: boolean;
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
  hoverOplRef: OplReferencia | null = null,
  seleccionados: readonly Id[] = [],
  opciones: OpcionesProyeccion = opcionesProyeccionGlobal(),
): JointCellJson[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  const seleccionMultiple = new Set(seleccionados);

  const apariencias = Object.values(opd.apariencias);
  const aparienciaPorEntidad = new Map(apariencias.map((apariencia) => [apariencia.entidadId, apariencia]));
  const elementos = apariencias.flatMap((apariencia) => {
    const entidad = modelo.entidades[apariencia.entidadId];
    return entidad ? [proyectarEntidad(modelo, opdId, apariencia, entidad, entidad.id === seleccionEntidadId || seleccionMultiple.has(entidad.id), refResaltaEntidad(modelo, entidad, hoverOplRef), opciones)] : [];
  });
  const proxies = apariencias.flatMap((apariencia) => proyectarProxyExtraccion(opdId, opd, apariencia));
  const overlaysAbanico = Object.values(modelo.abanicos ?? {})
    .filter((abanico) => abanico.opdId === opdId)
    .flatMap((abanico) => {
      const aparienciaPuerto = aparienciaPorEntidad.get(abanico.puertoEntidadId);
      if (!aparienciaPuerto) return [];
      return proyectarOverlayAbanicoCanonico({
        modelo,
        opd,
        abanico,
        aparienciaPuerto,
        aparienciaPorEntidad,
      });
    });
  // Enlaces que pertenecen a un abanico usan router recto para converger en
  // el dockPoint del puerto sin las rutas en L del routerManhattan, replicando
  // el OpmDefaultLink de OpCloud (shared.ts:2450-2457) cuyos enlaces
  // procedurales no setean router y caen al default 'normal'.
  const enlacesEnAbanico = new Set<Id>(
    Object.values(modelo.abanicos ?? {})
      .filter((abanico) => abanico.opdId === opdId)
      .flatMap((abanico) => abanico.enlaceIds),
  );
  const enlacesConEndpoint = Object.values(opd.enlaces).flatMap((aparienciaEnlace): EnlaceConEndpointVisual[] => {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) return [];
    const origen = resolverEndpointVisual(modelo, opd, aparienciaPorEntidad, enlace.origenId);
    const destino = resolverEndpointVisual(modelo, opd, aparienciaPorEntidad, enlace.destinoId);
    if (!origen || !destino) return [];
    if (origen.proxy || destino.proxy || origen.punto || destino.punto) return [];
    return [{ enlace, aparienciaEnlaceId: aparienciaEnlace.id, origen, destino }];
  });
  const { busCells, enlacesConsumidos } = proyectarBusesAgregacion({
    modelo,
    opdId,
    enlaces: enlacesConEndpoint,
    seleccionados: new Set([
      ...(seleccionEnlaceId ? [seleccionEnlaceId] : []),
      ...seleccionados.filter((id) => modelo.enlaces[id]),
      ...(hoverOplRef?.tipo === "enlace" ? [hoverOplRef.id] : []),
    ]),
  });
  const enlaces = Object.values(opd.enlaces).flatMap((aparienciaEnlace) => {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace || enlacesConsumidos.has(enlace.id)) return [];
    const origen = resolverEndpointVisual(modelo, opd, aparienciaPorEntidad, enlace.origenId);
    const destino = resolverEndpointVisual(modelo, opd, aparienciaPorEntidad, enlace.destinoId);
    if (!origen || !destino) return [];
    if (esAutoInvocacion(enlace) && origen.apariencia.id === destino.apariencia.id) {
      return proyectarAutoInvocacion({
        opdId,
        enlace,
        aparienciaEnlaceId: aparienciaEnlace.id,
        proceso: origen.apariencia,
        seleccionada: enlace.id === seleccionEnlaceId || refResaltaEnlace(enlace, hoverOplRef),
      });
    }
    if (origen.apariencia.id === destino.apariencia.id) return [];
    const enlaceResaltado = enlace.id === seleccionEnlaceId || seleccionMultiple.has(enlace.id) || refResaltaEnlace(enlace, hoverOplRef);
    return TIPOS_REFINAMIENTO_ESTRUCTURAL.includes(enlace.tipo) && !origen.proxy && !destino.proxy
      ? proyectarRefinamientoEstructural(opdId, enlace, aparienciaEnlace.id, origen.apariencia, destino.apariencia, enlaceResaltado)
      : [proyectarEnlace(opdId, enlace, aparienciaEnlace.id, origen, destino, aparienciaEnlace.vertices, enlaceResaltado, enlacesEnAbanico.has(enlace.id))];
  });

  const halos = seleccionMultiple.size > 1
    ? apariencias.flatMap((apariencia) => {
        const entidad = modelo.entidades[apariencia.entidadId];
        if (!entidad || !seleccionMultiple.has(entidad.id)) return [];
        return [proyectarHaloSeleccion(opdId, apariencia, entidad)];
      })
    : [];

  return [...busCells, ...enlaces, ...proxies, ...overlaysAbanico, ...elementos, ...halos];
}

function opcionesProyeccionGlobal(): OpcionesProyeccion {
  const global = globalThis as typeof globalThis & {
    __deepOpmUiAliasVisibles?: boolean;
    __deepOpmUiDescripcionesVisibles?: boolean;
  };
  return {
    aliasVisibles: global.__deepOpmUiAliasVisibles ?? true,
    descripcionesVisibles: global.__deepOpmUiDescripcionesVisibles ?? true,
  };
}

export function fijarOpcionesProyeccionGlobal(opciones: Required<OpcionesProyeccion>): void {
  const global = globalThis as typeof globalThis & {
    __deepOpmUiAliasVisibles?: boolean;
    __deepOpmUiDescripcionesVisibles?: boolean;
  };
  global.__deepOpmUiAliasVisibles = opciones.aliasVisibles;
  global.__deepOpmUiDescripcionesVisibles = opciones.descripcionesVisibles;
}

function proyectarEntidad(
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
  const contornoRefinamiento = refinada && entidad.refinamiento?.opdId === opdId;
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
    strokeDasharray: entidad.afiliacion === "ambiental" ? "8 4" : undefined,
    filter: entidad.esencia === "fisica" ? "drop-shadow(1px 2px 2px rgb(0 0 0 / 0.25))" : undefined,
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

  return {
    id: apariencia.id,
    type: entidad.tipo === "objeto" ? "standard.Rectangle" : "standard.Ellipse",
    position: { x: apariencia.x, y: apariencia.y },
    size,
    ...(modoParcial
      ? { markup: markupPlegadoParcial(bodyTag, filasParciales), attrs: attrsPlegadoParcial(attrsBase, size, filasParciales) }
      : estadosVisibles.length > 0
        ? { markup: markupConEstados(bodyTag, estadosVisibles, metadatos), attrs: attrsConEstados(attrsBase, size, estadosVisibles, metadatos, entidad.layoutEstados) }
        : tienePartes
          ? { markup: markupConBadge(bodyTag, metadatos), attrs: attrsConBadge(attrsBase, size, metadatos) }
          : metadatos.tieneMetadatos
            ? { markup: markupConBadge(bodyTag, metadatos), attrs: attrsConBadge(attrsBase, size, metadatos) }
            : { attrs: attrsBase }),
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

function proyectarHaloSeleccion(opdId: Id, apariencia: Apariencia, entidad: Entidad): JointCellJson {
  const pad = 4;
  const type = entidad.tipo === "objeto" ? "standard.Rectangle" : "standard.Ellipse";
  const width = apariencia.width + pad * 2;
  const height = apariencia.height + pad * 2;
  return {
    id: `seleccion-${apariencia.id}`,
    type,
    position: { x: apariencia.x - pad, y: apariencia.y - pad },
    size: { width, height },
    attrs: {
      body: entidad.tipo === "objeto"
        ? {
            fill: "transparent",
            stroke: "#3DA8FF",
            strokeWidth: 2,
            rx: 6,
            ry: 6,
            pointerEvents: "none",
          }
        : {
            fill: "transparent",
            stroke: "#3DA8FF",
            strokeWidth: 2,
            cx: width / 2,
            cy: height / 2,
            rx: width / 2,
            ry: height / 2,
            pointerEvents: "none",
          },
      label: { text: "", display: "none" },
    },
    opm: {
      kind: "selection-halo",
      opdId,
      targetId: entidad.id,
    },
    z: 30,
  };
}

function refResaltaEntidad(modelo: Modelo, entidad: Entidad, ref: OplReferencia | null): boolean {
  if (!ref) return false;
  if (ref.tipo === "entidad") return ref.id === entidad.id;
  if (ref.tipo === "estado") return modelo.estados[ref.id]?.entidadId === entidad.id;
  return false;
}

function refResaltaEnlace(enlace: Enlace, ref: OplReferencia | null): boolean {
  return ref?.tipo === "enlace" && ref.id === enlace.id;
}

function colorTextoParaFill(fill: string): string {
  const hex = normalizarHex6(fill);
  if (!hex) return CANON.colores.texto;
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const luminancia = 0.2126 * canalSrgb(r) + 0.7152 * canalSrgb(g) + 0.0722 * canalSrgb(b);
  return luminancia < 0.36 ? "#ffffff" : CANON.colores.texto;
}

function normalizarHex6(value: string): string | null {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(value)) {
    const r = value.charAt(1);
    const g = value.charAt(2);
    const b = value.charAt(3);
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return null;
}

function canalSrgb(value: number): number {
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
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

function dimensionesPlegadoParcial(apariencia: Apariencia, nombrePadre: string, filas: FilaPlegadoParcialExtendida[]): { width: number; height: number } {
  const textoMasLargo = [nombrePadre, ...filas.map(textoFilaPlegado)]
    .reduce((max, texto) => Math.max(max, texto.length), 0);
  const width = Math.max(apariencia.width, CANON.dims.cosaWidth, textoMasLargo * 7 + 36);
  const height = Math.max(apariencia.height, PLEGADO.headerHeight + filas.length * PLEGADO.rowHeight + PLEGADO.paddingBottom);
  return { width, height };
}

function dimensionesConEstados(apariencia: Apariencia, nombre: string, estados: Estado[], layout: Entidad["layoutEstados"]): { width: number; height: number } {
  const capsulas = estados.map((estado) => anchoCapsulaEstado(estado.nombre));
  const vertical = layout === "vertical";
  const anchoEstados = vertical
    ? Math.max(...capsulas, ESTADOS.minWidth)
    : capsulas.reduce((total, ancho) => total + ancho, 0) + Math.max(0, capsulas.length - 1) * ESTADOS.gap;
  const altoEstados = vertical
    ? estados.length * ESTADOS.capsuleHeight + Math.max(0, estados.length - 1) * ESTADOS.gap
    : ESTADOS.regionHeight;
  const width = Math.max(apariencia.width, CANON.dims.cosaWidth, nombre.length * 7 + 24, anchoEstados + ESTADOS.paddingX * 2);
  const height = Math.max(apariencia.height, CANON.dims.cosaHeight + altoEstados + ESTADOS.paddingBottom);
  return { width, height };
}

function refYEtiquetaEntidad(contornoRefinamiento: boolean, modoParcial: boolean, tieneEstados: boolean): string {
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

function metadatosEntidad(entidad: Entidad, opciones: OpcionesProyeccion, tienePartes: boolean): MetadatosEntidadRender {
  const descripcion = opciones.descripcionesVisibles !== false ? entidad.descripcion?.trim() : undefined;
  const url = entidad.urls?.[0]?.url;
  return {
    foldBadge: tienePartes,
    ...(descripcion ? { descripcion } : {}),
    ...(url ? { url } : {}),
    tieneMetadatos: tienePartes || !!descripcion || !!url,
  };
}

function markupConBadge(bodyTag: "rect" | "ellipse", metadatos: MetadatosEntidadRender): Array<Record<string, unknown>> {
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

function markupConEstados(
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

function markupPlegadoParcial(bodyTag: "rect" | "ellipse", filas: FilaPlegadoParcialExtendida[]): Array<Record<string, unknown>> {
  const rows = filas.flatMap((fila, index) => [
    { tagName: "line", selector: `partSeparator${index}` },
    ...(fila.tipo === "parte" ? [{ tagName: "rect", selector: `partHit${index}` }] : []),
    { tagName: "text", selector: fila.tipo === "parte" ? `partLabel${index}` : `partCounter${index}` },
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

function attrsConEstados(
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

function aplicarMetadatosAttrs(
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

function attrsPlegadoParcial(
  attrsBase: Record<string, unknown>,
  size: { width: number; height: number },
  filas: FilaPlegadoParcialExtendida[],
): Record<string, unknown> {
  const attrs: Record<string, unknown> = {
    ...attrsBase,
    label: {
      ...(attrsBase.label as Record<string, unknown>),
      textWrap: { width: size.width - 24 },
    },
  };
  for (const [index, fila] of filas.entries()) {
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
    if (fila.tipo === "parte") {
      attrs[`partHit${index}`] = {
        x: 12,
        y,
        width: size.width - 24,
        height: PLEGADO.rowHeight,
        fill: "transparent",
        stroke: "transparent",
        cursor: "pointer",
      };
    }
    const selector = fila.tipo === "parte" ? `partLabel${index}` : `partCounter${index}`;
    attrs[selector] = {
      text: textoFilaPlegado(fila),
      x: size.width / 2,
      y: y + PLEGADO.rowHeight / 2,
      fill: fila.tipo === "parte" && !fila.extraida ? CANON.colores.texto : "#667085",
      fontFamily: CANON.dims.fontFamily,
      fontSize: 12,
      fontWeight: CANON.dims.fontWeight,
      fontStyle: fila.tipo === "contador" || fila.extraida ? "italic" : undefined,
      textDecoration: fila.tipo === "parte" && fila.extraida ? "line-through" : undefined,
      opacity: fila.tipo === "parte" && fila.extraida ? 0.64 : 1,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      textWrap: { width: size.width - 24, height: PLEGADO.rowHeight - 4 },
      pointerEvents: fila.tipo === "parte" ? "auto" : "none",
      cursor: fila.tipo === "parte" ? "pointer" : undefined,
    };
  }
  return attrs;
}

function selectoresPartesPlegadas(filas: FilaPlegadoParcialExtendida[]): Array<{ selector: string; entidadId: Id }> {
  return filas.flatMap((fila, index) => fila.tipo === "parte"
    ? [
        { selector: `partLabel${index}`, entidadId: fila.entidadId },
        { selector: `partHit${index}`, entidadId: fila.entidadId },
      ]
    : []);
}

function textoFilaPlegado(fila: FilaPlegadoParcialExtendida): string {
  if (fila.tipo === "contador") return fila.texto;
  return fila.indicadorNesting ? `${fila.indicadorNesting} ${fila.nombre}` : fila.nombre;
}

function anchoCapsulaEstado(nombre: string): number {
  return Math.max(ESTADOS.minWidth, nombre.length * 7 + ESTADOS.paddingHorizontal * 2);
}

interface EndpointVisual {
  apariencia: Apariencia;
  proxy?: { entidadId: Id; nombre: string };
  punto?: Posicion;
}

function resolverEndpointVisual(
  modelo: Modelo,
  opd: { apariencias: Record<Id, Apariencia> },
  aparienciaPorEntidad: Map<Id, Apariencia>,
  extremo: ExtremoEnlace,
): EndpointVisual | null {
  const entidadId = entidadIdDeExtremo(modelo, extremo);
  if (!entidadId) return null;
  const directa = aparienciaPorEntidad.get(entidadId);
  if (directa) {
    const punto = extremo.kind === "estado" ? puntoCapsulaEstado(modelo, directa, extremo.id) : null;
    return punto ? { apariencia: directa, punto } : { apariencia: directa };
  }
  for (const apariencia of Object.values(opd.apariencias)) {
    if (modoPlegadoApariencia(apariencia) !== "parcial") continue;
    const parte = partesDePlegado(modelo, apariencia.entidadId).find((item) => item.entidadId === entidadId);
    if (parte) return { apariencia, proxy: { entidadId, nombre: parte.nombre } };
  }
  return null;
}

function proyectarProxyExtraccion(opdId: Id, opd: { apariencias: Record<Id, Apariencia> }, apariencia: Apariencia): JointCellJson[] {
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

function puntoCapsulaEstado(modelo: Modelo, apariencia: Apariencia, estadoId: Id): Posicion | null {
  const estado = modelo.estados[estadoId];
  const entidad = estado ? modelo.entidades[estado.entidadId] : undefined;
  if (!estado || !entidad) return null;
  if (modoPlegadoApariencia(apariencia) === "parcial") return null;
  const estados = estadosDeEntidad(modelo, entidad.id).filter((item) => !item.suprimido);
  const index = estados.findIndex((item) => item.id === estadoId);
  if (index < 0) return null;
  const size = dimensionesConEstados(apariencia, formatearNombreCompuesto(entidad), estados, entidad.layoutEstados);
  const anchos = estados.map((item) => anchoCapsulaEstado(item.nombre));
  const vertical = entidad.layoutEstados === "vertical";
  const anchoActual = anchos[index] ?? ESTADOS.minWidth;
  const anchoTotal = vertical
    ? anchoActual
    : anchos.reduce((total, ancho) => total + ancho, 0) + Math.max(0, anchos.length - 1) * ESTADOS.gap;
  const xInicial = (size.width - anchoTotal) / 2;
  const x = vertical
    ? xInicial + anchoActual / 2
    : xInicial + anchos.slice(0, index).reduce((total, ancho) => total + ancho + ESTADOS.gap, 0) + anchoActual / 2;
  const altoTotal = vertical
    ? estados.length * ESTADOS.capsuleHeight + Math.max(0, estados.length - 1) * ESTADOS.gap
    : ESTADOS.capsuleHeight;
  const yBase = size.height - ESTADOS.paddingBottom - altoTotal + ESTADOS.capsuleHeight / 2;
  const y = vertical
    ? yBase + index * (ESTADOS.capsuleHeight + ESTADOS.gap)
    : yBase;
  return {
    x: apariencia.x + x,
    y: apariencia.y + y,
  };
}

function proyectarEnlace(
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
  return {
    id: aparienciaEnlaceId,
    type: "standard.Link",
    source: endpointJoint(origen),
    target: endpointJoint(destino),
    vertices: verticesRender,
    router,
    connector: { name: "straight" },
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
        strokeDasharray: dashOverride,
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

function etiquetasProxyParte(origen: EndpointVisual, destino: EndpointVisual): Array<Record<string, unknown>> {
  const labels: Array<Record<string, unknown>> = [];
  if (origen.proxy) labels.push(etiquetaProxyParte(origen.proxy.nombre, 28));
  if (destino.proxy) labels.push(etiquetaProxyParte(destino.proxy.nombre, -28));
  return labels;
}

function etiquetaProxyParte(text: string, distance: number): Record<string, unknown> {
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

function endpointJoint(endpoint: EndpointVisual): Record<string, unknown> {
  if (endpoint.punto) return { x: endpoint.punto.x, y: endpoint.punto.y };
  return extremo(endpoint.apariencia.id);
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

function etiquetasModificador(enlace: Enlace): Array<Record<string, unknown>> {
  const labels: Array<Record<string, unknown>> = [];
  if (enlace.modificador) {
    labels.push(etiquetaBadgeModificador(textoModificador(enlace.modificador), 0));
  }
  if (enlace.modificador === "evento" && enlace.probabilidad !== undefined) {
    labels.push(etiquetaTextoModificador(`${Math.round(enlace.probabilidad * 100)}%`, 0, 22));
  }
  if (enlace.tipo === "invocacion" && enlace.demora) {
    labels.push(etiquetaTextoModificador(enlace.demora, 0, -28));
  }
  return labels;
}

function textoModificador(modificador: NonNullable<Enlace["modificador"]>): string {
  if (modificador === "condicion") return "c";
  if (modificador === "evento") return "E";
  return "¬";
}

function etiquetaBadgeModificador(text: string, distance: number): Record<string, unknown> {
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

function etiquetaTextoModificador(text: string, distance: number, offset: number): Record<string, unknown> {
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

function etiquetaEnlace(enlace: Enlace): Array<Record<string, unknown>> {
  const etiqueta = etiquetaEnlaceNormalizada(enlace.etiqueta);
  return etiqueta ? [etiquetaTextoEnlace(etiqueta)] : [];
}

function etiquetaTextoEnlace(text: string): Record<string, unknown> {
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

function marcadoresEstructurales(
  tipo: TipoEnlace,
  triangleId: Id,
  center: Posicion,
  size: number,
  seleccionada: boolean,
  meta: OpmJointMetadata,
): JointCellJson[] {
  const angle = 0;
  const position = { x: center.x - size / 2, y: center.y - size / 2 };
  const strokeWidth = seleccionada ? CANON.dims.enlaceVisible + 2 : CANON.dims.enlaceVisible;
  const stroke = CANON.colores.enlace;

  if (tipo === "exhibicion") {
    // Canon OpCloud (shared.ts ExhibitionLink.getTriangleSVG): outer triangulo
    // SOLO contorno (fill blanco + stroke color) + inner pequeno relleno con color.
    const innerStrokeWidth = Math.max(1, strokeWidth - 1);
    return [
      polyShapeCell(triangleId, "standard.Polygon", position, size, angle, {
        refPoints: LINK_ASSETS.structural.agregacion.markerPoints,
        fill: "white",
        stroke,
        strokeWidth,
        cursor: "pointer",
      }, meta),
      {
        id: `${triangleId}-pequeno`,
        type: "standard.Polygon",
        position: { x: position.x + 9, y: position.y + 12 },
        size: { width: 12, height: 12 },
        angle,
        attrs: {
          body: {
            refPoints: LINK_ASSETS.structural.agregacion.markerPoints,
            fill: stroke,
            stroke,
            strokeWidth: innerStrokeWidth,
            cursor: "pointer",
          },
          label: { text: "", display: "none" },
        },
        opm: meta,
        z: 3,
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
        position: { x: position.x + dot.cx - dot.r, y: position.y + dot.cy - dot.r },
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
